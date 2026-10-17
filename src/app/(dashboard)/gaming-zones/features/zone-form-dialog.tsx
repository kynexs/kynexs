"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createGamingZoneAction,
  updateGamingZoneAction,
} from "@/actions/gaming-zones/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GamingZoneRow } from "@/types/gaming-zones";

export default function ZoneFormDialog({
  open,
  onOpenChange,
  zone,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone?: GamingZoneRow | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(zone);
  const [zoneName, setZoneName] = useState("");
  const [zoneNumber, setZoneNumber] = useState("");
  const [zoneLocation, setZoneLocation] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    if (zone) {
      setZoneName(zone.zoneName);
      setZoneNumber(zone.zoneNumber);
      setZoneLocation(zone.zoneLocation);
    } else {
      setZoneName("");
      setZoneNumber("");
      setZoneLocation("");
    }
  }, [open, zone]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const payload = {
        zoneName: zoneName.trim(),
        zoneNumber: zoneNumber.trim(),
        zoneLocation: zoneLocation.trim(),
      };

      if (isEdit && zone) {
        const result = await updateGamingZoneAction({
          id: zone.id,
          ...payload,
        });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success("Gaming zone updated");
      } else {
        const result = await createGamingZoneAction(payload);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(
          `Gaming zone created · referral code ${result.referralCode}`,
        );
      }

      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-extrabold uppercase">
            {isEdit ? "Edit gaming zone" : "Add gaming zone"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update zone details. Referral codes are generated once and cannot be changed."
              : "A unique referral code is generated when you save."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="zoneName">Zone name</Label>
            <Input
              id="zoneName"
              value={zoneName}
              onChange={(event) => setZoneName(event.target.value)}
              required
              maxLength={80}
              className="h-11 bg-surface-200"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zoneNumber">Zone number</Label>
            <Input
              id="zoneNumber"
              value={zoneNumber}
              onChange={(event) => setZoneNumber(event.target.value)}
              required
              maxLength={40}
              className="h-11 bg-surface-200"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zoneLocation">Zone location</Label>
            <Input
              id="zoneLocation"
              value={zoneLocation}
              onChange={(event) => setZoneLocation(event.target.value)}
              required
              maxLength={120}
              className="h-11 bg-surface-200"
              autoComplete="off"
            />
          </div>

          {isEdit && zone ? (
            <div className="space-y-1 rounded-lg border border-border bg-muted/40 px-3 py-2">
              <p className="text-xs font-medium text-muted-foreground">
                Referral code
              </p>
              <p className="font-mono text-sm">{zone.referralCode}</p>
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save changes" : "Create zone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
