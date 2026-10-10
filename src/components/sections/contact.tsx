import Reveal from "@/components/common/reveal";
import Container from "@/components/layout/container";
import ContactForm from "./contact-form";

export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-20 pb-20 sm:pb-28">
      <Container>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="mb-4 flex items-center gap-3 font-heading text-xs font-semibold tracking-[0.3em] text-lime uppercase">
                <span className="h-px w-8 bg-lime" aria-hidden="true" />
                Contact
              </p>
              <h2 className="font-display text-6xl leading-[0.85] font-extrabold tracking-tight uppercase sm:text-7xl">
                Got a{" "}
                <span className="text-lime drop-shadow-[0_0_24px_rgb(from_var(--color-lime)_r_g_b_/_0.4)]">
                  question?
                </span>
              </h2>
              <p className="mt-6 max-w-md text-lg text-text-muted">
                Squad rules, payments, sponsorships. Drop us a message and
                we&apos;ll get back to you.
              </p>
            </div>

            <div className="border border-white/10 bg-surface-100/80 p-5 backdrop-blur sm:p-8">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
