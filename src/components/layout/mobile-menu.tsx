"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/common/icon";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  active: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  active,
}: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 z-[60] overflow-hidden bg-background transition-[clip-path,visibility] duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden",
        isOpen
          ? "visible [clip-path:circle(150%_at_calc(100%-36px)_36px)]"
          : "invisible [clip-path:circle(0%_at_calc(100%-36px)_36px)]",
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 90% 5%, rgba(192,254,0,0.14), transparent 40%), radial-gradient(circle at 0% 100%, rgba(120,47,255,0.4), transparent 55%)",
        }}
      />
      <div className="relative flex h-full flex-col px-6 pt-4 pb-8">
        <div className="flex h-14 items-center justify-between">
          <Logo size="md" />
          <Button
            ref={closeRef}
            variant="ghost"
            onClick={onClose}
            aria-label="Close menu"
            className="size-11 text-white hover:bg-transparent hover:text-lime"
          >
            <Icon name="close" className="size-7" />
          </Button>
        </div>

        <nav aria-label="Mobile" className="mt-10 flex-1">
          <ul>
            {siteConfig.nav.map((item, i) => (
              <li
                key={item.id}
                className={cn(
                  "border-b border-white/10 transition-all duration-500 ease-out",
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                )}
                style={{
                  transitionDelay: isOpen ? `${250 + i * 70}ms` : "0ms",
                }}
              >
                <a
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-baseline justify-between gap-4 py-5 font-display text-5xl leading-none font-extrabold tracking-tight uppercase transition-colors",
                    active === item.id
                      ? "text-lime"
                      : "text-white hover:text-lime",
                  )}
                >
                  <span className="min-w-0">{item.label}</span>
                  <span className="shrink-0 font-heading text-xs font-medium tracking-widest text-white/30">
                    0{i + 1}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={cn(
            "transition-all duration-500 ease-out",
            isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          style={{ transitionDelay: isOpen ? "600ms" : "0ms" }}
        >
          <Button
            className="h-auto min-h-14 w-full gap-2 rounded-md px-8 font-heading text-base font-semibold tracking-wide uppercase"
            onClick={() => {
              onClose();
              window.location.hash = "join";
            }}
          >
            Pre Registration
            <Icon name="arrowRight" className="size-5" />
          </Button>
          <p className="mt-4 text-center font-heading text-[11px] tracking-[0.3em] text-white/40 uppercase">
            {siteConfig.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
