import { siteConfig, supportContact } from "@/lib/config";

const COLORS = {
  bg: "#0B0B0E",
  surface: "#141419",
  lime: "#C0FE00",
  white: "#FFFFFF",
  muted: "#A1A1AA",
  border: "rgba(255,255,255,0.10)",
} as const;

export const OWNER_EMAIL = supportContact.email;

export type RegistrationEmailPlayer = {
  slot: number;
  isIgl: boolean;
  fullName: string;
  age: number;
  whatsapp: string;
  area: string;
};

export type RegistrationEmailPayload = {
  teamName: string;
  players: RegistrationEmailPlayer[];
};

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function shell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};color:${COLORS.white};font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${COLORS.surface};border:1px solid ${COLORS.border};">
          <tr>
            <td style="padding:28px 28px 12px;border-bottom:1px solid ${COLORS.border};background:linear-gradient(135deg, rgba(192,254,0,0.12), rgba(120,47,255,0.18));">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:${COLORS.lime};font-weight:700;">
                ${esc(siteConfig.name)}
              </p>
              <h1 style="margin:0;font-size:28px;line-height:1.1;text-transform:uppercase;letter-spacing:0.02em;">
                ${esc(title)}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 28px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 24px;border-top:1px solid ${COLORS.border};">
              <p style="margin:0;font-size:12px;color:${COLORS.muted};">
                ${esc(siteConfig.tagline)} · ${esc(siteConfig.name)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function playerCard(
  player: RegistrationEmailPlayer | undefined,
  mode: "namePhone" | "full",
): string {
  if (!player) {
    return `<td width="50%" valign="top" style="width:50%;padding:4px;"></td>`;
  }

  const badge = player.isIgl
    ? `<span style="display:inline-block;margin-left:6px;padding:2px 6px;border:1px solid rgba(192,254,0,0.4);color:${COLORS.lime};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;">IGL</span>`
    : "";
  const details =
    mode === "full"
      ? `
        <p style="margin:6px 0 0;font-size:12px;line-height:1.45;color:${COLORS.muted};word-break:break-word;">
          Age ${player.age}<br />
          ${esc(player.whatsapp)}<br />
          ${esc(player.area)}
        </p>`
      : `
        <p style="margin:6px 0 0;font-size:12px;line-height:1.45;color:${COLORS.muted};word-break:break-word;">
          ${esc(player.whatsapp)}
        </p>`;

  return `
    <td width="50%" valign="top" style="width:50%;padding:4px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${COLORS.border};background:rgba(255,255,255,0.03);">
        <tr>
          <td style="padding:12px;">
            <p style="margin:0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${COLORS.lime};font-weight:700;">
              Player ${player.slot}${badge}
            </p>
            <p style="margin:8px 0 0;font-size:15px;font-weight:700;color:${COLORS.white};word-break:break-word;">
              ${esc(player.fullName)}
            </p>
            ${details}
          </td>
        </tr>
      </table>
    </td>`;
}

/** Email-safe 2×2 roster: P1|P2 then P3|P4. */
function playerGrid(
  players: RegistrationEmailPlayer[],
  mode: "namePhone" | "full",
): string {
  const bySlot = [1, 2, 3, 4].map(
    (slot) => players.find((player) => player.slot === slot) ?? players[slot - 1],
  );

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
      <tr>
        ${playerCard(bySlot[0], mode)}
        ${playerCard(bySlot[1], mode)}
      </tr>
      <tr>
        ${playerCard(bySlot[2], mode)}
        ${playerCard(bySlot[3], mode)}
      </tr>
    </table>`;
}

export function registrationConfirmationEmail(
  payload: RegistrationEmailPayload,
): { subject: string; html: string } {
  const subject = `Squad locked · ${payload.teamName}`;
  const html = shell(
    "Registration complete",
    `
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${COLORS.muted};">
        Your squad <strong style="color:${COLORS.white};">${esc(payload.teamName)}</strong> is registered with ${esc(siteConfig.name)}.
      </p>
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.lime};font-weight:700;">
        Squad roster
      </p>
      ${playerGrid(payload.players, "namePhone")}
      <p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:${COLORS.muted};">
        Our team will review your details and contact you within <strong style="color:${COLORS.white};">8–12 hours</strong>.
      </p>
      <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:${COLORS.muted};">
        Questions? Email
        <a href="mailto:${supportContact.email}" style="color:${COLORS.lime};text-decoration:none;">${supportContact.email}</a>
        or WhatsApp
        <a href="https://wa.me/${supportContact.whatsapp.replace("+", "")}" style="color:${COLORS.lime};text-decoration:none;">${supportContact.whatsapp}</a>.
      </p>
    `,
  );
  return { subject, html };
}

export function registrationOwnerEmail(
  payload: RegistrationEmailPayload,
): { subject: string; html: string } {
  const subject = `New registration · ${payload.teamName}`;
  const html = shell(
    "New squad registered",
    `
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${COLORS.muted};">
        A new squad just completed Registration on ${esc(siteConfig.name)}.
      </p>
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.muted};font-weight:700;">
        Team
      </p>
      <p style="margin:0 0 20px;font-size:20px;font-weight:800;color:${COLORS.white};">
        ${esc(payload.teamName)}
      </p>
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.lime};font-weight:700;">
        Players
      </p>
      ${playerGrid(payload.players, "full")}
    `,
  );
  return { subject, html };
}
