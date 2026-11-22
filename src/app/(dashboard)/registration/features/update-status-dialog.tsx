"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateRegistrationStatus } from "@/actions/registration/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegistrationStatus } from "@/types/registration";

export default function UpdateStatusDialog({
  open,
  onOpenChange,
  registrationId,
  name,
  currentStatus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrationId: string;
  name: string;
  currentStatus: RegistrationStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<RegistrationStatus>(currentStatus);

  useEffect(() => {
    if (open) setStatus(currentStatus);
  }, [open, currentStatus]);

  const onSave = () => {
    startTransition(async () => {
      const result = await updateRegistrationStatus(registrationId, status);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Registration status updated");
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update registration status</DialogTitle>
          <DialogDescription>
            Set status for{" "}
            <span className="font-medium text-foreground">
              {name || registrationId}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label
            htmlFor="registration-status"
            className="font-heading text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase"
          >
            Registration status
          </label>
          <Select
            value={status}
            onValueChange={(value) => {
              if (
                value === "PENDING" ||
                value === "APPROVED" ||
                value === "REJECTED"
              ) {
                setStatus(value);
              }
            }}
          >
            <SelectTrigger
              id="registration-status"
              className="h-10 w-full bg-surface-200"
              aria-label="Registration status"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={pending || status === currentStatus}
            onClick={onSave}
          >
            {pending ? "Saving…" : "Save status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
