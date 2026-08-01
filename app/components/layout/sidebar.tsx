// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { NAV_GROUPS } from "@/app/lib/rbac";
import { ScrollArea } from "../../components/ui/scroll-area";
import { cn } from "../../lib/utils";

function NavIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name] || Icons.Circle;
  return <IconComponent className={className} />;
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const roles = user?.role ? [user.role] : [];

  return (
    <ScrollArea className="h-full" >
      <div className="px-3 pb-8">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter(
            (item) => !item.roles || roles.some((r: any) => item.roles!.includes(r))
          );
          if (items.length === 0) return null;

          return (
            <div key={group.label} className="mt-6 first:mt-2">
              <p className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gray-400">
                {group.label}
              </p>
              <nav className="space-y-0.5">
                {items.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <NavIcon name={item.icon} className="size-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}