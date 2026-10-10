"use client";

import { type PointerEvent, useCallback, useRef } from "react";

/** Pointer position as CSS variables: --sx/--sy/--gx/--gy in %, --rx/--ry in degrees when tilt is on. */
export function usePointerVars<T extends HTMLElement>(options?: {
  tilt?: boolean;
  max?: number;
}) {
  const ref = useRef<T>(null);
  const tilt = options?.tilt ?? false;
  const max = options?.max ?? 8;

  const onPointerMove = useCallback(
    (event: PointerEvent<T>) => {
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      el.style.setProperty("--sx", `${px * 100}%`);
      el.style.setProperty("--sy", `${py * 100}%`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
      if (!tilt) return;
      el.style.setProperty("--rx", String((px - 0.5) * 2 * max));
      el.style.setProperty("--ry", String((py - 0.5) * 2 * max));
    },
    [tilt, max],
  );

  const onPointerLeave = useCallback((event: PointerEvent<T>) => {
    const el = event.currentTarget;
    el.style.setProperty("--rx", "0");
    el.style.setProperty("--ry", "0");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
