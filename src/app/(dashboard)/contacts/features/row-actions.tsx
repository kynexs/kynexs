"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteContactAction,
  markContactRepliedAction,
} from "@/actions/contacts/actions";
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
import type { ContactRow } from "@/types/contact";
import ContactDetailSheet from "./contact-detail-sheet";

export default function ContactRowActions({
  contact,
  canDelete,
}: {
  contact: ContactRow;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [markPending, startMarkTransition] = useTransition();
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deletePending, startDeleteTransition] = useTransition();
  const isUnreplied = contact.status === "UNREPLIED";

  const onMarkReplied = () => {
    startMarkTransition(async () => {
      const result = await markContactRepliedAction(contact.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Marked as replied");
      router.refresh();
    });
  };

  const onConfirmDelete = () => {
    setDeleteBusy(true);
    startDeleteTransition(async () => {
      const result = await deleteContactAction(contact.id);
      setDeleteBusy(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Contact deleted");
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
        <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
          View contact
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!isUnreplied || markPending}
          onClick={() => {
            if (!isUnreplied) return;
            onMarkReplied();
          }}
        >
          {markPending ? "Marking…" : "Mark as replied"}
        </DropdownMenuItem>
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              Delete contact
            </DropdownMenuItem>
          </>
        )}
      </RowActionsMenu>

      <ContactDetailSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        contact={contact}
      />

      {canDelete && (
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent size="default" className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete contact?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes{" "}
                <span className="font-medium text-foreground">
                  {contact.name || contact.email}
                </span>
                . This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteBusy || deletePending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deleteBusy || deletePending}
                onClick={(event) => {
                  event.preventDefault();
                  onConfirmDelete();
                }}
              >
                {deleteBusy || deletePending ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
