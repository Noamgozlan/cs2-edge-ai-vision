import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches, fetchAIAnalysis, Match } from "@/lib/api";
import { Loader2, TrendingUp, TrendingDown, Minus, Video, Zap, ExternalLink, PiggyBank } from "lucide-react";
import { useState, useMemo } from "react";
import { TeamLogo } from "@/lib/team-logos";

const BOOKMAKERS = ["hltv", "bet365", "ggbet", "pinnacle"] as const;
const BOOKMAKER_LABELS: Record<string, string> = {
  hltv: "HLTV Global Odds",
  bet365: "Bet365",
  ggbet: "GG.BET",
  pinnacle: "Pinnacle",
};

const TABS = ["Match Odds", "Map 1 (Ancient)", "Map 2 (Anubis)", "Handicaps", "Rounds Over/Under"] as const;

interface MatchOdds {
  match: Match;
  odds: { team1: Record<string, string>; team2: Record<string, string> } | null;
  prediction?: { winner: string; confidence: number } | null;
  loading: boolean;
  error: boolean;
}

function computePayout(o1: string, o2: string): string {
  const a = parseFloat(o1), b = parseFloat(o2);
  if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) return "—";
  return ((1 / a + 1 / b) * 100).toFixed(1) + "%";
}

function payoutTrend(o1: string, o2: string): "up" | "down" | "flat" {
  const pct = parseFloat(computePayout(o1, o2));
  if (isNaN(pct)) return "flat";
  if (pct >= 96) return "up";
  if (pct < 94) return "down";
  return "flat";
}

