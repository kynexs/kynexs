"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isImageSlip } from "./slip-thumbnail";
import type { RegistrationReceipt } from "./types";

export default function SlipDialog({
  open,
  onOpenChange,
  receipt,
  teamName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: RegistrationReceipt | null;
  teamName: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl" showCloseButton>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-extrabold uppercase">
            Payment slip
          </DialogTitle>
          <DialogDescription>
            {teamName ? `${teamName} · ` : ""}
            {receipt?.fileName ?? "No payment slip uploaded"}
          </DialogDescription>
        </DialogHeader>

        {!receipt || !receipt.fileUrl ? (
          <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            No payment slip uploaded for this registration.
          </p>
        ) : isImageSlip(receipt.fileType) ? (
          <a
            href={receipt.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-lg border border-border"
          >
            <Image
              src={receipt.fileUrl}
              alt={receipt.fileName}
              width={960}
              height={1280}
              className="h-auto max-h-[70vh] w-full object-contain"
              unoptimized
            />
          </a>
        ) : (
          <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">
              This slip is a {receipt.fileType || "file"}, so it opens in a new
              tab.
            </p>
            <a
              href={receipt.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex font-heading text-sm font-semibold tracking-wide text-lime uppercase hover:underline"
            >
              Open slip
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
