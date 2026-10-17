# Implementation plan: Gaming Zones, Contacts, Better Auth RBAC, table filters

**Status:** approved and implemented (defaults used for open questions).  
**Stack checked:** Next.js 16.4 (App Router, `proxy.ts`), Prisma 7.10 + Neon Postgres, Clerk 7.x (to remove), TanStack Table 9, shadcn/Base UI, `date-fns` 4 + `react-day-picker` 10 (Calendar/Popover already installed). **Zod is not used**; validation stays in `src/lib/fields.ts` / domain validators.

---

## Current baseline (what exists today)

| Area | Findings |
|------|----------|
| Onboarding | Dialog flow in `src/components/sections/onboarding.tsx` + `onboarding-steps.tsx`. Steps: IGL → Team → Payment → Rules → Confirm. Submit via `registerSquad` in `src/action/registration/actions.ts`. |
| Payment step | Shows `bankDetails` only. Does **not** show `registrationDetails` from `src/lib/config.ts`. |
| Prisma | `Contact`, `Registration`, `Player`, `Receipt`, `RegistrationStatus`. No game, no gaming zone, no contact reply status. IDs are UUID strings. No migrations folder checked in yet (`prisma.config.ts` points at `prisma/migrations`). |
| Registration admin | `/registration` + `src/components/registration/*` + `src/lib/registrations-admin.ts`. Client-side search only. No game filter, no date filter, no Created At column in UI (field exists on row type). |
| Contact | Public `sendContact` action writes to DB. **No dashboard UI.** Landing already owns `/contact`. |
| Auth | Clerk: `src/proxy.ts`, `ClerkProvider` in dashboard layout, `UserButton` in sidebar, `auth()` only on `deleteRegistration`. Env: `NEXT_PUBLIC_CLERK_*`, `CLERK_SECRET_KEY`. |
| Sidebar | Overview, Registration, Matches (`/total-matches`). |
| Route collisions | Landing has `/contact` and `/matches`. Dashboard must **not** reuse those paths. |

---

## Recommended implementation order

Do **auth + schema foundation first**, then product features that need RBAC, then filters.

1. **Prisma domain schema** (Game enum, GamingZone, Registration relations, Contact status) + migrate.  
2. **Better Auth** (remove Clerk, protect dashboard, one-time admin signup, admin plugin).  
3. **Permissions helpers** + wire deletes/mutations.  
4. **Onboarding** (game select, referral, payment fee copy).  
5. **Dashboard: Gaming Zones** (`/gaming-zones`).  
6. **Dashboard: Contacts** (`/contacts`).  
7. **Dashboard: Users** (`/users`, admin-only).  
8. **Reusable date-range filter + Created At columns + registration game filter.**

Rationale: building delete UIs before server-side role checks invites a window where any logged-in user can delete. Filters last so every table shares one component.

---

## Step 1 — Onboarding, GamingZone model, Gaming Zones dashboard, payment fee

### 1.1 Prisma schema

**New enum**

```prisma
enum Game {
  PUBG
  FREE_FIRE
}
```

**New model `GamingZone`**

| Field | Type | Notes |
|-------|------|--------|
| `id` | `String @id` | `crypto.randomUUID()` |
| `zoneName` | `String` | required |
| `zoneNumber` | `String` (or `Int`) | store as string if zones can be like `"A-12"` — **default plan: `String`** |
| `zoneLocation` | `String` | required |
| `referralCode` | `String @unique` | **server-generated only** |
| `createdAt` | `DateTime @default(now())` | |
| `updatedAt` | `DateTime` | set on write (match existing Contact/Registration pattern) |
| `registrations` | `Registration[]` | relation |

Indexes: `@@index([referralCode])`, `@@index([createdAt])`, optional `@@index([zoneName])`.

**`Registration` additions**

| Field | Type | Notes |
|-------|------|--------|
| `game` | `Game` | required for new rows; existing rows need a migration default (see below) |
| `gamingZoneId` | `String?` | FK → `GamingZone`, `onDelete: SetNull` |
| `referralCodeEntered` | `String?` | optional denormalized copy of what the user typed (audit) |
| `gamingZone` | `GamingZone?` | relation |

