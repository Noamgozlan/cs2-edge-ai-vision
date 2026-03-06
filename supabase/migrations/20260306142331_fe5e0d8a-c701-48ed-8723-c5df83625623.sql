CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Add unique constraint for upsert on source + source_match_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cs2_matches_source_source_match_id_key'
  ) THEN
    ALTER TABLE public.cs2_matches ADD CONSTRAINT cs2_matches_source_source_match_id_key UNIQUE (source, source_match_id);
  END IF;
END $$;