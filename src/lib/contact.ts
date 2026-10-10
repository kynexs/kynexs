// Contact form rules, shared by the form and /api/contact.
import {
  normalizePhone,
  obj,
  str,
  validateEmail,
  validatePhone,
  validateText,
} from "./fields";

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
};
export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_FIELDS: readonly ContactField[] = [
  "name",
  "email",
  "phone",
  "message",
];

export function validateContactField(
  field: ContactField,
  raw: unknown,
): string | null {
  switch (field) {
    case "name":
      return validateText(raw, "Name", 2, 60);
    case "email":
      return validateEmail(raw);
    case "phone":
      return str(raw) ? validatePhone(raw, "Phone number") : null; // optional
    case "message":
      return validateText(raw, "Message", 10, 1000);
    default: {
      const unreachable: never = field;
      return unreachable;
    }
  }
}

export function validateContact(
  raw: unknown,
): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const input = obj(raw);
  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const message = validateContactField(field, input[field]);
    if (message) errors[field] = message;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: {
      name: str(input.name),
      email: str(input.email).toLowerCase(),
      phone: normalizePhone(input.phone),
      message: str(input.message),
    },
  };
}
