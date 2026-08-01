// app/(authenticated)/ingredients/page.tsx
import type { Metadata } from "next";
import { ResourceView } from "../../components/resource/resource-view";
import { ingredientsResource } from "@/app/lib/resources";

export const metadata: Metadata = {
  title: "Ingredients — RestaurantOS",
  description: "Track kitchen ingredients, stock levels, and costs.",
  openGraph: {
    title: "Ingredients — RestaurantOS",
    description: "Track kitchen ingredients, stock levels, and costs.",
  },
};

export default function IngredientsPage() {
  return <ResourceView config={ingredientsResource} />;
}