// Squad registration rules, shared by the onboarding flow and registerSquad.
import { parseReceiptKey } from "@/lib/receipt";
import type {
  FormErrors,
  GameChoice,
  IglDetails,
  PlayerDetails,
  RegistrationData,
  SlipType,
} from "@/types/registration";
import {
  normalizePhone,
  obj,
  str,
  validateAge,
  validateEmail,
  validatePhone,
  validateText,
} from "@/validations/fields";

export const PLAYER_COUNT = 4;

export const MAX_SLIP_BYTES = 5 * 1024 * 1024;
export const SLIP_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export const emptyPlayer = (): PlayerDetails => ({
  fullName: "",
  age: "",
  pubgName: "",
  whatsapp: "",
  area: "",
});
export const emptyIgl = (): IglDetails => ({
  fullName: "",
  whatsapp: "",
  email: "",
  age: "",
  area: "",
});

function collect(errors: FormErrors, key: string, message: string | null) {
  if (message) errors[key] = message;
}

function checkPerson(
  errors: FormErrors,
  prefix: string,
  p: Record<string, unknown>,
) {
  collect(
    errors,
    `${prefix}.fullName`,
    validateText(p.fullName, "Full name", 2, 60),
  );
  collect(errors, `${prefix}.whatsapp`, validatePhone(p.whatsapp));
  collect(errors, `${prefix}.age`, validateAge(p.age));
  collect(errors, `${prefix}.area`, validateText(p.area, "Area", 2, 80));
}

export function validateIgl(raw: unknown): FormErrors {
  const igl = obj(raw);
  const errors: FormErrors = {};
  checkPerson(errors, "igl", igl);
  collect(errors, "igl.email", validateEmail(igl.email));
  return errors;
}

export function validateTeam(raw: unknown): FormErrors {
  const team = obj(raw);
  const errors: FormErrors = {};
  collect(errors, "teamName", validateText(team.teamName, "Team name", 2, 40));
  const players = Array.isArray(team.players) ? team.players : [];
  for (let i = 0; i < PLAYER_COUNT; i++) {
    const p = obj(players[i]);
    checkPerson(errors, `players.${i}`, p);
    collect(
      errors,
      `players.${i}.pubgName`,
      validateText(p.pubgName, "PUBG name", 2, 32),
    );
  }
  return errors;
}

export function validateSlip(
  file: { type: string; size: number } | null | undefined,
): string | null {
  if (!file) return "Upload your payment slip.";
  if (!(SLIP_TYPES as readonly string[]).includes(file.type))
    return "Slip must be a JPG, PNG, WebP or PDF file.";
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_SLIP_BYTES)
    return `Slip must be under ${MAX_SLIP_BYTES / 1024 / 1024} MB.`;
  return null;
}

/** Checks the real file signature, since the browser-supplied MIME type can be faked. */
export function detectSlipType(bytes: Uint8Array): SlipType | null {
  const startsWith = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (startsWith(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (startsWith(0x89, 0x50, 0x4e, 0x47)) return "image/png";
  if (startsWith(0x25, 0x50, 0x44, 0x46)) return "application/pdf"; // %PDF
  if (
    startsWith(0x52, 0x49, 0x46, 0x46) &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return "image/webp"; // RIFF....WEBP
  return null;
}

export function validateGameAndReferral(raw: unknown): FormErrors {
  const input = obj(raw);
  const errors: FormErrors = {};
  const game = str(input.game);
  if (game !== "PUBG" && game !== "FREE_FIRE") {
    errors.game = "Select a game.";
  }
  const referral = str(input.referralCode);
  if (referral && referral.length > 32) {
    errors.referralCode = "Referral code is too long.";
  }
  return errors;
}

export function normalizeReferralCode(raw: unknown): string | null {
  const value = str(raw).toUpperCase().replace(/\s+/g, "");
  return value || null;
}

export function validateRegistration(
  raw: unknown,
): { ok: true; data: RegistrationData } | { ok: false; errors: FormErrors } {
  const input = obj(raw);
  const errors: FormErrors = {
    ...validateIgl(input.igl),
    ...validateTeam(input),
    ...validateGameAndReferral(input),
  };
  if (input.agreementsAccepted !== true)
    errors.agreementsAccepted = "You must accept all tournament rules.";
  const receipt = parseReceiptKey(input.receiptKey);
  if (!receipt) errors.receiptKey = "Upload your payment slip.";
  if (!receipt || Object.keys(errors).length > 0) return { ok: false, errors };

  const igl = obj(input.igl);
  const players = (input.players as unknown[])
    .slice(0, PLAYER_COUNT)
    .map((rawPlayer, i) => {
      const p = obj(rawPlayer);
      return {
        slot: i + 1,
        isIgl: i === 0,
        fullName: str(p.fullName),
        age: Number(str(p.age)),
        pubgName: str(p.pubgName),
        whatsapp: normalizePhone(p.whatsapp),
        area: str(p.area),
      };
    });

  const game = str(input.game) as GameChoice;

  return {
    ok: true,
    data: {
      registrationId: receipt.registrationId,
      receiptKey: String(input.receiptKey),
      receiptFileName: receipt.fileName,
      teamName: str(input.teamName),
      game,
      referralCode: normalizeReferralCode(input.referralCode),
      igl: {
        fullName: str(igl.fullName),
        whatsapp: normalizePhone(igl.whatsapp),
        email: str(igl.email).toLowerCase(),
        age: Number(str(igl.age)),
        area: str(igl.area),
      },
      players,
    },
  };
}
