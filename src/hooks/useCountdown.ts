"use client";

import { useEffect, useState } from "react";
import { getTimeLeft, type TimeLeft } from "@/lib/countdown";

/** Returns null until mounted so server and client markup match (no hydration mismatch). */
export function useCountdown(target: string): TimeLeft | null {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const end = new Date(target).getTime();
    if (Number.isNaN(end)) return;
    const tick = () => setTime(getTimeLeft(end));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return time;
}
