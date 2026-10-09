export const siteConfig = {
    name: "KYNEKS",
    tagline: "The Next Generation",
    description:
      "The next generation of competitive gaming is coming. Build your squad, drop in and prove yourself on the biggest stage. Registrations opening soon.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kynexs.com",
    // Registration opening date. Override with NEXT_PUBLIC_LAUNCH_DATE (ISO 8601) without touching code.
    launchDate: process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-11-15T18:00:00+05:00",
    nav: [
      { href: "#features", id: "features", label: "What's Coming" },
      { href: "#how", id: "how", label: "How It Works" },
      { href: "#squad", id: "squad", label: "Players" },
      { href: "#join", id: "join", label: "Early Access" },
    ],
    // Add real URLs here; entries without an href render as "soon" chips.
    socials: [
      { label: "Discord", href: "" },
      { label: "Instagram", href: "" },
      { label: "TikTok", href: "" },
      { label: "YouTube", href: "" },
      { label: "X", href: "" },
    ],
  } as const;
  
  export type NavItem = (typeof siteConfig.nav)[number];
  