const MatchOddsCard = ({ match, odds, prediction, loading, error }: MatchOdds) => {
  const [activeTab, setActiveTab] = useState(0);

  const bestOdd = (side: "team1" | "team2") => {
    if (!odds?.[side]) return "0";
    const values = Object.values(odds[side]).map(Number).filter(n => !isNaN(n));
    return values.length ? Math.max(...values).toFixed(2) : "0";
  };

  const getOdd = (side: "team1" | "team2", bk: string) => odds?.[side]?.[bk] || "—";

  // Compute edge: AI confidence vs implied probability from best odds
  const edgeInfo = useMemo(() => {
    if (!prediction || !odds) return null;
    const best1 = parseFloat(bestOdd("team1"));
    const best2 = parseFloat(bestOdd("team2"));
    if (!best1 || !best2) return null;

    const isTeam1 = prediction.winner === match.team1;
    const impliedProb = isTeam1 ? (1 / best1) * 100 : (1 / best2) * 100;
    const edge = prediction.confidence - impliedProb;

    if (edge <= 0) return null;

    const bestBk = isTeam1
      ? Object.entries(odds.team1).reduce((best, [k, v]) => parseFloat(v) > parseFloat(best[1]) ? [k, v] : best, ["", "0"])
      : Object.entries(odds.team2).reduce((best, [k, v]) => parseFloat(v) > parseFloat(best[1]) ? [k, v] : best, ["", "0"]);

    return {
      edge: edge.toFixed(1),
      team: prediction.winner,
      bookmaker: BOOKMAKER_LABELS[bestBk[0]] || bestBk[0],
    };
  }, [prediction, odds, match]);

  // Market sentiment: which team bookmakers favor
  const sentiment = useMemo(() => {
    if (!odds) return null;
    const avg1 = Object.values(odds.team1).map(Number).filter(n => !isNaN(n));
    const avg2 = Object.values(odds.team2).map(Number).filter(n => !isNaN(n));
    if (!avg1.length || !avg2.length) return null;
    const mean1 = avg1.reduce((a, b) => a + b, 0) / avg1.length;
    const mean2 = avg2.reduce((a, b) => a + b, 0) / avg2.length;
    const fav = mean1 < mean2 ? match.team1 : match.team2;
    const favProb = (1 / Math.min(mean1, mean2)) * 100;
    return { team: fav, pct: Math.round(favProb) };
  }, [odds, match]);

  const team1Short = match.team1.length > 6 ? match.team1.substring(0, 3).toUpperCase() : match.team1.toUpperCase();
  const team2Short = match.team2.length > 6 ? match.team2.substring(0, 3).toUpperCase() : match.team2.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Match Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Live Now</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            {match.team1} <span className="text-muted-foreground font-medium text-2xl mx-2">vs</span> {match.team2}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <span>🏆</span>
            <span>{match.event} • {match.format}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-sm font-semibold transition-colors">
            <Video className="w-4 h-4" />
            Live Stream
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
            <Zap className="w-4 h-4" />
            Edge AI Prediction
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === i
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Odds Table */}
      {loading && !odds && (
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-3 text-sm text-muted-foreground">Fetching odds from bookmakers…</span>
        </div>
      )}

      {error && !odds && (
        <div className="p-12 text-center text-muted-foreground text-sm">Failed to load odds</div>
      )}

      {odds && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-5 text-xs font-bold text-muted-foreground uppercase tracking-widest w-48">
                    Bookmaker
                  </th>
                  <th className="text-center p-5 w-40">
                    <div className="flex items-center justify-center gap-2">
                      <TeamLogo name={match.team1} size={20} />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {match.team1} (Win)
                      </span>
                    </div>
                  </th>
                  <th className="text-center p-5 w-40">
                    <div className="flex items-center justify-center gap-2">
                      <TeamLogo name={match.team2} size={20} />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {match.team2} (Win)
                      </span>
                    </div>
                  </th>
                  <th className="text-center p-5 text-xs font-bold text-muted-foreground uppercase tracking-widest w-40">
                    Theoretical Payout
                  </th>
                  <th className="text-center p-5 text-xs font-bold text-muted-foreground uppercase tracking-widest w-32">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {BOOKMAKERS.map((bk, i) => {
                  const o1 = getOdd("team1", bk);
                  const o2 = getOdd("team2", bk);
                  const isBest1 = o1 === bestOdd("team1") && o1 !== "—";
                  const isBest2 = o2 === bestOdd("team2") && o2 !== "—";
                  const payout = computePayout(o1, o2);
                  const trend = payoutTrend(o1, o2);
                  const isReference = bk === "hltv";

                  return (
                    <motion.tr
                      key={bk}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          {!isReference && <span className="w-2 h-2 rounded-full bg-accent" />}
                          <span className="font-bold text-sm">{BOOKMAKER_LABELS[bk]}</span>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="relative inline-block">
                          <div className={`inline-flex items-center justify-center min-w-[80px] px-4 py-2.5 rounded-lg font-mono font-bold text-base transition-all ${
                            isBest1
                              ? "bg-primary/15 text-primary border-2 border-primary/40 shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                              : "bg-muted/50 border border-border text-foreground"
                          }`}>
                            {o1}
                          </div>
                          {isBest1 && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-black bg-primary text-primary-foreground uppercase tracking-wider">
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="relative inline-block">
                          <div className={`inline-flex items-center justify-center min-w-[80px] px-4 py-2.5 rounded-lg font-mono font-bold text-base transition-all ${
                            isBest2
                              ? "bg-primary/15 text-primary border-2 border-primary/40 shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                              : "bg-muted/50 border border-border text-foreground"
                          }`}>
                            {o2}
                          </div>
                          {isBest2 && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-black bg-primary text-primary-foreground uppercase tracking-wider">
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-sm">
                          <span className="font-semibold">{payout}</span>
                          {trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-accent" />}
                          {trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
                          {trend === "flat" && <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        {isReference ? (
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reference</span>
                        ) : (
                          <button className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-bold uppercase tracking-wider transition-colors hover:border-primary/30">
                            Bet Now
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Cards */}
      {odds && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AI Prediction */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Edge AI Prediction</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-black">
                {prediction ? `${prediction.winner} Win` : `${match.team1} Win`}
              </span>
              <span className="text-sm font-bold text-primary">
                {prediction ? `${prediction.confidence}%` : "—"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: prediction ? `${prediction.confidence}%` : "50%" }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Market Sentiment */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Market Sentiment</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-black">
                {sentiment ? `${sentiment.team} Fav.` : "—"}
              </span>
              <span className="text-sm font-bold text-muted-foreground">
                {sentiment ? `${sentiment.pct}%` : ""}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-muted-foreground/40 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: sentiment ? `${sentiment.pct}%` : "50%" }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Value Found */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-2xl p-5 ${
              edgeInfo
                ? "bg-accent/10 border-2 border-accent/30"
                : "bg-card border border-border"
            }`}
          >
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              {edgeInfo ? "Value Found" : "No Edge"}
            </p>
            {edgeInfo ? (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <PiggyBank className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-black text-accent">{edgeInfo.edge}% Edge</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {edgeInfo.team} odds on {edgeInfo.bookmaker} are undervalued by AI.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No significant edge detected for this match.</p>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const OddsComparison = () => {
  const { t } = useLanguage();
  const [selectedMatch, setSelectedMatch] = useState<number>(0);

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000,
  });

  if (matchesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!matches?.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">No matches available</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Match Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {matches.slice(0, 8).map((m, i) => (
          <button
            key={m.id}
            onClick={() => setSelectedMatch(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all ${
              selectedMatch === i
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
            }`}
          >
            <TeamLogo name={m.team1} size={16} />
            <span>{m.team1}</span>
            <span className="text-muted-foreground text-xs">vs</span>
            <TeamLogo name={m.team2} size={16} />
            <span>{m.team2}</span>
          </button>
        ))}
      </div>

      {/* Selected Match Odds */}
      <MatchOddsRow match={matches[selectedMatch]} />
    </div>
  );
};

const MatchOddsRow = ({ match }: { match: Match }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["odds", match.team1, match.team2],
    queryFn: async () => {
      const analysis = await fetchAIAnalysis(match.team1, match.team2, match.event, match.format);
      const pred = analysis.prediction;
      const winner = pred.winProbability.team1 >= pred.winProbability.team2 ? match.team1 : match.team2;
      return {
        odds: analysis.odds,
        prediction: { winner, confidence: pred.confidence },
      };
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <MatchOddsCard
      match={match}
      odds={data?.odds || null}
      prediction={data?.prediction || null}
      loading={isLoading}
      error={isError}
    />
  );
};

export default OddsComparison;
