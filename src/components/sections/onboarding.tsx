"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useRef, useState } from "react";
import { registerSquad } from "@/action/registration/actions";
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
import { useReceiptUpload } from "@/hooks/useReceiptUpload";
import { tournamentRules } from "@/lib/config";
import {
  emptyIgl,
  emptyPlayer,
  type FormErrors,
  type IglDetails,
  PLAYER_COUNT,
  type PlayerDetails,
  type TeamDetails,
  validateIgl,
  validateTeam,
} from "@/lib/registration";
import { cn } from "@/lib/utils";
import {
  AgreementsStep,
  ConfirmationStep,
  IglStep,
  PaymentStep,
  TeamStep,
} from "./onboarding-steps";

const STEPS = [
  {
    title: "Squad leader",
    subtitle: "Your IGL is the main contact for the squad.",
  },
  {
    title: "Team & players",
    subtitle: "Add all four players. Player 1 is the IGL.",
  },
  { title: "Payment", subtitle: "Pay the entry fee, then upload your slip." },
  {
    title: "Tournament rules",
    subtitle: "Accept every rule to complete registration.",
  },
  { title: "All set", subtitle: "Your registration is in." },
] as const;

const LAST = STEPS.length - 1;

const newTeam = (): TeamDetails => ({
  teamName: "",
  players: Array.from({ length: PLAYER_COUNT }, emptyPlayer),
});
const noRulesAccepted = () => tournamentRules.map(() => false);

type Status = "idle" | "loading" | "error";

