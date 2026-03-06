import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Sparkles, TrendingUp, Loader2, Zap, ArrowUpRight,
  Target, Shield, Flame, DollarSign, BarChart3, ChevronRight, Trophy
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTimezone } from "@/contexts/TimezoneContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMatches, fetchAIAnalysis, Match } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useMemo, useEffect, useRef } from "react";
import { TeamLogo } from "@/lib/team-logos";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

/* ── Animation Presets ── */
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

/* ── Skeleton ── */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

function MatchRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-7 h-7 rounded-lg" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-6" />
      <Skeleton className="w-7 h-7 rounded-lg" />
      <Skeleton className="h-4 w-28" />
      <div className="ml-auto flex items-center gap-3">
        <Skeleton className="h-4 w-12 rounded-md" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

/* ── Fetch AI analysis for first N matches ── */
function useTopPredictions(matches: Match[] | undefined, count = 4) {
  const top = useMemo(() => matches?.slice(0, count) || [], [matches, count]);
  return useQuery({
    queryKey: ["dashboard-predictions", top.map(m => m.id).join(",")],
    queryFn: async () => {
      const analyses = await Promise.allSettled(
        top.map(m => fetchAIAnalysis(m.team1, m.team2, m.event, m.format))
      );
      return top.map((m, i) => ({
        match: m,
        analysis: analyses[i].status === "fulfilled" ? analyses[i].value : null,
      }));
    },
    enabled: top.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}

/* ── Demo Bets Summary Hook ── */
function useDemoBetStats() {
  return useQuery({
    queryKey: ["demo-bet-stats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("demo_bets")
        .select("*")
        .order("created_at", { ascending: true });
      const bets = data || [];
      const settled = bets.filter((b: any) => b.result !== "pending");
      const won = settled.filter((b: any) => b.result === "won");
      const totalStaked = settled.reduce((s: number, b: any) => s + Number(b.stake), 0);
      const totalPayout = settled.reduce((s: number, b: any) => s + Number(b.payout), 0);
      const profit = totalPayout - totalStaked;
      const roi = totalStaked > 0 ? ((profit / totalStaked) * 100) : 0;

      // Build simple chart data
      let balance = 10000;
      const chartData = [{ name: "Start", balance }];
      settled.forEach((b: any, i: number) => {
        if (b.result === "won") balance += Number(b.payout) - Number(b.stake);
        else balance -= Number(b.stake);
        chartData.push({ name: `${i + 1}`, balance: +balance.toFixed(2) });
      });

      return {
        total: bets.length,
        won: won.length,
        lost: settled.length - won.length,
        pending: bets.length - settled.length,
        profit,
        roi,
        winRate: settled.length > 0 ? (won.length / settled.length) * 100 : 0,
        chartData,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

const Dashboard = () => {
  const { t } = useLanguage();
  const { convertTime } = useTimezone();
  const queryClient = useQueryClient();
  const hasTriggeredScan = useRef(false);

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000,
  });

  // Auto-trigger AI scan if no matches found
  useEffect(() => {
    if (!matchesLoading && matches && matches.length === 0 && !hasTriggeredScan.current) {
      hasTriggeredScan.current = true;
      console.log("[Dashboard] No matches found, triggering AI scan...");
      supabase.functions.invoke("ai-discover-matches").then(() => {
        // Refetch matches after scan completes
        queryClient.invalidateQueries({ queryKey: ["matches"] });
      }).catch(err => console.error("AI scan failed:", err));
    }
  }, [matches, matchesLoading, queryClient]);

  const { data: predictions, isLoading: predictionsLoading } = useTopPredictions(matches, 4);
  const { data: betStats } = useDemoBetStats();

  const matchCount = matches?.length ?? 0;
  const analysedPredictions = predictions?.filter(p => p.analysis) ?? [];
  const avgConfidence = analysedPredictions.length
    ? (analysedPredictions.reduce((s, p) => s + (p.analysis?.prediction?.confidence ?? 0), 0) / analysedPredictions.length).toFixed(1)
    : "—";

  const bestPick = predictions
    ?.filter(p => p.analysis)
    ?.sort((a, b) => (b.analysis?.prediction?.confidence ?? 0) - (a.analysis?.prediction?.confidence ?? 0))[0];

  // Featured match = first match
  const featured = matches?.[0];
  const featuredPred = predictions?.find(p => p.match.id === featured?.id);

  return (
    <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t("dash.welcomeBack")} <span className="text-gradient">{t("dash.commandCenter" as any)}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {t("dash.liveData")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/demo-betting"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
          >
            <DollarSign className="w-3 h-3" /> {t("dash.demoBetting")}
          </Link>
        </div>
      </motion.div>

      {/* Stats Strip */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3" variants={stagger}>
        {matchesLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatMini icon={<Calendar className="w-4 h-4" />} label={t("dash.todayMatches")} value={String(matchCount)} />
            <StatMini icon={<Sparkles className="w-4 h-4" />} label={t("dash.activePredictions")} value={String(analysedPredictions.length)} />
            <StatMini icon={<TrendingUp className="w-4 h-4" />} label={t("dash.winRate")} value={`${avgConfidence}%`} />
            <StatMini
              icon={<Target className="w-4 h-4" />}
              label={t("dash.bestValue")}
              value={bestPick?.analysis ? `${bestPick.analysis.prediction.confidence}%` : "—"}
              accent
            />
          </>
        )}
      </motion.div>

      {/* Featured Match Hero */}
      {featured && (
        <motion.div variants={fadeUp}>
          <Link
            to={`/dashboard/match/${featured.id}?team1=${encodeURIComponent(featured.team1)}&team2=${encodeURIComponent(featured.team2)}&event=${encodeURIComponent(featured.event)}&format=${encodeURIComponent(featured.format)}&time=${encodeURIComponent(featured.time)}&rank1=${featured.rank1}&rank2=${featured.rank2}`}
            className="block"
          >
            <div className="rounded-2xl border border-primary/20 overflow-hidden relative group"
              style={{
                background: "linear-gradient(135deg, hsl(199 90% 55% / 0.08) 0%, hsl(270 80% 60% / 0.05) 100%)",
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(135deg, hsl(199 90% 55% / 0.05) 0%, transparent 100%)" }}
              />
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                {/* Teams */}
                <div className="flex items-center gap-4 sm:gap-6 flex-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <TeamLogo name={featured.team1} size={48} />
                    <span className="text-sm font-black text-center">{featured.team1}</span>
                    {featured.rank1 > 0 && (
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">#{featured.rank1}</span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-muted-foreground tracking-widest">VS</span>
                    <span className="text-[9px] text-muted-foreground mt-0.5">{featured.format}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <TeamLogo name={featured.team2} size={48} />
                    <span className="text-sm font-black text-center">{featured.team2}</span>
                    {featured.rank2 > 0 && (
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">#{featured.rank2}</span>
                    )}
                  </div>
                </div>

                {/* AI Quick Prediction */}
                <div className="flex items-center gap-4 sm:gap-6">
                  {featuredPred?.analysis ? (
                    <>
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{featured.team1}</p>
                        <p className="text-2xl font-black text-primary">{featuredPred.analysis.prediction.winProbability.team1}%</p>
                      </div>
                      <div className="w-px h-10 bg-border" />
                      <div className="text-center">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{featured.team2}</p>
                        <p className="text-2xl font-black">{featuredPred.analysis.prediction.winProbability.team2}%</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 text-xs font-bold">
                        <Zap className="w-3 h-3" /> {featuredPred.analysis.prediction.confidence}%
                      </div>
                    </>
                  ) : predictionsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /> {t("dash.analyzing")}
                    </div>
                  ) : null}
                </div>

                {/* Meta */}
                <div className="text-center sm:text-right flex-shrink-0">
                  <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{featured.event}</p>
                  <p className="text-sm font-bold text-primary">{convertTime(featured.time)}</p>
                  <p className="text-[10px] font-bold text-primary flex items-center gap-1 justify-center sm:justify-end mt-1">
                    View Analysis <ChevronRight className="w-3 h-3" />
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main Column */}
        <motion.div className="xl:col-span-2 space-y-5" variants={fadeUp}>
          {/* Upcoming Matches */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h2 className="text-sm font-bold">Upcoming Matches</h2>
              </div>
              <Link to="/dashboard/matches" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {matchesLoading ? (
              <div className="divide-y divide-border">
                {[...Array(4)].map((_, i) => <MatchRowSkeleton key={i} />)}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {matches?.slice(1, 6).map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={`/dashboard/match/${m.id}?team1=${encodeURIComponent(m.team1)}&team2=${encodeURIComponent(m.team2)}&event=${encodeURIComponent(m.event)}&format=${encodeURIComponent(m.format)}&time=${encodeURIComponent(m.time)}&rank1=${m.rank1}&rank2=${m.rank2}`}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/30 transition-colors group"
                    >
                      <TeamLogo name={m.team1} size={24} />
                      <span className="font-semibold text-sm truncate flex-1 min-w-0">{m.team1}</span>
                      <span className="text-[9px] font-black text-muted-foreground">VS</span>
                      <span className="font-semibold text-sm truncate flex-1 min-w-0 text-right">{m.team2}</span>
                      <TeamLogo name={m.team2} size={24} />
                      <div className="hidden sm:flex items-center gap-2 ml-2">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted font-bold text-muted-foreground">{m.format}</span>
                        <span className="text-xs font-bold text-primary">{convertTime(m.time)}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* AI Predictions */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold">AI Match Predictions</h2>
              </div>
              <Link to="/dashboard/predictions" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                All Predictions <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {predictionsLoading ? (
              <div className="divide-y divide-border">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-40" />
                      <div className="ml-auto flex items-center gap-3">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-2 w-20 rounded-full" />
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-6 w-20 rounded-md" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {predictions?.map((p, i) => {
                  if (!p.analysis) return null;
                  const prob = p.analysis.prediction.winProbability;
                  const conf = p.analysis.prediction.confidence;
                  const isHigh = conf >= 70;
                  return (
                    <motion.div
                      key={p.match.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="p-3 sm:p-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{p.match.team1} vs {p.match.team2}</p>
                          <p className="text-[10px] text-muted-foreground">{p.match.event} · {convertTime(p.match.time)}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="text-center">
                            <p className="text-[8px] uppercase font-bold text-muted-foreground">{p.match.team1}</p>
                            <p className="text-base font-black text-primary">{prob.team1}%</p>
                          </div>
                          <div className="w-16 sm:w-20 h-1.5 rounded-full bg-muted overflow-hidden flex">
                            <motion.div
                              className="h-full bg-primary rounded-l-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${prob.team1}%` }}
                              transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-[8px] uppercase font-bold text-muted-foreground">{p.match.team2}</p>
                            <p className="text-base font-black">{prob.team2}%</p>
                          </div>
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                            isHigh ? "bg-accent/10 text-accent border-accent/20" : "bg-muted text-muted-foreground border-border"
                          }`}>
                            {isHigh ? "🔥" : "—"} {conf}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </motion.div>

        {/* Sidebar Widgets */}
        <motion.div className="space-y-5" variants={fadeUp}>
          {/* Demo Betting Widget */}
          {betStats && betStats.total > 0 && (
            <Link to="/dashboard/demo-betting" className="block">
              <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-bold">Demo Betting</h2>
                  </div>
                  <span className={`text-xs font-bold ${betStats.profit >= 0 ? "text-accent" : "text-destructive"}`}>
                    {betStats.profit >= 0 ? "+" : ""}${betStats.profit.toFixed(2)}
                  </span>
                </div>

                {/* Mini chart */}
                {betStats.chartData.length > 1 && (
                  <div className="h-16 -mx-2 mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={betStats.chartData}>
                        <defs>
                          <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={betStats.profit >= 0 ? "hsl(160, 60%, 45%)" : "hsl(0, 72%, 50%)"} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={betStats.profit >= 0 ? "hsl(160, 60%, 45%)" : "hsl(0, 72%, 50%)"} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="balance"
                          stroke={betStats.profit >= 0 ? "hsl(160, 60%, 45%)" : "hsl(0, 72%, 50%)"}
                          strokeWidth={2}
                          fill="url(#miniGrad)"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">
                    {betStats.won}W {betStats.lost}L {betStats.pending}P
                  </span>
                  <span className="text-muted-foreground">
                    ROI: <strong className={betStats.roi >= 0 ? "text-accent" : "text-destructive"}>
                      {betStats.roi >= 0 ? "+" : ""}{betStats.roi.toFixed(1)}%
                    </strong>
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Best Value Pick */}
          <div className="rounded-2xl border border-primary/30 bg-card p-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold">Best Value Pick</h2>
              </div>

              {predictionsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ) : bestPick?.analysis ? (
                <div className="space-y-3">
                  <div className="rounded-xl p-3 bg-primary/10 border border-primary/20">
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">
                      🎯 {bestPick.analysis.prediction.confidence}% Confidence
                    </p>
                    <p className="text-sm font-bold mb-1.5">{bestPick.analysis.prediction.recommendedBet}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3">
                      {bestPick.analysis.analysis.summary}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Quick Odds</p>
                    {Object.entries(bestPick.analysis.odds?.team1 || {}).slice(0, 3).map(([bk, odd]) => (
                      <div key={bk} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground capitalize">{bk}</span>
                        <span className="font-bold font-mono">{odd}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4">No predictions available yet.</p>
              )}
            </div>
          </div>

          {/* Top Players */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold">Top Rated Players</h2>
            </div>

            {predictionsLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-14" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {predictions
                  ?.flatMap(p => p.analysis?.playerStats || [])
                  .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
                  .slice(0, 5)
                  .map((player, i) => (
                    <motion.div
                      key={player.name}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                          i === 0 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold">{player.name}</p>
                          <p className="text-[9px] text-muted-foreground">{player.team}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-black font-mono ${parseFloat(player.rating) >= 1.2 ? "text-accent" : ""}`}>
                        {player.rating}
                      </span>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-2.5">
            <Link to="/dashboard/matches">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors text-center">
                <Zap className="w-4 h-4 mx-auto mb-1.5 text-primary" />
                <p className="text-[10px] font-bold">Live Matches</p>
              </motion.div>
            </Link>
            <Link to="/dashboard/odds">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors text-center">
                <BarChart3 className="w-4 h-4 mx-auto mb-1.5 text-accent" />
                <p className="text-[10px] font-bold">Compare Odds</p>
              </motion.div>
            </Link>
            <Link to="/dashboard/demo-betting?tab=simulation">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors text-center">
                <Trophy className="w-4 h-4 mx-auto mb-1.5 text-yellow-500" />
                <p className="text-[10px] font-bold">Simulation</p>
              </motion.div>
            </Link>
            <Link to="/dashboard/predictions">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors text-center">
                <Sparkles className="w-4 h-4 mx-auto mb-1.5 text-purple-400" />
                <p className="text-[10px] font-bold">Predictions</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ── Sub-components ── */

function StatMini({ icon, label, value, accent = false }: {
  icon: React.ReactNode; label: string; value: string; accent?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-2xl border transition-colors ${
        accent ? "bg-primary/5 border-primary/30" : "bg-card border-border hover:border-primary/20"
      }`}
    >
      <div className={`p-1.5 rounded-lg inline-flex mb-2 ${accent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </motion.div>
  );
}

export default Dashboard;
