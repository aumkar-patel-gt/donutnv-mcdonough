import type { Metadata } from "next";
import { Poppins, Nunito, Fredoka } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

// Rounded, playful display font for the Instagram graphics.
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "DonutNV McDonough — Hot Donuts • Fresh Lemonade",
  description:
    "Find DonutNV McDonough's weekly schedule, locations, last-minute updates, and book us for your next event!",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "DonutNV",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#e11b22",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${nunito.variable} ${fredoka.variable} antialiased`}
      >
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
