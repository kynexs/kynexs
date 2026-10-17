import Icon from "@/components/common/icon";
import Logo from "@/components/common/logo";
import { siteConfig } from "@/lib/config";
import Container from "./container";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-surface-100/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/60 to-transparent" />
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" aria-label="Back to top" className="inline-block">
              <Logo size="lg" />
            </a>
            <p className="mt-5 font-display text-2xl font-bold tracking-wide text-text-secondary uppercase">
              Compete. Connect. Conquer.
            </p>
            <p className="mt-3 max-w-sm text-text-muted">
              {siteConfig.description}
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="mb-5 font-heading text-xs font-semibold tracking-[0.25em] text-white uppercase">
              Explore
            </h3>
            <ul className="space-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-text-muted transition-colors hover:text-lime"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-5 font-heading text-xs font-semibold tracking-[0.25em] text-white uppercase">
              Follow the drop
            </h3>
            <ul className="flex flex-wrap gap-2">
              {siteConfig.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-1.5 border border-white/10 px-3.5 text-sm text-text-secondary transition-colors hover:border-lime hover:text-lime"
                  >
                    {s.label}
                    <Icon name="arrowUpRight" className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-text-muted sm:flex-row">
          <p>&copy; 2026 {siteConfig.name}. All rights reserved.</p>
          <p className="font-heading tracking-[0.3em] uppercase">
            {siteConfig.tagline}
          </p>
        </div>
      </Container>
    </footer>
  );
}
