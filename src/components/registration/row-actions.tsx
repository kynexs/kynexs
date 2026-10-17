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
  canDelete,
}: {
  registration: RegistrationRow;
  canDelete: boolean;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [slipOpen, setSlipOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const hasSlip = Boolean(registration.receipt?.fileUrl);

  return (
    <>
      <div className="flex justify-end px-1 py-1">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-8 data-popup-open:bg-muted"
                aria-label="Open actions"
              />
            }
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="min-w-48 p-1.5">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
