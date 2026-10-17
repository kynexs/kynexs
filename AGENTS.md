<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- Match reference images and the existing design system exactly; do not redesign or “improve” visuals unless asked.
- Keep Tailwind v4 CSS-first config only; do not add or use `tailwind.config.ts`.
- Prefer server actions for registration/contact mutations over API-route fetch services.
- For large multi-step work: explore first, write a plan (often `docs/plan.md`), stop for approval, then implement only after explicit approval.
- Structural refactors should not change behavior; keep `"use server"` vs `server-only` as-is; leave pure utilities in `src/lib`.
- Prefer preferred folders: `src/actions`, `src/validations`, `src/types`, `src/services` for mutations, schemas, types, and third-party wrappers.
- Do not rewrite stock shadcn components just to silence Biome a11y/hook noise; fix only new code.
- Follow existing project conventions and ship the smallest complete change; no drive-by refactors.

## Learned Workspace Facts

- Stack: Next.js 16.4 App Router, React 19, Tailwind v4, shadcn/ui (Base UI), Biome, bun; brand name is “Kynexs” (`siteConfig`).
- Dark-only theme tokens live in `src/app/globals.css` (lime `#C0FE00`, purple `#782FFF`, background `#0B0B0E`); fonts Inter, Space Grotesk, and Barlow Condensed (display).
- Prisma is pinned to v7 with traditional `prisma/schema.prisma` (Postgres/Neon); client output under `prisma/generated/prisma`.
- Auth is Better Auth (not Clerk): `src/services/auth.ts`, `src/services/auth-client.ts`, and `src/app/api/auth/[...all]/route.ts`; dashboard protection uses Better Auth session cookies in `src/proxy.ts`.
- Route groups: `(landing)` owns public chrome and paths like `/contact` and `/matches`; dashboard must avoid colliding paths (e.g. `/contacts`, `/total-matches`, `/gaming-zones`).
- Domain models include Registration/Player/Receipt, Contact (with reply status), GamingZone, and Game enum (`PUBG` / `FREE_FIRE`).
- Receipt/slip uploads use S3-compatible Neon object storage helpers; validation is custom field/domain validators (not Zod).
- Dashboard registration UI uses TanStack Table v9 with shadcn Data Table patterns and sidebar shell under `(dashboard)`.
