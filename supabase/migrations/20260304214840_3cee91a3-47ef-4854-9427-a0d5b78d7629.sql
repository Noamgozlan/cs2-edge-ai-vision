
CREATE TABLE public.prediction_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  match_id TEXT NOT NULL,
  team1 TEXT NOT NULL,
  team2 TEXT NOT NULL,
  event TEXT NOT NULL DEFAULT '',
  recommended_bet TEXT NOT NULL,
  bet_type TEXT NOT NULL DEFAULT 'match_winner',
  confidence INTEGER NOT NULL DEFAULT 50,
  ai_pick TEXT NOT NULL,
  actual_result TEXT DEFAULT 'pending',
  odds_at_prediction NUMERIC NOT NULL DEFAULT 1.50,
  stake NUMERIC NOT NULL DEFAULT 100,
  payout NUMERIC NOT NULL DEFAULT 0,
  data_source TEXT NOT NULL DEFAULT 'training',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prediction_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own predictions" ON public.prediction_tracking FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own predictions" ON public.prediction_tracking FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own predictions" ON public.prediction_tracking FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own predictions" ON public.prediction_tracking FOR DELETE TO authenticated USING (auth.uid() = user_id);
