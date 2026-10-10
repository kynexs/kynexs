"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import Onboarding from "./onboarding";

export default function RegisterButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="h-12 px-6 font-heading text-sm font-semibold tracking-wide uppercase sm:h-14 sm:px-8 sm:text-base"
      >
        Pre Registration
        <Icon
          name="arrowRight"
          className="size-5 transition-transform duration-normal group-hover/button:translate-x-1"
        />
      </Button>
      <Onboarding open={open} onClose={() => setOpen(false)} />
    </>
  );
}
