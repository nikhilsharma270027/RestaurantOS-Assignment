// app/(authenticated)/invoices/page.tsx
import type { Metadata } from "next";
import { InvoicesContent } from "./invoices-content";

export const metadata: Metadata = {
  title: "AI Invoices — RestaurantOS",
  description: "Upload printed or handwritten supplier invoices and extract them with AI.",
  openGraph: {
    title: "AI Invoices — RestaurantOS",
    description: "Upload printed or handwritten supplier invoices and extract them with AI.",
  },
};

export default function InvoicesPage() {
  return <InvoicesContent />;
}