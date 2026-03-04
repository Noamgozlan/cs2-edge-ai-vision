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
  score1?: number | null;
  score2?: number | null;
  status?: string;
  team1Badge?: string | null;
  team2Badge?: string | null;
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

export interface AlternativeBet {
  bet: string;
  betType: string;
  confidence: number;
  reasoning: string;
}

export interface MapBreakdownData {
  map: string;
  team1WinRate: number;
  team2WinRate: number;
  team1CtWinPct: number;
  team1TWinPct: number;
  team2CtWinPct: number;
  team2TWinPct: number;
  team1PistolWinPct: number;
  team2PistolWinPct: number;
  totalRoundsAvg: number;
  edge: string;
}

export interface PlayerFormData {
  name: string;
  team: string;
  recentRatings: number[];
  trend: "stable" | "rising" | "declining";
  avgKills: number;
  clutchRate: string;
  openingDuelWinRate: string;
}

export interface MatchAnalysis {
  prediction: {
    recommendedBet: string;
    betType?: string;
    confidence: number;
    winProbability: { team1: number; team2: number };
    expectedValue?: string;
  };
  alternativeBets?: AlternativeBet[];
  veto: VetoStep[];
  mapBreakdown?: MapBreakdownData[];
  playerForm?: PlayerFormData[];
  analysis: {
    summary: string;
    sections: AnalysisSection[];
  };
  odds: {
    team1: Record<string, string>;
    team2: Record<string, string>;
  };
  playerStats: PlayerStat[];
  dataSource?: "live" | "training";
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
  format?: string,
  language?: string
): Promise<MatchAnalysis> {
  const { data, error } = await supabase.functions.invoke("ai-analysis", {
    body: { team1, team2, event, format, language: language || "en" },
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