export default function Onboarding({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [igl, setIgl] = useState<IglDetails>(emptyIgl);
  const [team, setTeam] = useState<TeamDetails>(newTeam);
  const receipt = useReceiptUpload();
  const [accepted, setAccepted] = useState<boolean[]>(noRulesAccepted);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const p1Edited = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const busy = status === "loading";
  const allAccepted = accepted.every(Boolean);
  const slipError =
    receipt.status === "done"
      ? null
      : receipt.status === "uploading"
        ? "Wait for the upload to finish."
        : (receipt.error ?? "Upload your payment slip.");
  const errorsByStep: Record<number, FormErrors> = {
    0: validateIgl(igl),
    1: validateTeam(team),
    2: slipError ? { slip: slipError } : {},
    3: allAccepted ? {} : { agreements: "Accept every rule to continue." },
    4: {},
  };
  const errors = errorsByStep[step] ?? {};
  const visible: FormErrors = showErrors ? errors : {};

  const reset = () => {
    setStep(0);
    setIgl(emptyIgl());
    setTeam(newTeam());
    receipt.choose(null);
    setAccepted(noRulesAccepted());
    setShowErrors(false);
    setStatus("idle");
    setServerError("");
    p1Edited.current = false;
  };

  const close = () => {
    if (busy) return;
    if (step === LAST) reset();
    onClose();
  };

  const go = (to: number) => {
    setStep(to);
    setShowErrors(false);
    bodyRef.current?.scrollTo({ top: 0 });
  };

  const submit = async () => {
    setStatus("loading");
    setServerError("");
    try {
      await registerSquad({
        igl,
        ...team,
        agreementsAccepted: true,
        receiptKey: receipt.key,
      });
      setStatus("idle");
      go(LAST);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setStatus("error");
    }
  };

  const next = () => {
    if (Object.keys(errors).length > 0) return setShowErrors(true);
    if (step === 0 && !p1Edited.current) {
      const { fullName, age, whatsapp, area } = igl;
      setTeam((current) => ({
        ...current,
        players: current.players.map((player, i) =>
          i === 0 ? { ...player, fullName, age, whatsapp, area } : player,
        ),
      }));
    }
    if (step === LAST - 1) return void submit();
    go(step + 1);
  };

  const setPlayer = (
    index: number,
    field: keyof PlayerDetails,
    value: string,
  ) => {
    if (index === 0) p1Edited.current = true;
    setTeam((current) => ({
      ...current,
      players: current.players.map((player, i) =>
        i === index ? { ...player, [field]: value } : player,
      ),
    }));
  };

  const current = STEPS[step];

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) close();
      }}
    >
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
                <p className="mb-2 flex items-center gap-3 font-heading text-[11px] font-semibold tracking-[0.3em] text-lime uppercase">
                  <span className="h-px w-6 bg-lime" aria-hidden="true" />
                  Pre Registration
                </p>
                <DialogTitle className="font-display text-3xl leading-none font-extrabold uppercase sm:text-4xl">
                  {current?.title}
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-text-muted">
                  {current?.subtitle}
                </DialogDescription>
              </div>
              <DialogClose
                disabled={busy}
                render={
                  <Button
                    variant="ghost"
                    className="-mt-1 -mr-2 size-10 text-text-muted hover:bg-transparent hover:text-lime"
                    aria-label="Close"
                    disabled={busy}
                  />
                }
              >
                <Icon name="close" className="size-6" />
              </DialogClose>
            </header>

            <div
              ref={bodyRef}
              className="relative min-h-0 flex-1 overflow-y-auto px-5 py-2 sm:px-8"
            >
              <div key={step} className="animate-rise pb-4">
                {step === 0 && (
                  <IglStep
                    value={igl}
                    errors={visible}
                    onChange={(field, value) =>
                      setIgl((currentIgl) => ({
                        ...currentIgl,
                        [field]: value,
                      }))
                    }
                  />
                )}
                {step === 1 && (
                  <TeamStep
                    value={team}
                    errors={visible}
                    onTeamName={(teamName) =>
                      setTeam((currentTeam) => ({ ...currentTeam, teamName }))
                    }
                    onPlayer={setPlayer}
                  />
                )}
                {step === 2 && (
                  <PaymentStep receipt={receipt} error={visible.slip} />
                )}
                {step === 3 && (
                  <AgreementsStep
                    accepted={accepted}
                    error={visible.agreements}
                    onToggle={(i) =>
                      setAccepted((currentAccepted) =>
                        currentAccepted.map((value, j) =>
                          j === i ? !value : value,
                        ),
                      )
                    }
                  />
                )}
                {step === LAST && <ConfirmationStep teamName={team.teamName} />}
              </div>
            </div>

            <footer className="relative border-t border-white/10 px-5 pt-4 pb-5 sm:px-8">
              {status === "error" && (
                <p
                  role="alert"
                  className="mb-4 flex items-start gap-3 border border-status-danger/40 bg-status-danger/10 p-3 text-sm text-red-200"
                >
                  <Icon
                    name="alert"
                    className="mt-0.5 size-5 shrink-0 text-status-danger"
                  />
                  {serverError}
                </p>
              )}

              <div className="flex justify-center gap-2" aria-hidden="true">
                {STEPS.map((item, i) => (
                  <span
                    key={item.title}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-normal",
                      i === step
                        ? "w-5 bg-lime"
                        : i < step
                          ? "w-1.5 bg-lime/50"
                          : "w-1.5 bg-white/20",
                    )}
                  />
                ))}
              </div>
              <p className="sr-only" aria-live="polite">
                Step {step + 1} of {STEPS.length}
              </p>

              <div className="mt-4 flex gap-3">
                {step > 0 && step < LAST && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-14 px-4 font-heading font-semibold tracking-wide uppercase"
                    onClick={() => go(step - 1)}
                    disabled={busy}
                  >
                    <Icon name="arrowLeft" className="size-5" />
                    Back
                  </Button>
                )}
                {step < LAST ? (
                  <Button
                    type="button"
                    className="h-14 flex-1 font-heading font-semibold tracking-wide uppercase"
                    onClick={next}
                    disabled={
                      busy ||
                      (step === LAST - 1 && !allAccepted) ||
                      (step === 2 && receipt.status === "uploading")
                    }
                  >
                    {busy
                      ? "Submitting"
                      : step < LAST - 1
                        ? "Continue"
                        : status === "error"
                          ? "Try again"
                          : "Submit"}
                    <Icon name="arrowRight" className="size-5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="h-14 flex-1 font-heading font-semibold tracking-wide uppercase"
                    onClick={close}
                  >
                    Finish
                    <Icon name="check" className="size-5" />
                  </Button>
                )}
              </div>
            </footer>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
