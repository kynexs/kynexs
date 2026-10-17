"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/common/icon";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { ReceiptUpload } from "@/hooks/useReceiptUpload";
import {
  bankDetails,
  confirmationMessage,
  registrationDetails,
  tournamentRules,
} from "@/lib/config";
import {
  type FormErrors,
  type GameChoice,
  type IglDetails,
  MAX_SLIP_BYTES,
  PLAYER_COUNT,
  type PlayerDetails,
  SLIP_TYPES,
  type TeamDetails,
  validateSlip,
} from "@/lib/registration";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const fieldClass =
  "h-12 rounded-lg border-white/10 bg-surface-200 px-4 text-base text-white placeholder:text-text-muted md:text-base";

const FIELD_PROPS = {
  fullName: { label: "Full name", placeholder: "e.g. Ali Khan", maxLength: 60 },
  whatsapp: {
    label: "WhatsApp number",
    placeholder: "+92 300 1234567",
    type: "tel",
    inputMode: "tel",
    maxLength: 20,
  },
  email: {
    label: "Email",
    placeholder: "you@example.com",
    type: "email",
    inputMode: "email",
    maxLength: 254,
  },
  age: {
    label: "Age",
    placeholder: "e.g. 19",
    inputMode: "numeric",
    maxLength: 2,
  },
  area: {
    label: "Area",
    placeholder: "e.g. Gulshan-e-Iqbal, Karachi",
    maxLength: 80,
  },
  pubgName: { label: "PUBG name", placeholder: "In-game name", maxLength: 32 },
} as const;

type FieldKind = keyof typeof FIELD_PROPS;

