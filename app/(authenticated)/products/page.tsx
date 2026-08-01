// app/(authenticated)/products/page.tsx
import type { Metadata } from "next";
import { ResourceView } from "../../components/resource/resource-view";
import { productsResource } from "../../../app/lib/resources";

export const metadata: Metadata = {
  title: "Products — RestaurantOS",
  description: "Inventory products and reorder levels.",
  openGraph: {
    title: "Products — RestaurantOS",
    description: "Inventory products and reorder levels.",
  },
};

export default function ProductsPage() {
  return <ResourceView config={productsResource} />;
}