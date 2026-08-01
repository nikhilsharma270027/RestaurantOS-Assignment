// app/(authenticated)/ai-insights/page.tsx
import type { Metadata } from "next";
import { AIInsightsContent } from "./ai-insights-content";

export const metadata: Metadata = {
  title: "AI Insights — RestaurantOS",
  description: "AI demand forecasts, stock alerts and cost-saving suggestions.",
  openGraph: {
    title: "AI Insights — RestaurantOS",
    description: "AI demand forecasts, stock alerts and cost-saving suggestions.",
  },
};

export default function AIInsightsPage() {
  return <AIInsightsContent />;
}