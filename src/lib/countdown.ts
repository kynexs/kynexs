export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

/** Whole-second breakdown of the time remaining until `target` (epoch ms). Never negative. */
export function getTimeLeft(target: number, now: number = Date.now()): TimeLeft {
  const total = Math.max(0, Math.floor((target - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: total === 0,
  };
}

/** Deterministic launch label (fixed locale + time zone, so server and client render the same text). */
export function formatLaunch(target: string): string {
  const date = new Date(target);
  if (Number.isNaN(date.getTime())) return "";
  const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Karachi" }).format(date);
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Karachi" }).format(date);
  return `${day} \u00B7 ${time} PKT`;
}
