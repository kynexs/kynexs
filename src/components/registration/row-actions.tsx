"use client";

import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteRegistrationDialog from "./delete-registration-dialog";
import RegistrationDetailSheet from "./registration-detail-sheet";
import SlipDialog from "./slip-dialog";
import type { RegistrationRow } from "./types";

export default function RegistrationRowActions({
  registration,
}: {
  registration: RegistrationRow;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [slipOpen, setSlipOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const hasSlip = Boolean(registration.receipt?.fileUrl);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="data-popup-open:bg-muted"
              aria-label="Open actions"
            />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!hasSlip}
            onClick={() => {
              if (!hasSlip) {
                toast.message("No payment slip uploaded");
                return;
              }
              setSlipOpen(true);
            }}
          >
            View slip
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Delete registration
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RegistrationDetailSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        registration={registration}
      />
      <SlipDialog
        open={slipOpen}
        onOpenChange={setSlipOpen}
        receipt={registration.receipt}
        teamName={registration.teamName}
      />
      <DeleteRegistrationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        registrationId={registration.id}
        name={registration.contactName}
      />
    </>
  );
}
