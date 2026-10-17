"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteGamingZoneAction } from "@/actions/gaming-zones/actions";
import RowActionsMenu from "@/components/data-table/row-actions-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { GamingZoneRow } from "@/types/gaming-zones";
import ZoneFormDialog from "./zone-form-dialog";

export default function GamingZoneRowActions({
  zone,
  canDelete,
}: {
  zone: GamingZoneRow;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pending, startTransition] = useTransition();

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(zone.referralCode);
      toast.success("Referral code copied");
    } catch {
      toast.error("Could not copy referral code");
    }
  };

  const onConfirmDelete = () => {
    setBusy(true);
    startTransition(async () => {
      const result = await deleteGamingZoneAction(zone.id);
      setBusy(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Gaming zone deleted");
      setDeleteOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <RowActionsMenu
        wrap={false}
        triggerClassName="data-popup-open:bg-muted"
        contentClassName="min-w-44"
      >
        <DropdownMenuItem onClick={() => void copyReferralCode()}>
          Copy referral code
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setEditOpen(true)}>
          Edit details
        </DropdownMenuItem>
        {canDelete ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              Delete zone
            </DropdownMenuItem>
          </>
        ) : null}
      </RowActionsMenu>

      <ZoneFormDialog open={editOpen} onOpenChange={setEditOpen} zone={zone} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="default" className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete gaming zone?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes{" "}
              <span className="font-medium text-foreground">
                {zone.zoneName}
              </span>{" "}
              and its referral code{" "}
              <span className="font-mono text-foreground">
                {zone.referralCode}
              </span>
              . Existing registrations keep their data but lose the zone link.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy || pending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={busy || pending}
              onClick={(event) => {
                event.preventDefault();
                onConfirmDelete();
              }}
            >
              {busy || pending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
