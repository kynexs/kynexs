import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import { APP_TIMEZONE } from "@/lib/timezone";

/** Format an ISO/UTC date for display in Asia/Karachi. */
export function formatAppDate(iso: string) {
  try {
    return format(new TZDate(new Date(iso), APP_TIMEZONE), "dd MMM yyyy");
  } catch {
    return iso.slice(0, 10);
  }
}
