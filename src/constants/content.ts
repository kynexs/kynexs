import type { IconName } from "@/components/common/icon";

export interface Feature {
  icon: IconName;
  kicker: string;
  title: string;
  text: string;
}

export interface Step {
  icon: IconName;
  title: string;
  text: string;
}

export interface Fighter {
  id: "operator" | "trooper" | "scout";
  name: string;
  role: string;
  line: string;
  src: string;
  width: number;
  height: number;
  glow: "lime" | "purple";
}

export const marqueeItems = [
  "Registrations opening soon",
  "Battle royale",
  "Build your squad",
  "Karachi is waiting",
  "The next generation",
  "Prove yourself",
] as const;

export const features: Feature[] = [
  {
    icon: "trophy",
    kicker: "Tournaments",
    title: "Find your fight",
    text: "Browse competitions by game, format and prize pool. Pick your arena and register in minutes, not days.",
  },
  {
    icon: "users",
    kicker: "Squads",
    title: "Build your squad",
    text: "Create a team, invite your players and lock your roster before the drop.",
  },
  {
    icon: "radio",
    kicker: "Live",
    title: "Follow every match",
    text: "Schedules, live scores and brackets in one place. Always know who plays next.",
  },
  {
    icon: "chart",
    kicker: "Ranks",
    title: "Climb the ranks",
    text: "Every win counts. Track your team on the leaderboard.",
  },
  {
    icon: "gem",
    kicker: "Prizes",
    title: "Play for the pool",
    text: "Prize pool details drop with registration. Pre-registered members hear first.",
  },
];

export const steps: Step[] = [
  {
    icon: "userPlus",
    title: "Create account",
    text: "Sign up and set your gamer profile.",
  },
  {
    icon: "crosshair",
    title: "Choose competition",
    text: "Pick the tournament that fits your squad.",
  },
  {
    icon: "users",
    title: "Register your team",
    text: "Build your roster and lock it in.",
  },
  {
    icon: "zap",
    title: "Compete",
    text: "Drop in, play your matches, follow the bracket.",
  },
  {
    icon: "chart",
    title: "Climb the board",
    text: "Win, rank up and make your name.",
  },
];

// Pixel sizes are those of the processed cut-outs (see scripts/process-assets.py)
export const fighters: Fighter[] = [
  {
    id: "operator",
    name: "Operator",
    role: "Entry fragger",
    line: "Drops first. Asks later.",
    src: "/images/char-operator.webp",
    width: 756,
    height: 1044,
    glow: "lime",
  },
  {
    id: "trooper",
    name: "Trooper",
    role: "Anchor",
    line: "Holds the line. Holds the zone.",
    src: "/images/char-trooper.webp",
    width: 507,
    height: 646,
    glow: "purple",
  },
  {
    id: "scout",
    name: "Scout",
    role: "Support",
    line: "Sees it before it happens.",
    src: "/images/char-girl.webp",
    width: 543,
    height: 559,
    glow: "lime",
  },
];

export function fighterById(id: Fighter["id"]): Fighter {
  const fighter = fighters.find((f) => f.id === id);
  if (!fighter) throw new Error(`Unknown fighter: ${id}`);
  return fighter;
}
