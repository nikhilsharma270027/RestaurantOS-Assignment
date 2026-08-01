// app/(authenticated)/dashboard/dashboard-content.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ReceiptText, Wallet, PackageSearch, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { AppShell } from "../../components/layout/app-shell";

// Types
interface DashboardData {
  orders: any[];
  expenses: any[];
  products: any[];
  ingredients: any[];
  tables: any[];
}

// Helpers
function currency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Stat Component
function Stat({ label, value, hint, icon: Icon }: { label: string; value: string; hint: string; icon: React.ElementType }) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // In dashboard-content.tsx
  async function fetchDashboardData() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch dashboard data");
      }

      setData(result);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError(error instanceof Error ? error.message : "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }

  // Show loading skeleton only while fetching
  if (isLoading) {
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

  // Show error state
  if (error) {
    return (
      <AppShell title="Dashboard" description="Something went wrong">
        <div className="surface-card p-8 text-center">
          <AlertTriangle className="size-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </AppShell>
    );
  }

  // Now data is guaranteed to be loaded (even if empty)
  const { orders = [], expenses = [], products = [], ingredients = [], tables = [] } = data || {};

  const revenue = orders.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  const spend = expenses.reduce((sum, e) => sum + Number(e.amount ?? 0), 0);

  const openOrders = orders.filter((o) => ["PENDING", "PREPARING", "READY"].includes(o.status)).length;

  const occupied = tables.filter((t) => t.isOccupied).length;

  // Updated low stock filter
const lowStock = [
  ...products.map((p: any) => ({
    name: p.name,
    qty: Number(p.quantityOnHand ?? 0),
    reorder: Number(p.reorderLevel ?? 0),
    kind: "Product",
  })),
  ...ingredients.map((i: any) => ({
    name: i.name,
    qty: Number(i.currentStock ?? 0),
    reorder: Number(i.reorderLevel ?? 0),
    kind: "Ingredient",
  })),
]
  .filter((item) => {
    // ✅ Show if:
    // 1. Stock is at or below reorder level (and reorder level is set)
    // 2. OR stock is completely out (0 or negative)
    if (item.reorder > 0 && item.qty <= item.reorder) return true;
    if (item.qty <= 0) return true; // Out of stock
    return false;
  })
  .sort((a, b) => {
    // Sort by severity: out of stock first, then closest to zero
    if (a.qty === 0 && b.qty !== 0) return -1;
    if (b.qty === 0 && a.qty !== 0) return 1;
    return a.qty - b.qty; // Lowest quantity first
  })
  .slice(0, 8);

  const byDay = new Map<string, number>();
  for (const order of orders) {
    if (order.status === "CANCELLED") continue;
    const day = new Date(order.createdAt || order.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    byDay.set(day, (byDay.get(day) ?? 0) + Number(order.total ?? 0));
  }
  const chart = [...byDay.entries()]
    .slice(0, 10)
    .reverse()
    .map(([day, total]) => ({ day, total }));

  return (
    <AppShell
      title="Dashboard"
      description="Today's service, spend and stock risk at a glance."
      actions={
        <Button asChild variant="outline">
          <Link href="/ai-insights">
            AI insights <ArrowRight className="size-4" />
          </Link>
        </Button>
      }>
      {/* Stats - always show, even with 0 values */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue" value={currency(revenue)} hint="Last 200 orders" icon={TrendingUp} />
        <Stat label="Open orders" value={String(openOrders)} hint="Pending, preparing or ready" icon={ReceiptText} />
        <Stat label="Expenses" value={currency(spend)} hint="Recorded operating spend" icon={Wallet} />
        <Stat label="Tables occupied" value={`${occupied}/${tables.length}`} hint="Tables on the floor" icon={PackageSearch} />
      </div>

      {/* Charts & Low Stock */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="surface-card p-5 lg:col-span-3">
          <h2 className="font-display text-lg font-semibold">Revenue by day</h2>
          <p className="text-sm text-muted-foreground">Order value grouped by service date.</p>
          <div className="mt-5 h-64">
            {chart.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">No orders recorded yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "var(--accent)" }}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                    }}
                    // formatter={(v: number) => currency(v)}
                  />
                  <Bar dataKey="total" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="surface-card p-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-warning-foreground" />
            <h2 className="font-display text-lg font-semibold">Reorder now</h2>
          </div>
          <p className="text-sm text-muted-foreground">Items at or below their reorder level.</p>
          <div className="mt-4 space-y-2">
            {lowStock.length === 0 ? (
              <p className="rounded-lg bg-accent p-4 text-sm text-accent-foreground">✅ Everything is above its reorder level.</p>
            ) : (
              lowStock.map((row) => (
                <div
                  key={`${row.kind}-${row.name}`}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.kind}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      row.qty === 0 ? "bg-red-100 text-red-800 border-red-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"
                    }>
                    {row.qty} / {row.reorder}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Latest Orders */}
      <div className="surface-card mt-6 p-5">
        <h2 className="font-display text-lg font-semibold">Latest orders</h2>
        <div className="mt-4 space-y-2">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ReceiptText className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No orders yet — create one from the Orders page.</p>
              <Button asChild className="mt-4">
                <Link href="/orders">Create Order</Link>
              </Button>
            </div>
          ) : (
            orders.slice(0, 6).map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{order.orderNumber || order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(order.createdAt || order.created_at)} · {titleCase(order.status)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{titleCase(order.status)}</Badge>
                  <span className="text-sm font-medium">{currency(Number(order.total ?? 0))}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
