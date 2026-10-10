import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter, Space_Grotesk } from "next/font/google";
import AmbientBackground from "@/components/background/ambient-background";
import Intro from "@/components/common/intro";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name} | Registrations opening soon`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/images/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0E",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${display.variable} dark`}
    >
      <body id="top" className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="fixed top-4 left-4 z-[200] -translate-y-24 bg-lime px-4 py-2 font-heading text-sm font-semibold text-background uppercase transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Intro />
        <AmbientBackground />
        <Navbar />
        <main id="main" className="relative z-10 flex-1 pt-[72px] md:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
