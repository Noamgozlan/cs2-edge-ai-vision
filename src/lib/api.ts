import { supabase } from "@/integrations/supabase/client";

export interface Match {
  id: string;
  team1: string;
  team2: string;
  event: string;
  time: string;
  format: string;
  rank1: number;
  rank2: number;
}

export interface VetoStep {
  action: "ban" | "pick" | "decider";
  team: string;
  map: string;
}

export interface AnalysisSection {
  title: string;
  emoji: string;
  content: string;
}

export interface PlayerStat {
  name: string;
  team: string;
  rating: string;
  kpr: string;
  dpr: string;
  impact: string;
}

export interface MatchAnalysis {
  prediction: {
    recommendedBet: string;
    confidence: number;
    winProbability: { team1: number; team2: number };
  };
  veto: VetoStep[];
  analysis: {
    summary: string;
    sections: AnalysisSection[];
  };
  odds: {
    team1: Record<string, string>;
    team2: Record<string, string>;
  };
  playerStats: PlayerStat[];
}

export async function fetchMatches(): Promise<Match[]> {
  const { data, error } = await supabase.functions.invoke("fetch-matches");
  if (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
  return data?.matches || [];
}

export async function fetchAIAnalysis(
  team1: string,
  team2: string,
  event?: string,
  format?: string
): Promise<MatchAnalysis> {
  const { data, error } = await supabase.functions.invoke("ai-analysis", {
    body: { team1, team2, event, format },
  });
  if (error) {
    console.error("Error fetching AI analysis:", error);
    throw error;
  }
  if (data?.error) {
    throw new Error(data.error);
  }
  return data;
}
