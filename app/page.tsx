import Link from "next/link";
import { UtensilsCrossed, Sparkles, Boxes, ReceiptText, ShieldCheck, FileScan } from "lucide-react";
import { Button } from "./components/ui/button"; // Adjusted alias for standard Next.js apps

// Next.js handles metadata via an exported object
export const metadata = {
  title: "RestaurantOS — AI Restaurant Management Platform",
  description: "Run service, kitchen, inventory and finance in one place, with AI invoice reading and demand forecasts.",
  openGraph: {
    title: "RestaurantOS — AI Restaurant Management Platform",
    description: "Orders, stock, purchasing and expenses with AI invoice extraction and forecasting.",
  },
};

const FEATURES = [
  { icon: ReceiptText, title: "Service", body: "Orders, tables, menu and recipes for the whole floor." },
  { icon: Boxes, title: "Inventory", body: "Products, warehouses, stock movements and purchase orders." },
  { icon: FileScan, title: "AI invoices", body: "Read printed and handwritten supplier invoices automatically." },
  { icon: Sparkles, title: "AI insights", body: "Demand forecasts, shortage alerts and cost-saving moves." },
  { icon: ShieldCheck, title: "Role-based access", body: "Owner, manager, chef, waiter, cashier, store manager." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-lg gradient-warm">
            <UtensilsCrossed className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold">RestaurantOS</span>
        </div>
        <Button asChild>
          <Link href="/auth">Sign in</Link>
        </Button>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          AI powered restaurant management
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">
          The whole restaurant, on one screen.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Orders and tables, recipes and ingredients, stock and purchasing, expenses and supplier
          invoices — with AI that reads your paperwork and warns you before you run out.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/auth">Get started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth">Sign in to console</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="surface-card p-6">
            <f.icon className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-lg font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
