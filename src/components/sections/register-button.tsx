"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useState } from "react";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatLaunch } from "@/lib/countdown";
import { registrationDetails, siteConfig } from "@/lib/config";
import type { RegistrationType } from "@/types/registration";
import Onboarding from "./onboarding";

export default function RegisterButton() {
  const [introOpen, setIntroOpen] = useState(false);
  const [mode, setMode] = useState<RegistrationType | null>(null);

  const start = (next: RegistrationType) => {
    setIntroOpen(false);
    setMode(next);
  };

  return (
    <>
      <Button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIntroOpen(true)}
        className="h-12 px-6 font-heading text-sm font-semibold tracking-wide uppercase sm:h-14 sm:px-8 sm:text-base"
      >
        Registration
        <Icon
          name="arrowRight"
          className="size-5 transition-transform duration-normal group-hover/button:translate-x-1"
        />
      </Button>

      <Dialog open={introOpen} onOpenChange={setIntroOpen}>
        <DialogPortal>
          <DialogOverlay className="z-[110] bg-background/80 backdrop-blur-sm" />
          <DialogPrimitive.Popup className="chamfer fixed top-1/2 left-1/2 z-[110] flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden bg-gradient-to-br from-lime/70 via-purple/60 to-purple/40 p-px outline-none sm:max-w-xl">
            <div className="chamfer relative flex max-h-[calc(100dvh-1.5rem)] min-h-0 flex-col overflow-hidden bg-surface-100">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 100% 0%, rgb(from var(--color-lime) r g b / 0.1), transparent 45%), radial-gradient(circle at 0% 100%, rgb(from var(--color-purple) r g b / 0.3), transparent 55%)",
                }}
              />

              <header className="relative flex items-start justify-between gap-4 px-5 pt-6 pb-4 sm:px-8">
                <div>
                  <p className="mb-2 font-heading text-[11px] font-semibold tracking-[0.3em] text-lime uppercase">
                    {siteConfig.name}
                  </p>
                  <DialogTitle className="font-display text-3xl leading-none font-extrabold uppercase sm:text-4xl">
                    Join the drop
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-sm text-text-muted">
                    Pick how you want to register for match day.
                  </DialogDescription>
                </div>
                <DialogClose
                  render={
                    <Button
                      variant="ghost"
                      className="-mt-1 -mr-2 size-10 text-text-muted hover:bg-transparent hover:text-lime"
                      aria-label="Close"
                    />
                  }
                >
                  <Icon name="close" className="size-6" />
                </DialogClose>
              </header>

              <div className="relative min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-6 sm:px-8">
                <p className="text-sm leading-relaxed text-text-secondary">
                  {siteConfig.description}
                </p>

                <dl className="divide-y divide-white/10 border border-white/10 bg-surface-200/60">
                  <div className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <dt className="font-heading text-[11px] font-semibold tracking-[0.2em] text-text-muted uppercase">
                      Event
                    </dt>
                    <dd className="font-heading text-sm font-semibold text-white sm:text-right">
                      {formatLaunch(siteConfig.launchDate) || "Match day TBA"}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <dt className="font-heading text-[11px] font-semibold tracking-[0.2em] text-text-muted uppercase">
                      Squad fee
                    </dt>
                    <dd className="font-heading text-sm font-semibold text-lime sm:text-right">
                      Rs {registrationDetails.squadFee.toLocaleString("en-PK")}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <dt className="font-heading text-[11px] font-semibold tracking-[0.2em] text-text-muted uppercase">
                      Individual fee
                    </dt>
                    <dd className="font-heading text-sm font-semibold text-lime sm:text-right">
                      Rs{" "}
                      {registrationDetails.individualFee.toLocaleString(
                        "en-PK",
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    type="button"
                    className="h-14 w-full font-heading font-semibold tracking-wide uppercase"
                    onClick={() => start("INDIVIDUAL")}
                  >
                    Individual registration
                    <Icon name="arrowRight" className="size-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 w-full border-white/20 bg-transparent font-heading font-semibold tracking-wide text-white uppercase hover:border-lime hover:bg-lime/10 hover:text-lime"
                    onClick={() => start("SQUAD")}
                  >
                    Squad registration
                    <Icon name="arrowRight" className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>

      {mode && (
        <Onboarding
          key={mode}
          open={!!mode}
          mode={mode}
          onClose={() => setMode(null)}
        />
      )}
    </>
  );
}