**Migration steps**

1. Edit `prisma/schema.prisma`.  
2. `npx prisma migrate dev --name add-gaming-zones-and-game` (or `db push` if this env still has no migration history — prefer migrate once history exists).  
3. `npx prisma generate`.  
4. Backfill: for existing registrations without `game`, set `PUBG` as default in the same migration SQL (`DEFAULT 'PUBG'` then make required), since historical data is PUBG-only.

**Referral policy (assumption):** referral is **optional**. Empty → `gamingZoneId = null`. Non-empty → must match an existing `GamingZone.referralCode` (normalize: trim + uppercase) or registration fails with a clear error.

### 1.2 Onboarding page 1 (IGL step)

**Files to modify**

- `src/components/sections/onboarding-steps.tsx` — extend `IglStep` (or sibling fields on step 0) with:
  - shadcn `Select`: PUBG | Free Fire (required).
  - `Input` for referral code (optional).
- `src/components/sections/onboarding.tsx` — state for `game` + `referralCode`; include in step-0 validation and `registerSquad` payload; reset on close.
- `src/lib/registration.ts` — extend `RegistrationInput` / `validateRegistration` / step validators:
  - `game` required ∈ `{ PUBG, FREE_FIRE }`.
  - `referralCode` optional; if present, length/format check only on client; **existence check on server**.
- `src/action/registration/actions.ts` — resolve zone by code; persist `game`, `gamingZoneId`, `referralCodeEntered`.

**Optional UX (small):** when game is Free Fire, label `pubgName` as “In-game name” in Team step (field stays `pubgName` in DB to avoid a Player rename migration).

**Edge cases**

- Invalid referral → block Continue on submit (server) with toast/inline error: “Invalid referral code.”
- Race: zone deleted after user typed code → treat as invalid on submit.
- Case/space differences → normalize before lookup.

### 1.3 Payment step — registration fee copy

**Files**

- `src/components/sections/onboarding-steps.tsx` (`PaymentStep`) — above bank details (or between bank details and upload), show:
  - Fee amount from `registrationDetails.registrationFee` (formatted, e.g. `Rs 3,000`).
  - `registrationDetails.registrationFeeText`.
- Import from `@/lib/config` (already imports `bankDetails`).

No schema change.

### 1.4 Dashboard route: Gaming Zones

**Route:** `src/app/(dashboard)/gaming-zones/page.tsx`  
**Protect:** add `/gaming-zones(.*)` to proxy matcher (after Better Auth swap).  
**Nav:** add “Gaming Zones” to `src/components/dashboard/app-sidebar.tsx`.

**New files (mirror registration pattern)**

| Path | Role |
|------|------|
| `src/lib/gaming-zones-admin.ts` | server-only list/stats/CRUD helpers |
| `src/action/gaming-zones/actions.ts` | create / update / delete (RBAC later) |
| `src/components/gaming-zones/types.ts` | row + stats types |
| `src/components/gaming-zones/summary-cards.tsx` | 2 cards |
| `src/components/gaming-zones/columns.tsx` | table columns |
| `src/components/gaming-zones/gaming-zones-table.tsx` | search + table |
| `src/components/gaming-zones/row-actions.tsx` | ⋮ menu |
| `src/components/gaming-zones/zone-form-dialog.tsx` | add/edit dialog |
| `src/components/gaming-zones/delete-zone-dialog.tsx` | confirm delete |

**Stat cards**

1. **Total referred registrations** — `Registration` count where `gamingZoneId IS NOT NULL` (or `referralCodeEntered` not null).  
2. **Top gaming zone** — zone with highest related registration count; show `zoneName` + `referralCode` (empty state if none).

**Table columns:** ID, Zone Name, Number, Location, Referral Code, Created At, actions.

**Actions**

- Copy referral code (`navigator.clipboard` + sonner toast).  
- Edit details (name, number, location only — **not** referral code).  
- Delete (admin-only after Step 3; confirm dialog). Warn if zone has registrations (prefer block delete or SetNull and allow — **plan: allow delete, null out FKs** via `onDelete: SetNull`).

