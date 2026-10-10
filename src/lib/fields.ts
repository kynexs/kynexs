// Small field validators shared by the onboarding flow, the contact form and their API routes.
// Each returns an error message, or null when the value is fine.
// No path-alias imports in src/lib/*: scripts/check-logic.ts runs these files directly in Node.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // same rule as validation.ts

export const MIN_AGE = 13;
export const MAX_AGE = 60;

export const str = (raw: unknown): string => (typeof raw === "string" ? raw.trim() : "");

/** Narrows unknown input to a plain object (anything else becomes {}). */
export const obj = (raw: unknown): Record<string, unknown> =>
  typeof raw === "object" && raw !== null && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};

export function validateText(raw: unknown, label: string, min: number, max: number): string | null {
  const value = str(raw);
  if (!value) return `${label} is required.`;
  if (value.length < min) return `${label} must be at least ${min} characters.`;
  if (value.length > max) return `${label} can be ${max} characters at most.`;
  return null;
}

export function validateEmail(raw: unknown): string | null {
  const value = str(raw);
  if (!value) return "Email is required.";
  return value.length > 254 || !EMAIL_RE.test(value) ? "That email doesn't look right." : null;
}

/** Spaces and dashes are tolerated; the stored value is normalised by `normalizePhone`. */
export const normalizePhone = (raw: unknown): string => str(raw).replace(/[\s-]/g, "");

export function validatePhone(raw: unknown, label = "WhatsApp number"): string | null {
  if (!str(raw)) return `${label} is required.`;
  return /^\+?\d{10,15}$/.test(normalizePhone(raw)) ? null : `Enter a valid ${label.toLowerCase()} (10-15 digits, e.g. +92 300 1234567).`;
}

export function validateAge(raw: unknown): string | null {
  const value = str(raw) || (typeof raw === "number" ? String(raw) : "");
  if (!value) return "Age is required.";
  const age = Number(value);
  if (!/^\d{1,3}$/.test(value) || age < MIN_AGE || age > MAX_AGE) return `Age must be between ${MIN_AGE} and ${MAX_AGE}.`;
  return null;
}
