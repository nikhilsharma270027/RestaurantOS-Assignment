import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { cn } from "@/app/lib/utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Initialize Fraunces Font
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "RestaurantOS — AI Restaurant Management Platform",
  description: "Run service, kitchen, inventory and finance in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full", 
        "antialiased", 
        geistSans.variable, 
        geistMono.variable, 
        jetbrainsMono.variable,
        fraunces.variable, // Added Fraunces variable hook here
        "font-sans" // Keeps your standard text cleanly defaulted to sans-serif
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
