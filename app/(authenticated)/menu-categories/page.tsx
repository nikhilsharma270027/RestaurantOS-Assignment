// app/(authenticated)/menu-categories/page.tsx
import type { Metadata } from "next";
import { ResourceView } from "../../components/resource/resource-view";
import { menuCategoriesResource } from "@/app/lib/resources";

export const metadata: Metadata = {
  title: "Menu Categories — RestaurantOS",
  description: "Organize menu items into categories.",
  openGraph: {
    title: "Menu Categories — RestaurantOS",
    description: "Organize menu items into categories.",
  },
};

export default function MenuCategoriesPage() {
  return <ResourceView config={menuCategoriesResource} />;
}