**Add Gaming Zone**

- Dialog fields: zone name, zone number, zone location.  
- Server generates unique `referralCode`, e.g. `KZ` + 8 uppercase alphanumeric from `crypto.getRandomValues`, retry on unique conflict (max N attempts).

**Search:** client and/or server filter by zone name, referral code, location (start client-side like registrations; move to query params later if lists grow).

**Loading / empty / error:** Suspense + skeleton cards/table; empty “No gaming zones yet”; action errors via sonner.

---

## Step 2 — Dashboard Contacts

### 2.1 Prisma

Add to `Contact`:

```prisma
enum ContactStatus {
  UNREPLIED
  REPLIED
}

model Contact {
  // existing fields…
  status ContactStatus @default(UNREPLIED)
  @@index([status, createdAt])
}
```

Migration: `add-contact-status`. Existing rows → `UNREPLIED`.

**`sendContact`:** ensure create sets default (schema default is enough). Do not expose status from public form.

### 2.2 Route and UI

**Route:** `/contacts` — **not** `/contact` (landing collision).  
Files parallel to gaming zones:

- `src/app/(dashboard)/contacts/page.tsx`
- `src/lib/contacts-admin.ts`
- `src/action/contacts/actions.ts` — `markContactReplied`, `deleteContact`
- `src/components/contacts/*` — summary cards, table, columns, row-actions, detail sheet/dialog, delete dialog

**Stat cards**

1. Total contacts.  
2. Today’s contacts — `createdAt` within “today” in app timezone (see Step 4).  
3. Replied contacts — `status === REPLIED`.

**Table columns:** ID, Name, Email, Message (truncated), Status, Created At, actions.

**Actions**

- View contact → sheet/dialog with full message + phone.  
- Mark as replied → server action sets `REPLIED` (idempotent if already replied).  
- Delete → admin-only after Step 3.

**Search:** name, email, message (and maybe phone).

**Sidebar:** add “Contacts”.

---

## Step 3 — Remove Clerk, Better Auth, RBAC

### 3.1 Dependencies

**Remove**

- `@clerk/nextjs`
- All Clerk env vars from `.env` / `.env.example` / Netlify/Vercel dashboards

**Add**

| Package | Why |
|---------|-----|
| `better-auth` | Auth core + Next handler + admin plugin + `nextCookies` |
| `@better-auth/prisma-adapter` | Official Prisma adapter (per current Better Auth Prisma docs); confirm import path at install (`better-auth/adapters/prisma` vs package export) |

**Do not add zod** unless a Better Auth example requires it for forms — prefer existing validators.

### 3.2 Better Auth setup

**New files**

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | `betterAuth({ database: prismaAdapter(prisma, { provider: "postgresql" }), emailAndPassword: { enabled: true }, plugins: [admin({ … }), nextCookies()] })` |
| `src/lib/auth-client.ts` | `createAuthClient` + `adminClient()` |
| `src/app/api/auth/[...all]/route.ts` | `toNextJsHandler(auth)` |
| `src/lib/auth/session.ts` | `getSession()` / `requireSession()` / `requireRole()` helpers using `auth.api.getSession({ headers })` |
| `src/lib/auth/permissions.ts` | Capability matrix (below) |

**Prisma:** run `npx auth@latest generate` (or documented CLI) to append Better Auth models (`user`, `session`, `account`, `verification`, admin plugin fields like `role`, `banned`, etc.) into `schema.prisma`, then `prisma migrate dev --name add-better-auth`.

**Env (`.env.example`)**

```
BETTER_AUTH_SECRET=   # openssl rand -base64 32
BETTER_AUTH_URL=      # e.g. http://localhost:3000
```

### 3.3 Remove Clerk touchpoints

| File | Change |
|------|--------|
| `src/proxy.ts` | Replace `clerkMiddleware` with Better Auth cookie/session check; protect all dashboard routes |
| `src/app/(dashboard)/layout.tsx` | Remove `ClerkProvider`; optional session gate + redirect |
| `src/components/dashboard/app-sidebar.tsx` | Replace `UserButton` with sign-out + name from Better Auth session |
| `src/action/registration/actions.ts` | Replace `auth()` from Clerk with session + permission helpers |
| `package.json` | Drop `@clerk/nextjs` |
| Matcher | Drop `/__clerk` |

