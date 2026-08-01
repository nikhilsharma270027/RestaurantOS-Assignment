// app/lib/auth.ts
import { APIError, betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { lastLoginMethod, customSession } from "better-auth/plugins";
import { passwordSchema } from "./validation";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

// ✅ Get the correct base URL
const baseURL = process.env.BETTER_AUTH_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  secret: requireEnv("AUTH_SECRET"),
  
  trustedOrigins: [
    baseURL,
    "http://localhost:3000",
    "https://*.vercel.app",
  ],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  emailVerification: {
    sendOnSignUp: false,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "WAITER",
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
      },
    },
  },

  plugins: [
    lastLoginMethod(),
    customSession(async ({ user, session }) => {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: session.userId },
          select: {
            name: true,
            role: true,
            isActive: true,
            employeeId: true,
            phone: true,
          },
        });

        return {
          user: {
            ...user,
            role: dbUser?.role || "WAITER",
            isActive: dbUser?.isActive ?? true,
            employeeId: dbUser?.employeeId || null,
            phone: dbUser?.phone || null,
          },
          session,
        };
      } catch (error) {
        console.error("Error in customSession:", error);
        return {
          user: {
            ...user,
            role: "WAITER",
            isActive: true,
            employeeId: null,
            phone: null,
          },
          session,
        };
      }
    }),
  ],

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body?.password ?? ctx.body?.newPassword;
        if (!password) return;

        const result = passwordSchema.safeParse(password);
        if (!result.success) {
          throw new APIError("BAD_REQUEST", {
            message: result.error.issues[0]?.message || "Password not strong enough",
          });
        }
      }

      if (ctx.path === "/sign-up/email") {
        try {
          const userCount = await prisma.user.count();
          if (userCount === 0) {
            ctx.body.role = "OWNER";
            ctx.body.isActive = true;
          }
        } catch (error) {
          console.error("Error checking user count:", error);
        }
      }
    }),
  },

  session: {
    expiresIn: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});