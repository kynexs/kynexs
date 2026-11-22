import { Badge } from "@/components/ui/badge";
import type { RegistrationStatus } from "@/types/registration";

const labels: Record<RegistrationStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export default function RegistrationStatusBadge({
  status,
}: {
  status: RegistrationStatus;
}) {
  if (status === "APPROVED") {
    return (
      <Badge className="rounded-none font-heading text-[10px] tracking-wider uppercase">
        {labels[status]}
      </Badge>
    );
  }
  if (status === "REJECTED") {
    return (
      <Badge
        variant="destructive"
        className="rounded-none font-heading text-[10px] tracking-wider uppercase"
      >
        {labels[status]}
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="rounded-none font-heading text-[10px] tracking-wider uppercase"
    >
      {labels[status]}
    </Badge>
  );
}