**Protected routes (proxy):** `/overview`, `/registration`, `/total-matches`, `/gaming-zones`, `/contacts`, `/users`, plus any `/dashboard(.*)`.  
Public: landing, `/api/auth/*`, registration/contact public actions.

**Defense in depth:** every mutating server action and each dashboard page/layout calls `requireSession()` (and role checks where needed). Proxy alone is not enough (Better Auth docs: cookie-only checks are optimistic).

### 3.4 One-time admin signup

**Routes**

- `src/app/(auth)/sign-in/page.tsx` — email/password sign-in.  
- `src/app/(auth)/sign-up/page.tsx` — **only available when no admin exists**.

**Rules**

1. On sign-up GET/POST: if any user with `role === "admin"` (or any user if first-run) exists → 403 / redirect to sign-in with message “Signup is closed.”  
2. First successful signup → create user with `role: "admin"` (via Better Auth `databaseHooks` / signup body role only if plugin allows for first user; otherwise create then set role, or use `npx auth create-admin` once and disable public signup entirely).  
3. **Preferred product flow:** public `/sign-up` works **once**; afterward only admin creates users via dashboard (`authClient.admin.createUser` / `auth.api.createUser`).

Document the bootstrap: first deploy → open `/sign-up` → create admin → never use public signup again.

### 3.5 Users management page (admin plugin)

**Route:** `/users` (admin-only; non-admins redirected to `/overview`).

**UI**

- Table: name, email, role, createdAt, actions (ban/remove optional — **minimum:** create user + set role; delete/ban if admin plugin exposes safely).  
- Dialog: name, email, password, role (`admin` | `user`).  
- Use Better Auth admin plugin APIs (`createUser`, `setRole`, `listUsers`).

**Sidebar:** “Users” visible only to `admin`.

### 3.6 Permission matrix

| Capability | `admin` | `user` |
|------------|---------|--------|
| View registrations / details / slip | ✓ | ✓ |
| Delete registration | ✓ | ✗ |
| View contacts / details | ✓ | ✓ |
| Mark contact replied | ✓ | ✓ |
| Delete contact | ✓ | ✗ |
| View gaming zones | ✓ | ✓ |
| Create / edit gaming zone | ✓ | ✓ (edit yes; **create:** allow both unless you prefer admin-only — **plan: both can create & edit**) |
| Delete gaming zone | ✓ | ✗ |
| Users page / create users | ✓ | ✗ |

**Server:** `assertCan(session, "registration:delete")` etc. in every action.  
**UI:** hide/disable Delete menu items for `user`; pass `canDelete` from server props or client session role.

**Note vs `tasks.md`:** older note said “archive”; this plan follows the **delete vs no-delete** matrix in the request (no archive status unless you ask later).

---

## Step 4 — Game filter + reusable date range + Created At

### 4.1 Reusable date range filter

**New component:** `src/components/dashboard/date-range-filter.tsx`

- shadcn `Popover` + `Calendar` with `mode="range"` (`react-day-picker` already installed).  
- Props: `value: { from?: Date; to?: Date }`, `onChange`, `onClear`.  
- Clear / reset control.  
- Display format via `date-fns` (`format`).

**Timezone**

- App audience is PK — use constant `APP_TIMEZONE = "Asia/Karachi"` in `src/lib/timezone.ts`.  
- Inclusive range: `from` = start of day in Karachi → UTC instant; `to` = end of day in Karachi → UTC instant.  
- Filter with `createdAt >= fromUtc && createdAt <= toUtc`.  
- Prefer `@date-fns/tz` **only if** plain `date-fns` cannot do TZ correctly (list as optional dependency). Avoid inventing local-browser TZ for “today” stats.

**Reuse on:** registrations, gaming zones, contacts, users (if table has Created At).

### 4.2 Registration game filter

Next to search in `registrations-table.tsx`:

