import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, lastLoginMethodClient } from "better-auth/client/plugins";
import { auth as serverAuth } from "./auth";


export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
    plugins: [nextCookies(), inferAdditionalFields<typeof serverAuth>(), lastLoginMethodClient()]
})

export const getSession = async () => {
  try {
    const response = await fetch("/api/auth/get-session");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};

export const { signIn, signUp, useSession } = createAuthClient()