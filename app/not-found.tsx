import Link from "next/link";
import { ArrowLeft, House, UtensilsCrossed } from "lucide-react";
import { Button } from "./components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        <div className="surface-card relative w-full overflow-hidden px-6 py-10 text-center md:px-10 md:py-14">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-warm" />

          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <UtensilsCrossed className="size-8" />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            404 Page Not Found
          </p>

          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
            The page you are looking for does not exist.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            The link may be broken, the page may have been moved, or the address may have been
            entered incorrectly. Use the buttons below to return to the main application.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                <House className="mr-2 size-4" />
                Go to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth">
                <ArrowLeft className="mr-2 size-4" />
                Go to Sign In
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            If you expected a specific route, try navigating from the dashboard after logging in.
          </p>
        </div>
      </div>
    </main>
  );
}