"use client";

import { useEffect, useRef, useState } from "react";

/** True once the element has entered the viewport (one-shot unless `once` is false). */
export function useInView<T extends Element>(options?: { threshold?: number; rootMargin?: string; once?: boolean }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { threshold = 0.15, rootMargin = "0px 0px -8% 0px", once = true } = options ?? {};

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
