import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches, fetchAIAnalysis, Match } from "@/lib/api";
import { Loader2, TrendingUp, RefreshCw } from "lucide-react";
import { useState } from "react";

const BOOKMAKERS = ["hltv", "bet365", "ggbet", "pinnacle"] as const;
const BOOKMAKER_LABELS: Record<string, string> = {
  hltv: "HLTV Odds",
  bet365: "Bet365",
  ggbet: "GGbet",
  pinnacle: "Pinnacle",
};

interface MatchOdds {
  match: Match;
  odds: { team1: Record<string, string>; team2: Record<string, string> } | null;
  loading: boolean;
  error: boolean;
}

const MatchOddsCard = ({ match, odds, loading, error }: MatchOdds) => {
  const { t } = useLanguage();

  const bestOdd = (side: "team1" | "team2") => {
    if (!odds) return "0";
    const values = Object.values(odds[side]).map(Number).filter(n => !isNaN(n));
    return values.length ? Math.max(...values).toFixed(2) : "0";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card border border-border overflow-hidden"
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{match.team1} vs {match.team2}</h2>
          <p className="text-xs text-muted-foreground mt-1">{match.event} · {match.format} · {match.time}</p>
        </div>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {odds && (
          <div className="flex items-center gap-1 text-xs text-accent">
            <TrendingUp className="h-3 w-3" />
            Live
          </div>
        )}
      </div>

      {loading && !odds && (
        <div className="p-8 text-center text-muted-foreground text-sm">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
          Fetching odds...
        </div>
      )}

      {error && !odds && (
        <div className="p-8 text-center text-muted-foreground text-sm">
          Failed to load odds
        </div>
      )}

      {odds && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-muted-foreground font-medium">{t("odds.site")}</th>
                <th className="text-center p-4 text-muted-foreground font-medium">{match.team1}</th>
                <th className="text-center p-4 text-muted-foreground font-medium">{match.team2}</th>
              </tr>
            </thead>
            <tbody>
              {BOOKMAKERS.map((bk) => (
                <tr key={bk} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-medium">{BOOKMAKER_LABELS[bk]}</td>
                  <td className={`p-4 text-center font-bold ${odds.team1[bk] === bestOdd("team1") ? "text-accent" : ""}`}>
                    {odds.team1[bk] || "—"}
                  </td>
                  <td className={`p-4 text-center font-bold ${odds.team2[bk] === bestOdd("team2") ? "text-accent" : ""}`}>
                    {odds.team2[bk] || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

const OddsComparison = () => {
  const { t } = useLanguage();

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("odds.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("odds.subtitle")}</p>
      </div>

      {matchesLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {matches?.map((match) => (
        <MatchOddsRow key={match.id} match={match} />
      ))}
    </div>
  );
};

const MatchOddsRow = ({ match }: { match: Match }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["odds", match.team1, match.team2],
    queryFn: async () => {
      const analysis = await fetchAIAnalysis(match.team1, match.team2, match.event, match.format);
      return analysis.odds;
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <MatchOddsCard
      match={match}
      odds={data || null}
      loading={isLoading}
      error={isError}
    />
  );
};

export default OddsComparison;
