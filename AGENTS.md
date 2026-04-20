# AGENTS.md

## Project Overview

`cs2-edge-ai-vision` is a Vite + React + TypeScript frontend for a CS2 betting analysis product. It combines:

- a public marketing site and auth flow
- an authenticated dashboard for match analysis and demo betting
- Supabase auth, database access, and edge functions
- client-side AI analysis requests with multiple provider fallbacks
- Vercel deployment for the frontend

The project appears to have originated from Lovable and has since been customized locally. Treat the repository itself, not the default Lovable README, as the source of truth.

## Important Directories

- `src/pages`: top-level route screens for landing, auth, dashboard, and feature pages
- `src/components/landing`: marketing site sections and navigation
- `src/components/dashboard`: dashboard shell and navigation pieces
- `src/components/ui`: shared shadcn/Radix-style primitives
- `src/contexts`: theme, language, timezone, and subscription providers
- `src/integrations/supabase`: generated Supabase client/types
- `src/lib`: app utilities, API calls, auth helpers, team logo helpers
- `src/i18n`: translation keys and localized strings
- `src/test`: lightweight Vitest setup and placeholder example tests
- `public`: static assets
- `supabase/functions`: edge functions for matches, AI analysis, scraping, billing, and subscription checks
- `supabase/migrations`: SQL migrations
- `.agents/skills`: existing project-local skill library from previous tooling
- `.codex/skills`: Codex-focused local skill wrappers added for this repo

## Stack

- Vite 5
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix primitives
- TanStack Query
- Framer Motion
- Supabase
- Vitest + Testing Library
- Vercel for production hosting

## Run, Test, Lint, Build

Use `npm.cmd` on Windows PowerShell if `npm` script execution is blocked by execution policy.

- Install: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Dev-mode build: `npm run build:dev`
- Preview build: `npm run preview`
- Lint: `npm run lint`
- Test: `npm run test`
- Watch tests: `npm run test:watch`

## Environment and Deployment Notes

Expected frontend environment variables from `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Frontend deploys to Vercel. The current production domain is expected to be configured in Supabase auth redirect settings when auth changes are made.

Supabase edge functions live under `supabase/functions`. Several are configured with `verify_jwt = false`, so changes there deserve extra care and explicit verification.

## Architecture Notes

- Routing is defined in `src/App.tsx`.
- Auth gating is client-side via `AuthGuard` and Supabase session state.
- Landing and dashboard experiences are separate but share theme/tokens.
- Data fetching is mostly query-driven through TanStack Query.
- Match analysis relies on `src/lib/api.ts`, which includes both Supabase edge function calls and direct third-party AI provider fallback logic.
- UI styling is token-driven in `src/index.css` using CSS variables and shared utility classes like `surface-raised`, `pressable`, and `focus-ring`.

## Coding Standards and Conventions

- Inspect nearby files before adding new patterns.
- Match the existing architecture before introducing new abstractions.
- Prefer extending existing components, contexts, utilities, and styling tokens over creating parallel systems.
- Keep changes small and reversible.
- Preserve current naming and file placement conventions unless there is a strong local reason to improve them.
- Use TypeScript types that fit existing shapes instead of broad `any`.
- Keep comments sparse and only add them where they reduce genuine ambiguity.
- Prefer existing Tailwind tokens/utilities and CSS variables over hard-coded one-off styles.
- For frontend work, preserve the repo's current visual language: restrained blue primary, clean card surfaces, data-forward layout, subtle motion, and strong readability.
- For motion, reuse the project's current Framer Motion cadence and easing patterns unless a specific interaction needs something different.

## UI and System Conventions

- The app already has a defined design direction in `src/index.css`: restrained accent color, card-based surfaces, subtle shadows, readable typography, and measured motion.
- Avoid importing a flashy external design language just because a design skill suggests one.
- Dashboard UI should stay information-dense but readable.
- Landing UI should remain conversion-aware without breaking brand continuity with the authenticated app.
- Maintain accessibility basics: keyboard focus, readable contrast, and meaningful hover/active states.
- Respect existing responsive behavior and test mobile/desktop implications for layout work.

## Risky Areas

- `src/lib/api.ts`: contains direct external AI provider calls and sensitive integration behavior
- `supabase/functions/*`: external APIs, scraping, billing, and auth-adjacent backend logic
- auth flow in `src/pages/Login.tsx`, `src/pages/Register.tsx`, `src/pages/ResetPassword.tsx`, and `src/App.tsx`
- translation changes in `src/i18n/translations.ts`
- subscription and billing logic under dashboard settings and Supabase functions
- any change that affects environment variables, redirect URLs, or deploy behavior

## Safety Constraints

- Never invent architectural history or "memory"; ground recurring knowledge in repository files.
- Do not rewrite large sections when a targeted change will do.
- Do not change generated Supabase files casually; verify whether regeneration is the right path first.
- Be careful with secrets and credentials. Do not copy secrets into committed files.
- Treat `.env`, provider keys, and deployment settings as sensitive.
- Verify auth and billing-related changes with extra scrutiny.

## Local Skills

Read `SKILLS.md` before using local skills. The Codex-facing local skill wrappers live in `.codex/skills`.

Use only the minimum relevant skills:

- use the memory skill for recurring repo knowledge, decisions, and grounded gotchas
- use the UI/UX skill for landing pages, dashboards, layout polish, forms, responsiveness, and conversion-oriented UI work
- use the superpowers skill for debugging, refactors, repo understanding, and architecture-heavy work
- use the execution skill for vague, broad, or multi-step tasks that need clear implementation slicing and momentum

If multiple skills apply, combine them deliberately and keep context lean.

## Definition of Done

A task is done when all of the following are true:

- the change matches nearby code and existing architecture
- assumptions are stated clearly when they matter
- relevant build, test, lint, or targeted verification has been run when feasible
- user-visible behavior is updated consistently across affected areas
- docs or local memory are updated if the task changes enduring repo knowledge
- there are no unnecessary rewrites or orphaned patterns introduced by the change

## Working Style for Future Agents

- Start by inspecting the relevant files and adjacent code paths.
- Prefer grounded repo knowledge over generic framework advice.
- Document assumptions clearly when the repo does not fully answer a question.
- Avoid unnecessary rewrites, speculative abstractions, or style churn.
- If something is incompatible with the existing setup, explain the limitation and choose the smallest working adaptation.
