
CREATE TABLE public.demo_bets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  match_id TEXT NOT NULL,
  team1 TEXT NOT NULL,
  team2 TEXT NOT NULL,
  event TEXT NOT NULL DEFAULT '',
  team_picked TEXT NOT NULL,
  odds_at_bet NUMERIC(6,2) NOT NULL DEFAULT 1.50,
  stake NUMERIC(10,2) NOT NULL DEFAULT 100,
  result TEXT NOT NULL DEFAULT 'pending' CHECK (result IN ('pending', 'won', 'lost')),
  payout NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.demo_bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own demo bets"
  ON public.demo_bets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own demo bets"
  ON public.demo_bets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own demo bets"
  ON public.demo_bets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own demo bets"
  ON public.demo_bets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
