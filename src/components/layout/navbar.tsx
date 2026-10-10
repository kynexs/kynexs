"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/common/icon";
import Logo from "@/components/common/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Container from "./container";
import MobileMenu from "./mobile-menu";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setIsScrolled(y > 24);
      if (progressRef.current) {
        progressRef.current.style.setProperty(
          "--p",
          String(max > 0 ? Math.min(y / max, 1) : 0),
        );
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const item of siteConfig.nav) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-normal ease-smooth",
          isScrolled
            ? "glass border-white/10"
            : "border-transparent bg-transparent",
        )}
      >
        <Container>
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-normal ease-smooth",
              isScrolled ? "h-16" : "h-[72px] md:h-20",
            )}
          >
            <a
              href="#top"
              aria-label={`${siteConfig.name} home`}
              className="shrink-0"
            >
              <Logo size="md" priority />
            </a>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-9 lg:flex"
            >
              {siteConfig.nav.map((item) => {
                const isActive = active === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group relative py-2 font-heading text-sm font-medium tracking-wider uppercase transition-colors duration-fast",
                      isActive
                        ? "text-lime"
                        : "text-text-secondary hover:text-white",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-lime shadow-[0_0_10px_#C0FE00] transition-transform duration-normal ease-smooth",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="#join"
                className={cn(
                  buttonVariants({
                    className:
                      "hidden h-auto min-h-10 gap-2 rounded-md px-4 font-heading text-xs font-semibold tracking-wide uppercase sm:inline-flex",
                  }),
                )}
              >
                Notify me
                <Icon name="arrowRight" className="size-4" />
              </a>
              <Button
                variant="ghost"
                className="size-11 text-white hover:bg-transparent hover:text-lime lg:hidden"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <Icon name="menu" className="size-7" />
              </Button>
            </div>
          </div>
        </Container>
        <div
          ref={progressRef}
          aria-hidden="true"
          className="h-px origin-left bg-lime shadow-glow-lime [scale:var(--p,0)_1]"
        />
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        active={active}
      />
    </>
  );
}
