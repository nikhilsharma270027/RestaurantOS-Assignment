// app/(authenticated)/menu/page.tsx
import type { Metadata } from "next";
import { ResourceView } from "../../components/resource/resource-view";
import { menuResource } from "../../../app/lib/resources";

export const metadata: Metadata = {
  title: "Menu — RestaurantOS",
  description: "Dishes, pricing and food cost.",
  openGraph: {
    title: "Menu — RestaurantOS",
    description: "Dishes, pricing and food cost.",
  },
};

export default function MenuPage() {
  return <ResourceView config={menuResource} />;
}