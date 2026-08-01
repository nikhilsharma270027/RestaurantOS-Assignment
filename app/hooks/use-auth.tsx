// hooks/use-auth.ts
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: (session.user as any).role || "WAITER", // ✅ Get role from session
          isActive: (session.user as any).isActive ?? true,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [session, isPending]);

  const signOut = async () => {
    await authClient.signOut();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    roles: user?.role ? [user.role] : [], // ✅ Return roles as array
    signOut,
  };
}