# Project Memory

This file stores durable, repo-specific notes for future Codex tasks.

Grounding rules:

- Only record facts that are supported by files in this repository or by verified changes made in this repository.
- Do not record guesses, preferences without evidence, or speculative future plans as facts.
- When updating this file, include a short `Evidence:` note pointing to the relevant file(s).

## Current Notes

### Stack and app shape

- Frontend stack is Vite + React + TypeScript + Tailwind + shadcn/Radix + TanStack Query.
  Evidence: `package.json`, `src/App.tsx`

- The app has a public landing experience and an authenticated dashboard experience.
  Evidence: `src/App.tsx`, `src/pages/Index.tsx`, `src/pages/Dashboard.tsx`

- Supabase is used for auth, database access, and edge functions.
  Evidence: `src/integrations/supabase/client.ts`, `supabase/config.toml`

### UI conventions

- The main visual direction uses restrained blue as the primary accent, card-based surfaces, subtle shadows, and measured motion.
  Evidence: `src/index.css`

- Dashboard surfaces frequently rely on utility classes like `surface-raised`, `pressable`, and `focus-ring`.
  Evidence: `src/index.css`, `src/pages/Dashboard.tsx`

### Verification habits

- `npm.cmd run build` works in PowerShell even when `npm` is blocked by execution policy.
  Evidence: local build verification in this repo on Windows PowerShell

- Tests currently exist but are minimal; do not assume strong automated coverage.
  Evidence: `src/test/example.test.ts`, `src/test/setup.ts`

### Auth and deployment

- Frontend deploys to Vercel and the local repo now contains a `.vercel` folder created by deployment linking.
  Evidence: root `.vercel/`, `.gitignore`

- Google OAuth flow was switched to native Supabase OAuth in login/register and uses redirect helpers in `src/lib/auth.ts`.
  Evidence: `src/pages/Login.tsx`, `src/pages/Register.tsx`, `src/lib/auth.ts`

### Analysis enrichment

- The `ai-analysis` edge function enriches player-related markets server-side by detecting player names from `prediction`, `alternativeBets`, `playerStats`, and `playerForm`, then attaching `playerContext`, `playerPhoto`, `playerSpotlights`, and `playerPhotoDirectory` fields for frontend rendering.
  Evidence: `supabase/functions/ai-analysis/index.ts`, `src/lib/api.ts`

- Real HLTV photo resolution currently depends on `FIRECRAWL_API_KEY` because direct HLTV fetches are Cloudflare-protected; when lookup fails, the function returns a deterministic avatar fallback instead of a null image.
  Evidence: `supabase/functions/ai-analysis/index.ts`
