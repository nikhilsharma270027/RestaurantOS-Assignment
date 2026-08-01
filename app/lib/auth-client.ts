// app/lib/auth-client.ts
"use client";

import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

// ✅ This will be https://restaurant-os-assignment.vercel.app in production
// ✅ This will be http://localhost:3000 in development
const baseURL = typeof window !== "undefined" 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    nextCookies(),
    inferAdditionalFields<typeof auth>(),
  ],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;