function Field({
  kind,
  id,
  value,
  error,
  onChange,
  autoComplete,
  className,
}: {
  kind: FieldKind;
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  className?: string;
}) {
  const props = FIELD_PROPS[kind];
  return (
    <div className={className}>
      <Label
        htmlFor={id}
        className="mb-2 text-sm font-medium text-text-secondary"
      >
        {props.label}
      </Label>
      <Input
        id={id}
        name={id}
        value={value}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
        type={"type" in props ? props.type : "text"}
        inputMode={"inputMode" in props ? props.inputMode : undefined}
        autoComplete={autoComplete ?? "off"}
        aria-invalid={error ? true : undefined}
        required
        className={fieldClass}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const grid = "grid gap-4 sm:grid-cols-2";

export function IglStep({
  value,
  errors,
  onChange,
  game,
  onGameChange,
  referralCode,
  onReferralChange,
}: {
  value: IglDetails;
  errors: FormErrors;
  onChange: (field: keyof IglDetails, value: string) => void;
  game: GameChoice | "";
  onGameChange: (game: GameChoice) => void;
  referralCode: string;
  onReferralChange: (value: string) => void;
}) {
  const field = (
    kind: keyof IglDetails,
    autoComplete: string,
    className?: string,
  ) => (
    <Field
      kind={kind}
      id={`igl-${kind}`}
      value={value[kind]}
      error={errors[`igl.${kind}`]}
      onChange={(next) => onChange(kind, next)}
      autoComplete={autoComplete}
      className={className}
    />
  );
  return (
    <div className={grid}>
      <div className="sm:col-span-2">
        <Label
          htmlFor="game"
          className="mb-2 text-sm font-medium text-text-secondary"
        >
          Select game
        </Label>
        <Select
          value={game || undefined}
          onValueChange={(next) => {
            if (next === "PUBG" || next === "FREE_FIRE") onGameChange(next);
          }}
        >
          <SelectTrigger
            id="game"
            className={cn(fieldClass, "w-full")}
            aria-invalid={errors.game ? true : undefined}
          >
            <SelectValue placeholder="PUBG or Free Fire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PUBG">PUBG</SelectItem>
            <SelectItem value="FREE_FIRE">Free Fire</SelectItem>
          </SelectContent>
        </Select>
        {errors.game && (
          <p role="alert" className="mt-2 text-sm text-status-danger">
            {errors.game}
          </p>
        )}
      </div>
      <div className="sm:col-span-2">
        <Label
          htmlFor="referralCode"
          className="mb-2 text-sm font-medium text-text-secondary"
        >
          Referral code{" "}
          <span className="font-normal text-text-muted">(optional)</span>
        </Label>
        <Input
          id="referralCode"
          name="referralCode"
          value={referralCode}
          placeholder="Gaming zone referral code"
          maxLength={32}
          autoComplete="off"
          aria-invalid={errors.referralCode ? true : undefined}
          className={fieldClass}
          onChange={(e) => onReferralChange(e.target.value)}
        />
        {errors.referralCode && (
          <p role="alert" className="mt-2 text-sm text-status-danger">
            {errors.referralCode}
          </p>
        )}
      </div>
      {field("fullName", "name", "sm:col-span-2")}
      {field("whatsapp", "tel")}
      {field("age", "off")}
      {field("email", "email", "sm:col-span-2")}
      {field("area", "off", "sm:col-span-2")}
    </div>
  );
}


export function TeamStep({
  value,
  errors,
  onTeamName,
  onPlayer,
}: {
  value: TeamDetails;
  errors: FormErrors;
  onTeamName: (value: string) => void;
  onPlayer: (index: number, field: keyof PlayerDetails, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label
          htmlFor="teamName"
          className="mb-2 text-sm font-medium text-text-secondary"
        >
          Team name
        </Label>
        <Input
          id="teamName"
          name="teamName"
          placeholder="e.g. Karachi Kings"
          maxLength={40}
          autoComplete="off"
          value={value.teamName}
          aria-invalid={errors.teamName ? true : undefined}
          required
          className={fieldClass}
          onChange={(e) => onTeamName(e.target.value)}
        />
        {errors.teamName && (
          <p role="alert" className="mt-2 text-sm text-status-danger">
            {errors.teamName}
          </p>
        )}
      </div>
      {value.players.slice(0, PLAYER_COUNT).map((player, i) => (
        <fieldset
          key={`player-${i + 1}`}
          className="border border-white/10 bg-surface-200/60 p-4"
        >
          <legend className="flex items-center gap-2 px-2 font-heading text-xs font-semibold tracking-[0.25em] text-lime uppercase">
            Player {i + 1}
            {i === 0 && (
              <Badge
                variant="outline"
                className="rounded-none border-lime/40 bg-lime/10 px-1.5 py-0.5 font-heading text-[10px] tracking-widest text-lime"
              >
                IGL
              </Badge>
            )}
          </legend>
          <div className={grid}>
            {(["fullName", "pubgName", "whatsapp", "age", "area"] as const).map(
              (kind) => (
                <Field
                  key={kind}
                  kind={kind}
                  id={`p${i + 1}-${kind}`}
                  value={player[kind]}
                  error={errors[`players.${i}.${kind}`]}
                  onChange={(next) => onPlayer(i, kind, next)}
                  className={kind === "area" ? "sm:col-span-2" : undefined}
                />
              ),
            )}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

const bankRows = [
  ["Account title", bankDetails.accountTitle],
  ["Bank name", bankDetails.bankName],
  ["Account number", bankDetails.accountNumber],
  ["IBAN", bankDetails.iban],
] as const;

export function PaymentStep({
  receipt,
  error,
}: {
  receipt: ReceiptUpload;
  error?: string;
}) {
  const { file: slip, status, progress, choose, retry } = receipt;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!slip?.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(slip);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [slip]);

  const problem = (slip ? receipt.error : undefined) ?? error;
  const canRetry = status === "error" && !!slip && !validateSlip(slip);

  return (
    <div className="space-y-5">
      <div className="border border-lime/30 bg-lime/5 px-4 py-3">
        <p className="font-heading text-[11px] font-semibold tracking-[0.2em] text-lime uppercase">
          Registration fee
        </p>
        <p className="mt-1 font-display text-3xl font-extrabold text-white">
          Rs {registrationDetails.registrationFee.toLocaleString("en-PK")}
        </p>
        <p className="mt-1 text-sm text-text-muted">
          {registrationDetails.registrationFeeText}
        </p>
      </div>

      <dl className="divide-y divide-white/10 border border-white/10 bg-surface-200/60">
        {bankRows.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <dt className="font-heading text-[11px] font-semibold tracking-[0.2em] text-text-muted uppercase">
              {label}
            </dt>
            <dd className="font-heading text-sm font-semibold break-all text-white sm:text-right">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">
          Payment slip
        </p>
        <label
          htmlFor="slip"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            choose(e.dataTransfer.files[0] ?? null);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 border border-dashed px-4 py-6 text-center transition-colors hover:border-lime hover:bg-lime/5 focus-within:border-lime focus-within:ring-2 focus-within:ring-lime",
            dragging
              ? "border-lime bg-lime/10"
              : problem
                ? "border-status-danger/60"
                : "border-white/20 bg-surface-200/60",
          )}
        >
          <input
            id="slip"
            type="file"
            accept={SLIP_TYPES.join(",")}
            className="sr-only"
            onChange={(e) => {
              choose(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
          {slip ? (
            <span className="flex w-full items-center gap-3 text-left">
              {previewUrl ? (
                // biome-ignore lint/performance/noImgElement: local blob preview
                <img
                  src={previewUrl}
                  alt="Payment slip preview"
                  className="size-16 shrink-0 border border-white/10 object-cover"
                />
              ) : (
                <span className="flex size-16 shrink-0 items-center justify-center border border-white/10 bg-surface-300 text-lime">
                  <Icon name="file" className="size-7" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-heading text-sm font-semibold text-white">
                  {slip.name}
                </span>
                <span
                  className={cn(
                    "block text-xs",
                    status === "done"
                      ? "text-lime"
                      : status === "error"
                        ? "text-status-danger"
                        : "text-text-muted",
                  )}
                >
                  {(slip.size / 1024).toFixed(0)} KB
                  {status === "uploading" &&
                    ` · ${progress < 100 ? `Uploading ${progress}%` : "Saving…"}`}
                  {status === "done" && " · Uploaded"}
                  {status === "error" && " · Not uploaded"}
                </span>
                {status === "uploading" && (
                  <Progress
                    value={progress}
                    aria-label="Upload progress"
                    className="mt-1.5"
                  />
                )}
              </span>
              <span className="shrink-0 font-heading text-xs font-semibold tracking-wider text-lime uppercase">
                Replace
              </span>
            </span>
          ) : (
            <>
              <span className="flex size-11 items-center justify-center border border-lime/40 bg-lime/10 text-lime">
                <Icon name="upload" className="size-5" />
              </span>
              <span className="font-heading text-sm font-semibold tracking-wider text-white uppercase">
                Upload payment slip
              </span>
              <span className="text-xs text-text-muted">
                JPG, PNG, WebP or PDF, up to {MAX_SLIP_BYTES / 1024 / 1024} MB
              </span>
            </>
          )}
        </label>
        {problem && (
          <p
            role="alert"
            className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-status-danger"
          >
            {problem}
            {canRetry && (
              <button
                type="button"
                onClick={retry}
                className="font-heading font-semibold tracking-wider text-lime uppercase hover:underline"
              >
                Retry upload
              </button>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export function AgreementsStep({
  accepted,
  error,
  onToggle,
}: {
  accepted: boolean[];
  error?: string;
  onToggle: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      {tournamentRules.map((rule, i) => (
        <label
          key={rule}
          htmlFor={`rule-${i}`}
          className="flex cursor-pointer items-start gap-3 border border-white/10 bg-surface-200/60 p-3 transition-colors has-data-checked:border-lime/50 has-data-checked:bg-lime/6 hover:border-white/30"
        >
          <Checkbox
            id={`rule-${i}`}
            checked={accepted[i] ?? false}
            onCheckedChange={() => onToggle(i)}
            className="mt-0.5 size-5 rounded-none border-white/30 data-checked:border-lime data-checked:bg-lime data-checked:text-background"
          />
          <span className="text-sm text-text-secondary">{rule}</span>
        </label>
      ))}
      {error && (
        <p role="alert" className="text-sm text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function ConfirmationStep({ teamName }: { teamName: string }) {
  return (
    <output className="flex flex-col items-center px-2 py-6 text-center">
      <span className="flex size-20 items-center justify-center border-2 border-lime bg-lime/10 text-lime shadow-glow-lime">
        <Icon name="check" className="size-10" />
      </span>
      <h3 className="mt-6 font-display text-5xl leading-[0.9] font-extrabold uppercase">
        Squad <span className="text-lime">locked.</span>
      </h3>
      <p className="mt-4 text-sm font-semibold tracking-widest text-text-muted uppercase">
        {teamName.trim()}
      </p>
      <p className="mt-3 max-w-sm text-text-muted">{confirmationMessage}</p>
    </output>
  );
}
