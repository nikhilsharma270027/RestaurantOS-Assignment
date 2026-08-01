// app/(authenticated)/access/page.tsx
import type { Metadata } from "next";
import { AccessContent } from "./access-content";

export const metadata: Metadata = {
  title: "Roles & Access — RestaurantOS",
  description: "Assign owner, manager, chef, waiter, cashier and store manager roles.",
  openGraph: {
    title: "Roles & Access — RestaurantOS",
    description: "Assign roles and control who can change what.",
  },
};

export default function AccessPage() {
  return <AccessContent />;
}