"use client";

import { useState } from "react";
import { toast } from "sonner";
import RowActionsMenu from "@/components/data-table/row-actions-menu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { RegistrationRow } from "@/types/registration";
import DeleteRegistrationDialog from "./delete-registration-dialog";
import RegistrationDetailSheet from "./registration-detail-sheet";
import SlipDialog from "./slip-dialog";
import UpdateStatusDialog from "./update-status-dialog";

export default function RegistrationRowActions({
  registration,
  canDelete,
}: {
  registration: RegistrationRow;
  canDelete: boolean;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [slipOpen, setSlipOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const hasSlip = Boolean(registration.receipt?.fileUrl);

  return (
    <>
      <RowActionsMenu sideOffset={8}>
        <DropdownMenuItem
          className="px-2.5 py-2"
          onClick={() => setDetailsOpen(true)}
        >
          View details
        </DropdownMenuItem>
        <DropdownMenuItem
          className="px-2.5 py-2"
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
        <DropdownMenuItem
          className="px-2.5 py-2"
          onClick={() => setStatusOpen(true)}
        >
          Update status
        </DropdownMenuItem>
        {canDelete && (
          <>
            <DropdownMenuSeparator className="my-1.5 bg-border" />
            <DropdownMenuItem
              variant="destructive"
              className="px-2.5 py-2"
              onClick={() => setDeleteOpen(true)}
            >
              Delete registration
            </DropdownMenuItem>
          </>
        )}
      </RowActionsMenu>

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
      <UpdateStatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        registrationId={registration.id}
        name={registration.contactName}
        currentStatus={registration.status}
      />
      {canDelete && (
        <DeleteRegistrationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          registrationId={registration.id}
          name={registration.contactName}
        />
      )}
    </>
  );
}