- Select: All | PUBG | Free Fire.  
- Combine with text search + date range (AND).  
- Prefer **server-side** filtering once `game` exists (`listRegistrations({ game, q, from, to })`) so signed URLs aren’t generated for filtered-out rows. Until then, client filter is acceptable for small data.

### 4.3 Created At column

Add to every admin table (registrations already has `createdAt` on the type but not in `columns.tsx`). Format consistently (e.g. `dd MMM yyyy` in Karachi).

### 4.4 Filter composition

Single source of truth in each table component:

```
filtered = rows
  .filter(game)
  .filter(search)
  .filter(dateRange)
```

Or URL searchParams for shareable state (nice-to-have; not required for v1).

---

## Dependencies summary

| Action | Package |
|--------|---------|
| Remove | `@clerk/nextjs` |
| Add | `better-auth`, `@better-auth/prisma-adapter` (confirm at install) |
| Optional | `@date-fns/tz` for Asia/Karachi day boundaries |
| Already present | `date-fns`, `react-day-picker`, Calendar, Popover, Select, Dialog, Sheet, Table, Sonner |

---

## File / route checklist (end state)

**Routes**

- `/sign-in`, `/sign-up` (auth)  
- `/gaming-zones`, `/contacts`, `/users` (dashboard)  
- Existing: `/overview`, `/registration`, `/total-matches`

**Core libs**

- `src/lib/auth.ts`, `auth-client.ts`, `auth/session.ts`, `auth/permissions.ts`, `timezone.ts`  
- `src/lib/gaming-zones-admin.ts`, `contacts-admin.ts` (extend `registrations-admin.ts`)

**Proxy matcher** updated for all dashboard paths; Clerk gone.

---

## Edge cases (cross-cutting)

- Unique referral collision → retry generate.  
- Deleting a gaming zone with registrations → FK `SetNull`; stats still consistent.  
- Non-admin calling delete actions → `{ ok: false, error: "Forbidden" }` (not only UI hide).  
- Signup after admin exists → hard block.  
- Empty date range = no date constraint.  
- Partial range (only `from` or only `to`) = open-ended on the other side.  
- Contact message HTML → render as text only (no markdown HTML).  
- Build: dashboard still `instant = false` where auth/dynamic data requires it.

---

## Assumptions

1. Referral code is **optional** for registrants; invalid only when non-empty and unknown.  
2. Dashboard contacts live at **`/contacts`** (plural) to avoid clashing with landing `/contact`.  
3. Matches stay at `/total-matches`; gaming zones are a new nav item.  
4. First Better Auth user is the sole bootstrap admin via one-time `/sign-up` (or CLI `create-admin` as fallback documented in README).  
5. Existing registrations without a game backfill to **`PUBG`**.  
6. `zoneNumber` is a **string** (flexible identifiers).  
7. Role names are exactly `admin` and `user` (Better Auth admin plugin defaults).  
8. No archive workflow — delete is admin-only; users never soft-delete.  
9. Validation stays hand-rolled (`fields.ts` / domain libs), not Zod.  
10. “Today” and date filters use **Asia/Karachi**, not the browser’s local TZ.

---

## Open questions (need your answers before / during implementation)

1. **Signup bootstrap:** Prefer public one-time `/sign-up`, or disable signup entirely and create the first admin only via `npx auth create-admin` CLI?  
2. **Gaming zone create:** Should `user` role be allowed to **create** zones, or only edit existing ones? (Plan currently allows create + edit for `user`.)  
3. **Delete zone with registrations:** Allow delete (null FK) or block until no registrations reference it?  
4. **Referral required?** Confirm optional is OK, or make it required for launch.  
5. **Free Fire player field:** Keep DB column `pubgName` with relabeled UI, or rename to `inGameName` (larger migration)?  
6. **Users page extras:** Ban / impersonate / force-reset password in v1, or create + set role only?  
7. **Git state:** Your `dev` branch still has an **unfinished merge** (`MERGE_HEAD`). Should implementation wait until that merge commit is finished and pushed?

---

## Permission gate

**Stop here.** No application code will be written until you explicitly approve this plan (and answer any open questions you care about). Reply with approval and any overrides (e.g. “referral required”, “user cannot create zones”, “use CLI for first admin”).
