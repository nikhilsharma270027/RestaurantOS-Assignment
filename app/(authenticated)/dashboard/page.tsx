// app/(authenticated)/dashboard/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
// import { DashboardContent } from "./dashboard-content";
import { DashboardLoading } from "./dashboard-loading";
import { DashboardContent } from "./dashboard-content";

// Metadata must be in a server component
export const metadata: Metadata = {
  title: "Dashboard — RestaurantOS",
  description: "Live revenue, orders, stock risk and spend for your restaurant.",
  openGraph: {
    title: "Dashboard — RestaurantOS",
    description: "Live revenue, orders, stock risk and spend for your restaurant.",
  },
};

// Server Component wrapper
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}