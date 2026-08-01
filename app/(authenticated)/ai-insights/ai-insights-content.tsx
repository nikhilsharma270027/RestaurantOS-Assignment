// app/(authenticated)/ai-insights/ai-insights-content.tsx
"use client";

import { useState } from "react";
import { Sparkles, Loader2, TrendingUp, AlertTriangle, Lightbulb, ChefHat } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "../../components/layout/app-shell";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";

interface InsightPayload {
  headline: string;
  demand_forecast: { item: string; expected_units: number; rationale: string }[];
  stock_alerts: { product: string; risk: "high" | "medium" | "low"; action: string }[];
  cost_savings: { area: string; suggestion: string; potential_monthly_saving: number | null }[];
  menu_moves: { item: string; recommendation: string }[];
}

function currency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="size-5 text-primary" />
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function AIInsightsContent() {
  const [result, setResult] = useState<InsightPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateInsights() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/ai/insights", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate insights");
      }

      setResult(data);
      toast.success("Insights generated successfully");
    } catch (error) {
      console.error("Failed to generate insights:", error);
      const message = error instanceof Error ? error.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <AppShell
        title="AI Insights"
        description="Forecasts and recommendations generated from your live operating data."
      >
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell
        title="AI Insights"
        description="Forecasts and recommendations generated from your live operating data."
        actions={
          <Button onClick={generateInsights} disabled={isLoading}>
            <Sparkles className="size-4" /> Retry
          </Button>
        }
      >
        <div className="surface-card flex flex-col items-center gap-3 p-16 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <p className="font-display text-xl font-semibold">Failed to generate insights</p>
          <p className="max-w-md text-sm text-muted-foreground">{error}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="AI Insights"
      description="Forecasts and recommendations generated from your live operating data."
      actions={
        <Button onClick={generateInsights} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {result ? "Regenerate" : "Generate insights"}
        </Button>
      }
    >
      {!result ? (
        <div className="surface-card flex flex-col items-center gap-3 p-16 text-center">
          <Sparkles className="size-8 text-primary" />
          <p className="font-display text-xl font-semibold">
            Ask the assistant for a read on the business
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            It reviews recent orders, stock levels, ingredient waste, menu margins and
            expenses, then returns demand forecasts, shortage warnings and cost-saving
            moves.
          </p>
          <Button onClick={generateInsights} disabled={isLoading} size="lg">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Generate insights
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Headline */}
          <div className="surface-card bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <p className="text-sm uppercase tracking-widest text-white/70">Headline</p>
            <p className="mt-2 font-display text-2xl font-semibold">{result.headline}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Demand Forecast */}
            <Section title="Demand Forecast" icon={TrendingUp}>
              {result.demand_forecast?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No forecast data available.</p>
              ) : (
                result.demand_forecast?.map((d) => (
                  <div key={d.item} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{d.item}</p>
                      <Badge variant="secondary">{d.expected_units} units</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{d.rationale}</p>
                  </div>
                ))
              )}
            </Section>

            {/* Stock Alerts */}
            <Section title="Stock Alerts" icon={AlertTriangle}>
              {result.stock_alerts?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No stock alerts.</p>
              ) : (
                result.stock_alerts?.map((s) => (
                  <div key={s.product} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{s.product}</p>
                      <Badge
                        variant="outline"
                        className={
                          s.risk === "high"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : s.risk === "medium"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-green-100 text-green-800 border-green-300"
                        }
                      >
                        {s.risk} risk
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.action}</p>
                  </div>
                ))
              )}
            </Section>

            {/* Cost Savings */}
            <Section title="Cost Savings" icon={Lightbulb}>
              {result.cost_savings?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No cost-saving suggestions.</p>
              ) : (
                result.cost_savings?.map((c) => (
                  <div key={c.area} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{c.area}</p>
                      {c.potential_monthly_saving ? (
                        <Badge variant="secondary">
                          {currency(c.potential_monthly_saving)}/mo
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.suggestion}</p>
                  </div>
                ))
              )}
            </Section>

            {/* Menu Moves */}
            <Section title="Menu Moves" icon={ChefHat}>
              {result.menu_moves?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No menu recommendations.</p>
              ) : (
                result.menu_moves?.map((m) => (
                  <div key={m.item} className="rounded-lg border p-3">
                    <p className="font-medium">{m.item}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{m.recommendation}</p>
                  </div>
                ))
              )}
            </Section>
          </div>
        </div>
      )}
    </AppShell>
  );
}