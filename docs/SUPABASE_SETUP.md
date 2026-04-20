# Supabase Setup

This repository already contains the database schema in `supabase/migrations` and the frontend Google OAuth flow in the auth pages.

## Frontend env

Required in `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

The frontend must use the publishable key only. Never put the secret key in any `VITE_` variable.

## Edge function env

Recommended secrets for hosted Supabase:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `PANDASCORE_API_KEY`

This repo also supports older env names for compatibility:

- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Database

The repo already includes migrations for:

- `profiles`
- `demo_bets`
- `prediction_tracking`
- `cs2_teams`
- `cs2_tournaments`
- `cs2_matches`
- RLS policies and the new-user profile trigger

If you point the app at a fresh Supabase project, run these migrations before using the app.

## Match ingestion

The CS2 match pipeline uses the `pandascore-matches` edge function as the primary refresh source for live/upcoming CS2 matches.

To enable it:

- add `PANDASCORE_API_KEY` to your Supabase project secrets
- redeploy the affected edge functions if needed

The frontend-facing `fetch-matches` function will refresh PandaScore data when today's cache is empty or stale.

## Google Auth

The frontend already calls `supabase.auth.signInWithOAuth({ provider: "google" })`.

What still must be configured outside the repo:

1. In Google Cloud, create a Web OAuth client.
2. Add this callback URL in Google Cloud:
   - `https://lnyylkqxaqjwhykwmbib.supabase.co/auth/v1/callback`
3. In Supabase Dashboard -> Authentication -> Providers -> Google:
   - enable Google
   - paste the Google Client ID
   - paste the Google Client Secret
4. In Supabase Dashboard -> Authentication -> URL Configuration:
   - Site URL: `https://cs2-edge-ai-vision.vercel.app`
   - Additional Redirect URLs:
     - `https://cs2-edge-ai-vision.vercel.app`
     - `https://cs2-edge-ai-vision.vercel.app/dashboard`
     - `http://localhost:8080`
     - `http://localhost:8080/dashboard`
     - `http://localhost:8080/reset-password`

## Limitation

This repository cannot create the Google OAuth client for you. You still need the Google Client ID and Client Secret from Google Cloud before Google login can be fully enabled in Supabase.
