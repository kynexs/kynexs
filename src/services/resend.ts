import "server-only";

import { Resend } from "resend";

const isDev = process.env.NODE_ENV === "development";
const log = (...args: unknown[]) => {
  if (isDev) console.log("[resend]", ...args);
};

let client: Resend | null = null;

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  if (!client) {
    log("creating Resend client");
    client = new Resend(key);
  }
  return client;
}

export function resendFrom(): string {
  return process.env.RESEND_FROM_EMAIL ?? "Kynexs <onboarding@resend.dev>";
}

export async function sendEmails(
  emails: {
    to: string;
    subject: string;
    html: string;
  }[],
  idempotencyKey: string,
): Promise<void> {
  if (emails.length === 0) {
    log("skip: no emails to send");
    return;
  }

  const from = resendFrom();
  const payload = emails.map((email) => ({
    from,
    to: [email.to],
    subject: email.subject,
    html: email.html,
  }));

  log("sending", {
    count: payload.length,
    from,
    idempotencyKey,
    to: payload.map((email) => email.to[0]),
    subjects: payload.map((email) => email.subject),
  });

  if (payload.length === 1) {
    const first = payload[0];
    if (!first) return;
    const { data, error } = await getResend().emails.send(first, {
      idempotencyKey,
    });
    if (error) {
      log("single send failed", error);
      throw new Error(error.message);
    }
    log("single send ok", data);
    return;
  }

  const { data, error } = await getResend().batch.send(payload, {
    idempotencyKey: `batch-${idempotencyKey}`,
  });
  if (error) {
    log("batch send failed", error);
    throw new Error(error.message);
  }
  log("batch send ok", data);
}
