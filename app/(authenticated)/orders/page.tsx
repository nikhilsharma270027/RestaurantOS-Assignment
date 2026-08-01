// app/(authenticated)/orders/page.tsx
import type { Metadata } from "next";
import { ResourceView } from "../../components/resource/resource-view";
import { ordersResource } from "@/app/lib/resources";

export const metadata: Metadata = {
  title: "Orders — RestaurantOS",
  description: "Track dine-in, takeaway and delivery orders in real time.",
  openGraph: {
    title: "Orders — RestaurantOS",
    description: "Track dine-in, takeaway and delivery orders in real time.",
  },
};

export default function OrdersPage() {
  return <ResourceView config={ordersResource} />;
}