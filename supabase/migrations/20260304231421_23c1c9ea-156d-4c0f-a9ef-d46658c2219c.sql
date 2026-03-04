
-- CS2 Teams table
CREATE TABLE public.cs2_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  logo_url text,
  ranking integer DEFAULT 0,
  country text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(name)
);

-- CS2 Tournaments table
CREATE TABLE public.cs2_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier text DEFAULT 'other',
  start_date date,
  end_date date,
  logo_url text,
  url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(name)
);

-- CS2 Matches table
CREATE TABLE public.cs2_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'hltv',
  source_match_id text,
  start_time_utc timestamptz,
  team1_name text NOT NULL,
  team2_name text NOT NULL,
  team1_id uuid REFERENCES public.cs2_teams(id),
  team2_id uuid REFERENCES public.cs2_teams(id),
  team1_logo text,
  team2_logo text,
  team1_rank integer DEFAULT 0,
  team2_rank integer DEFAULT 0,
  tournament_name text,
  tournament_id uuid REFERENCES public.cs2_tournaments(id),
  match_format text NOT NULL DEFAULT 'bo3',
  status text NOT NULL DEFAULT 'upcoming',
  score text,
  map text,
  url text,
  last_updated_utc timestamptz NOT NULL DEFAULT now(),
  is_stale boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source, source_match_id)
);

-- Indexes
CREATE INDEX idx_cs2_matches_status ON public.cs2_matches(status);
CREATE INDEX idx_cs2_matches_start_time ON public.cs2_matches(start_time_utc);
CREATE INDEX idx_cs2_matches_source ON public.cs2_matches(source);
CREATE INDEX idx_cs2_matches_last_updated ON public.cs2_matches(last_updated_utc);

-- RLS: public read access (betting site), no public write
ALTER TABLE public.cs2_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cs2_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cs2_tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for matches" ON public.cs2_matches FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access for teams" ON public.cs2_teams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access for tournaments" ON public.cs2_tournaments FOR SELECT TO anon, authenticated USING (true);

-- Service role can write (edge functions use service role)
CREATE POLICY "Service role full access matches" ON public.cs2_matches FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access teams" ON public.cs2_teams FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access tournaments" ON public.cs2_tournaments FOR ALL TO service_role USING (true) WITH CHECK (true);
