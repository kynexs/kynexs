"use client";

import { MoreHorizontalIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function RowActionsMenu({
  children,
  wrap = true,
  triggerClassName = "size-8 data-popup-open:bg-muted",
  contentClassName = "min-w-48 p-1.5",
  sideOffset,
}: {
  children: ReactNode;
  wrap?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  sideOffset?: number;
}) {
  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(triggerClassName)}
            aria-label="Open actions"
          />
        }
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        {...(sideOffset !== undefined ? { sideOffset } : {})}
        className={contentClassName}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (!wrap) return menu;
  return <div className="flex justify-end px-1 py-1">{menu}</div>;
}
