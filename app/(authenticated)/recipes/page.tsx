// app/(authenticated)/recipes/page.tsx
import type { Metadata } from "next";
import { ResourceView } from "../../components/resource/resource-view";
import { recipesResource } from "@/app/lib/resources";

export const metadata: Metadata = {
  title: "Recipes — RestaurantOS",
  description: "Standardised recipes for every dish.",
  openGraph: {
    title: "Recipes — RestaurantOS",
    description: "Standardised recipes for every dish.",
  },
};

export default function RecipesPage() {
  return <ResourceView config={recipesResource} />;
}