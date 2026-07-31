import { APIError, betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { lastLoginMethod, customSession } from "better-auth/plugins";
import { passwordSchema } from "./validation";
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "@/generated/prisma/client";

function requireEnv(name: string) {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is not set`);
    return value;
}

// const prisma = new PrismaClient();
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

    // Authendication
    //...other options
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        // github: {
        //     clientId: process.env.GITHUB_CLIENT_ID as string,
        //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        // },
    },

    //

    plugins: [
        lastLoginMethod(),
        customSession(async ({ user, session }) => {
            const dbUser = await prisma.user.findUnique({
                where: {
                    id: session.userId, // ✅ FIXED
                },
                select: {
                    username: true,
                    role: true,
                },
            });

            return {
                user: {
                    ...user,
                    username: dbUser?.username,
                    role: dbUser?.role || "user",
                    newField: "newField",
                },
                session,
            };
        }),
    ],

    // create auth middleware for your API routes
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (
                ctx.path === "/sign-up/email" ||
                ctx.path === "/reset-password" ||
                ctx.path === "/change-password"
            ) {
                const password =
                    ctx.body?.password ?? ctx.body?.newPassword;

                if (!password) return;

                const { error } = passwordSchema.safeParse(password);
                if (error) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Password not strong enough",
                    });
                }
            }
        }),
    },
});