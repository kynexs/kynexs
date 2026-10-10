"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { sendContact } from "@/action/contact/actions";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_FIELDS,
  type ContactField,
  type ContactInput,
  validateContact,
  validateContactField,
} from "@/lib/contact";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY: ContactInput = { name: "", email: "", phone: "", message: "" };

const fieldClass =
  "h-12 rounded-lg border-white/10 bg-surface-200 px-4 text-base text-white placeholder:text-text-muted md:text-base";

export default function ContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [touched, setTouched] = useState<
    Partial<Record<ContactField, boolean>>
  >({});
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const error = (field: ContactField) =>
    touched[field]
      ? (validateContactField(field, values[field]) ?? undefined)
      : undefined;

  const bind = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    "aria-invalid": error(field) ? true : undefined,
    onChange: (e: { target: { value: string } }) =>
      setValues((current) => ({ ...current, [field]: e.target.value })),
    onBlur: () => setTouched((current) => ({ ...current, [field]: true })),
    disabled: status === "loading",
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(
      Object.fromEntries(CONTACT_FIELDS.map((field) => [field, true])),
    );
    if (!validateContact(values).ok) return;

    setStatus("loading");
    setServerError("");
    try {
      await sendContact({ ...values, website: trap });
      setValues(EMPTY);
      setTouched({});
      setStatus("success");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <output className="flex min-h-[320px] flex-col items-center justify-center px-2 text-center">
        <span className="flex size-16 items-center justify-center border-2 border-lime bg-lime/10 text-lime shadow-glow-lime">
          <Icon name="check" className="size-8" />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-5 font-display text-5xl leading-[0.9] font-extrabold uppercase outline-none"
        >
          Message <span className="text-lime">sent.</span>
        </h3>
        <p className="mt-3 max-w-xs text-text-muted">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 h-11 bg-transparent px-5 font-heading font-semibold tracking-wide uppercase dark:bg-transparent"
          onClick={() => setStatus("idle")}
        >
          Send another
        </Button>
      </output>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5"
      aria-busy={status === "loading"}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={error("name")}>
          <Input
            placeholder="Your name"
            autoComplete="name"
            maxLength={60}
            required
            className={fieldClass}
            {...bind("name")}
          />
        </Field>
        <Field label="Email" error={error("email")}>
          <Input
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            className={fieldClass}
            {...bind("email")}
          />
        </Field>
      </div>
      <Field label="Phone (optional)" error={error("phone")}>
        <Input
          type="tel"
          inputMode="tel"
          placeholder="+92 300 1234567"
          autoComplete="tel"
          maxLength={20}
          className={fieldClass}
          {...bind("phone")}
        />
      </Field>
      <Field label="Message" error={error("message")}>
        <Textarea
          placeholder="How can we help?"
          maxLength={1000}
          required
          className="min-h-32 rounded-lg border-white/10 bg-surface-200 px-4 py-3 text-base text-white placeholder:text-text-muted md:text-base"
          {...bind("message")}
        />
      </Field>

      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="flex items-start gap-3 border border-status-danger/40 bg-status-danger/10 p-4 text-sm text-red-200"
        >
          <Icon
            name="alert"
            className="mt-0.5 size-5 shrink-0 text-status-danger"
          />
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="h-14 w-full font-heading text-base font-semibold tracking-wide uppercase"
      >
        {status === "loading"
          ? "Sending"
          : status === "error"
            ? "Try again"
            : "Send message"}
        <Icon name="arrowRight" className="size-5" />
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 text-sm font-medium text-text-secondary">
        {label}
      </Label>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-sm text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
}
