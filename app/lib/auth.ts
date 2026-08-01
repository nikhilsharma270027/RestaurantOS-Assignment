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

export const auth = betterAuth({
  baseURL: requireEnv("BETTER_AUTH_URL"),
  secret: requireEnv("AUTH_SECRET"),
  trustedOrigins: [
    process.env.BETTER_AUTH_URL!,
    "https://*.vercel.app"
  ],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Authentication methods
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  // Email verification (optional)
  emailVerification: {
    sendOnSignUp: false, // Set to true if you want email verification
  },

  // Map your custom schema fields
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

  // app/lib/auth.ts
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
          role: dbUser?.role || "WAITER", // ✅ Make sure role is included
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

  // Hooks
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Password validation
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
            // FIX: Change 'error.errors' to 'result.error.issues'
            message: result.error.issues[0]?.message || "Password not strong enough",
          });
        }
      }

      // Optional: Make first user an OWNER
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

  // Session configuration
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
});