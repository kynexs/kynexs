export const siteConfig = {
  name: "Kynexs",
  tagline: "The Next Generation",
  description:
    "The next generation of competitive gaming is coming. Build your squad, drop in and prove yourself on the biggest stage. The countdown to match day is on.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kynexs.com",
  // Registration opening date. Override with NEXT_PUBLIC_LAUNCH_DATE (ISO 8601) without touching code.
  launchDate:
    process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-12-19T16:00:00+05:00",
  nav: [
    { href: "#features", id: "features", label: "What's Coming" },
    { href: "#how", id: "how", label: "How It Works" },
    { href: "#squad", id: "squad", label: "Players" },
    { href: "#join", id: "join", label: "" },
  ],
  // Add real URLs here; entries without an href render as "soon" chips.
  // Todo -- Add real WhatsApp number and Facebook page URL.
  socials: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/people/Kynexs/61595220321099/",
    },
    { label: "Instagram", href: "https://www.instagram.com/kynexs/" },
    { label: "WhatsApp", href: "https://wa.link/e2gzrw" },
    { label: "Discord", href: "#" },
    // { label: "X", href: "#" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];

// Everything an organiser may want to edit before launch lives here.

/** Shown on the Payment step. Replace the placeholders with the real account. */
export const bankDetails = {
  bankName: "UBL Bank",
  accountTitle: "SAMEY TAYYAB",
  accountNumber: "1779 2838 84478",
  iban: "PK81 UNIL 0109 0002 8388 4478",
} as const;

export const easypaisaDetails = {
  walletName: "Easy paisa",
  name: "SAMEY TAYYAB",
  number: "03322445429",
} as const;

export const registrationDetails = {
  squadFee: 2000,
  squadFeeText: "2000 is the whole team registration fee.",
  individualFee: 500,
  individualFeeText: "500 is the individual registration fee.",
  /** @deprecated use squadFee — kept for any leftover imports */
  registrationFee: 2000,
  registrationFeeText: "2000 is the whole team registration fee.",
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

/** individual placement rule. */
export const individualTournamentRules = [
  "I will play fair. No cheating, hacks, scripts or teaming with other players.",
  "No emulators. I will compete only on a real mobile device.",
  "I will be on time for every match and check-in.",
  "I will use the PUBG name registered in this form.",
  "I will keep my WhatsApp number reachable for match updates.",
  "All the details I provided are true, and my payment slip is genuine.",
  "The organiser's decisions are final.",
  "I accept that the organisers may assign me to any squad, and I will not dispute that assignment on match day.",
] as const;

export const confirmationMessage =
  "We have received your details. Your pass will be sent to your WhatsApp number or email within 10-12 hours.";

export const supportContact = {
  email: process.env.OWNER_EMAIL ?? "kynexscomp@gmail.com",
  whatsapp: process.env.SUPPORT_WHATSAPP ?? "+923253376352",
} as const;
