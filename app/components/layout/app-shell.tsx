// components/layout/app-shell.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Menu } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Sidebar } from "../layout/sidebar";

interface AppShellProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}


export function AppShell({
  title,
  description,
  actions,
  children,
  user: propUser,
}: AppShellProps) {
  const { user: hookUser, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = propUser || hookUser;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth");
    router.refresh();
  };

  const brand = (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <div className="grid size-9 place-items-center rounded-lg bg-linear-to-br from-orange-500 to-red-500">
        <UtensilsCrossed className="size-5 text-white" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-base font-semibold">RestaurantOS</p>
        <p className="text-[0.68rem] uppercase tracking-widest text-gray-500">
          Control Centre
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 ">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        {brand}
        <div className="min-h-0 flex-1">
          <Sidebar onNavigate={() => {}} />
        </div>
        <div className="border-t border-gray-200 p-3">
          {user && (
            <>
              <div className="mb-2 px-2 ">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="mb-3 flex flex-wrap gap-1 px-2">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {user.role}
                </span>
              </div>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white/85 px-4 py-4 backdrop-blur md:px-8">
          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white p-0">
              {brand}
              <div className="min-h-0 flex-1">
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="border-t border-gray-200 p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold md:text-2xl">
              {title}
            </h1>
            {description && (
              <p className="truncate text-sm text-gray-500">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}