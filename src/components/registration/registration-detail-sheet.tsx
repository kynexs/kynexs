"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { isImageSlip } from "./slip-thumbnail";
import type { RegistrationRow } from "./types";

export default function RegistrationDetailSheet({
  open,
  onOpenChange,
  registration,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: RegistrationRow | null;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-display text-3xl font-extrabold uppercase">
            {registration?.contactName ?? "Registration"}
          </SheetTitle>
          <SheetDescription>
            Full squad details and payment slip
          </SheetDescription>
        </SheetHeader>

        {registration && (
          <div className="flex flex-col gap-6 p-4">
            <dl className="grid gap-3 text-sm">
              <Row label="Registration ID" value={registration.id} mono />
              <Row label="Name" value={registration.contactName} />
              <Row label="Phone" value={registration.contactWhatsapp} />
              <Row label="Team" value={registration.teamName} />
              <Row label="Email" value={registration.contactEmail} />
              <Row label="Area" value={registration.contactArea} />
            </dl>

            <section className="space-y-3">
              <h3 className="font-heading text-xs font-semibold tracking-[0.25em] text-lime uppercase">
                Players
              </h3>
              <ul className="space-y-3">
                {registration.players.map((player) => (
                  <li
                    key={player.id}
                    className="rounded-lg border border-border bg-surface-200/50 p-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="font-heading text-sm font-semibold uppercase">
                        Player {player.slot}
                      </p>
                      {player.isIgl && (
                        <Badge className="rounded-none font-heading text-[10px] tracking-widest">
                          IGL
                        </Badge>
                      )}
                    </div>
                    <dl className="grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                      <div>
                        <dt className="text-xs uppercase">Full name</dt>
                        <dd className="text-foreground">{player.fullName}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase">PUBG name</dt>
                        <dd className="text-foreground">{player.pubgName}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase">WhatsApp</dt>
                        <dd className="text-foreground">{player.whatsapp}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase">Age</dt>
                        <dd className="text-foreground">{player.age}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-xs uppercase">Area</dt>
                        <dd className="text-foreground">{player.area}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-heading text-xs font-semibold tracking-[0.25em] text-lime uppercase">
                Payment slip
              </h3>
              {!registration.receipt || !registration.receipt.fileUrl ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No payment slip uploaded
                </p>
              ) : isImageSlip(registration.receipt.fileType) ? (
                <a
                  href={registration.receipt.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-lg border border-border transition-opacity hover:opacity-90"
                >
                  <Image
                    src={registration.receipt.fileUrl}
                    alt={registration.receipt.fileName}
                    width={720}
                    height={960}
                    className="h-auto w-full object-contain"
                    unoptimized
                  />
                </a>
              ) : (
                <a
                  href={registration.receipt.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg border border-border bg-muted/40 px-4 py-3 font-heading text-sm font-semibold tracking-wide text-lime uppercase hover:underline"
                >
                  Open {registration.receipt.fileName}
                </a>
              )}
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:items-start">
      <dt className="font-heading text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className={mono ? "break-all font-mono text-xs" : "break-words"}>
        {value}
      </dd>
    </div>
  );
}
