import { TZDate } from "@date-fns/tz";

export const APP_TIMEZONE = "Asia/Karachi";

/** Inclusive calendar-day bounds in Asia/Karachi, as UTC Date instants. */
export function dayRangeToUtc(from?: Date, to?: Date) {
  const range: { gte?: Date; lte?: Date } = {};
  if (from) {
    range.gte = new TZDate(
      from.getFullYear(),
      from.getMonth(),
      from.getDate(),
      0,
      0,
      0,
      0,
      APP_TIMEZONE,
    );
  }
  if (to) {
    range.lte = new TZDate(
      to.getFullYear(),
      to.getMonth(),
      to.getDate(),
      23,
      59,
      59,
      999,
      APP_TIMEZONE,
    );
  }
  return range;
}

export function todayRangeUtc() {
  const now = new TZDate(new Date(), APP_TIMEZONE);
  return dayRangeToUtc(now, now);
}
