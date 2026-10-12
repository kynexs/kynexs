import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { RegistrationReceipt } from "./types";

export function isImageSlip(fileType: string) {
  return fileType.startsWith("image/");
}

export default function SlipThumbnail({
  receipt,
  size = 40,
}: {
  receipt: RegistrationReceipt | null;
  size?: number;
}) {
  if (!receipt) {
    return (
      <Badge
        variant="outline"
        className="font-heading text-[10px] tracking-wider uppercase"
      >
        No slip
      </Badge>
    );
  }

  if (!isImageSlip(receipt.fileType) || !receipt.fileUrl) {
    return (
      <Badge className="font-heading text-[10px] tracking-wider uppercase">
        {receipt.fileType === "application/pdf" ? "PDF" : "File"}
      </Badge>
    );
  }

  return (
    <Image
      src={receipt.fileUrl}
      alt={`Payment slip ${receipt.fileName}`}
      width={size}
      height={size}
      className="size-10 rounded-md border border-border object-cover"
      unoptimized
    />
  );
}
