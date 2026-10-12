export const siteConfig = {
  name: "KYNEKS",
  tagline: "The Next Generation",
  description:
    "The next generation of competitive gaming is coming. Build your squad, drop in and prove yourself on the biggest stage. Registrations opening soon.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kynexs.com",
  // Registration opening date. Override with NEXT_PUBLIC_LAUNCH_DATE (ISO 8601) without touching code.
  launchDate:
    process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-11-15T18:00:00+05:00",
  nav: [
    { href: "#features", id: "features", label: "What's Coming" },
    { href: "#how", id: "how", label: "How It Works" },
    { href: "#squad", id: "squad", label: "Players" },
    { href: "#join", id: "join", label: "Pre Registration" },
    { href: "#contact", id: "contact", label: "Contact" },
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


// Everything an organiser may want to edit before launch lives here.

/** Shown on the Payment step. Replace the placeholders with the real account. */
export const bankDetails = {
  accountTitle: "TEKNOFEST PAKISTAN",
  bankName: "Meezan Bank",
  accountNumber: "0156 0110120268",
  iban: "PK43 MEZN 0001 5601 1012 0268",
} as const;

/** Every rule must be ticked before a squad can submit. 5-7 short rules works best. */
export const tournamentRules = [
  "I will play fair. No cheating, hacks, scripts or teaming with other squads.",
  "No emulators. Every player competes on a real mobile device.",
  "My squad will be on time for every match and check-in.",
  "All players will use the PUBG names registered in this form.",
  "I will keep my squad's WhatsApp number reachable for match updates.",
  "All the details I provided are true, and my payment slip is genuine.",
  "The organiser's decisions are final.",
] as const;

export const confirmationMessage =
  "We have received your details. Your pass will be sent to your WhatsApp number or email within 6-8 hours.";
