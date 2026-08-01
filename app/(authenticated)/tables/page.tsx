// app/(authenticated)/tables/page.tsx
import type { Metadata } from "next";
import { ResourceView } from "../../components/resource/resource-view";
import { tablesResource } from "@/app/lib/resources";

export const metadata: Metadata = {
  title: "Tables — RestaurantOS",
  description: "Manage floor plan, seating and table status.",
  openGraph: {
    title: "Tables — RestaurantOS",
    description: "Manage floor plan, seating and table status.",
  },
};

export default function TablesPage() {
  return <ResourceView config={tablesResource} />;
}