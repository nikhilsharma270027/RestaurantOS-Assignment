// app/(authenticated)/dashboard/dashboard-loading.tsx
import { Skeleton } from "../../components/ui/skeleton";
import { AppShell } from "../../components/layout/app-shell";

export function DashboardLoading() {
  return (
    <AppShell title="Dashboard" description="Loading your latest numbers…">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="mt-6 h-72 w-full rounded-xl" />
    </AppShell>
  );
}