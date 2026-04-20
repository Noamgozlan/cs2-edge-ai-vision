import { motion } from "framer-motion";
import {
  Calendar, Sparkles, TrendingUp, Loader2, Zap, ArrowUpRight,
  Target, Shield, DollarSign, BarChart3, ChevronRight, Trophy,
  Flame, ArrowRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTimezone } from "@/contexts/TimezoneContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMatches, fetchAIAnalysis, Match } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useMemo, useEffect, useRef } from "react";
import { TeamLogo } from "@/lib/team-logos";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const fade = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

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

function useDemoBetStats() {
  return useQuery({
    queryKey: ["demo-bet-stats"],
    queryFn: async () => {
      const { data } = await supabase.from("demo_bets").select("*").order("created_at", { ascending: true });
      const bets = data || [];
      const settled = bets.filter((b: any) => b.result !== "pending");
      const won = settled.filter((b: any) => b.result === "won");
      const totalStaked = settled.reduce((s: number, b: any) => s + Number(b.stake), 0);
      const totalPayout = settled.reduce((s: number, b: any) => s + Number(b.payout), 0);
      const profit = totalPayout - totalStaked;
      const roi = totalStaked > 0 ? (profit / totalStaked) * 100 : 0;
      let balance = 10000;
      const chartData = [{ name: "Start", balance }];
      settled.forEach((b: any, i: number) => {
        if (b.result === "won") balance += Number(b.payout) - Number(b.stake);
        else balance -= Number(b.stake);
        chartData.push({ name: `${i + 1}`, balance: +balance.toFixed(2) });
      });
      return { total: bets.length, won: won.length, lost: settled.length - won.length, pending: bets.length - settled.length, profit, roi, winRate: settled.length > 0 ? (won.length / settled.length) * 100 : 0, chartData };
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

  useEffect(() => {
    if (!matchesLoading && matches && matches.length === 0 && !hasTriggeredScan.current) {
      hasTriggeredScan.current = true;
      supabase.functions.invoke("ai-discover-matches").then(() => {
        queryClient.invalidateQueries({ queryKey: ["matches"] });
      }).catch(console.error);
    }
  }, [matches, matchesLoading, queryClient]);

  const { data: predictions, isLoading: predictionsLoading } = useTopPredictions(matches, 4);
  const { data: betStats } = useDemoBetStats();

  const matchCount = matches?.length ?? 0;
  const analysedPredictions = predictions?.filter(p => p.analysis) ?? [];
  const avgConfidence = analysedPredictions.length
    ? (analysedPredictions.reduce((s, p) => s + (p.analysis?.prediction?.confidence ?? 0), 0) / analysedPredictions.length).toFixed(1)
    : "—";
  const bestPick = predictions?.filter(p => p.analysis)?.sort((a, b) => (b.analysis?.prediction?.confidence ?? 0) - (a.analysis?.prediction?.confidence ?? 0))[0];
  const featured = matches?.[0];
  const featuredPred = predictions?.find(p => p.match.id === featured?.id);

  return (
    <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">

      {/* Page header */}
      <motion.div variants={fade} className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("dash.liveData")}</p>
        </div>
        <Link
          to="/dashboard/demo-betting"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <DollarSign className="w-3.5 h-3.5" />
          {t("dash.demoBetting")}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </motion.div>

      {/* Stats strip */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3" variants={stagger}>
        {matchesLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="surface-raised rounded-lg p-4 space-y-2.5">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))
        ) : (
          <>
            <StatCard label={t("dash.todayMatches")} value={String(matchCount)} icon={<Calendar className="w-3.5 h-3.5" />} />
            <StatCard label={t("dash.activePredictions")} value={String(analysedPredictions.length)} icon={<Sparkles className="w-3.5 h-3.5" />} />
            <StatCard label="Avg Confidence" value={`${avgConfidence}%`} icon={<TrendingUp className="w-3.5 h-3.5" />} />
            <StatCard label={t("dash.bestValue")} value={bestPick?.analysis ? `${bestPick.analysis.prediction.confidence}%` : "—"} icon={<Target className="w-3.5 h-3.5" />} accent />
          </>
        )}
      </motion.div>

      {/* Featured match */}
      {featured && (
        <motion.div variants={fade}>
          <Link to={`/dashboard/match/${featured.id}?team1=${encodeURIComponent(featured.team1)}&team2=${encodeURIComponent(featured.team2)}&event=${encodeURIComponent(featured.event)}&format=${encodeURIComponent(featured.format)}&time=${encodeURIComponent(featured.time)}&rank1=${featured.rank1}&rank2=${featured.rank2}`}>
            <div className="surface-raised rounded-lg overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/60 bg-muted/30">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Featured Match</span>
                <span className="ml-auto text-xs font-medium text-muted-foreground">{featured.event}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                <div className="flex items-center gap-4 sm:gap-8 flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <TeamLogo name={featured.team1} size={40} badgeUrl={featured.team1Badge} />
                    <span className="text-sm font-semibold text-center">{featured.team1}</span>
                    {featured.rank1 > 0 && <span className="text-[10px] font-medium text-muted-foreground">#{featured.rank1}</span>}
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs font-semibold text-muted-foreground/50 tracking-widest">VS</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{featured.format}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <TeamLogo name={featured.team2} size={40} badgeUrl={featured.team2Badge} />
                    <span className="text-sm font-semibold text-center">{featured.team2}</span>
                    {featured.rank2 > 0 && <span className="text-[10px] font-medium text-muted-foreground">#{featured.rank2}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  {featuredPred?.analysis ? (
                    <>
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-muted-foreground mb-0.5">{featured.team1}</p>
                        <p className="text-xl font-bold text-primary font-mono-data">{featuredPred.analysis.prediction.winProbability.team1}%</p>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <p className="text-[10px] font-medium text-muted-foreground mb-0.5">{featured.team2}</p>
                        <p className="text-xl font-bold font-mono-data">{featuredPred.analysis.prediction.winProbability.team2}%</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-primary/8 text-primary text-xs font-semibold">
                        <Zap className="w-3 h-3" />{featuredPred.analysis.prediction.confidence}%
                      </div>
                    </>
                  ) : predictionsLoading ? (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />Analyzing…
                    </div>
                  ) : null}
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-foreground">{convertTime(featured.time)}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-0.5 justify-end mt-1 group-hover:text-primary transition-colors">
                    View analysis <ChevronRight className="w-3 h-3" />
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main col */}
        <motion.div className="xl:col-span-2 space-y-4" variants={fade}>
          {/* Upcoming matches */}
          <section className="surface-raised rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
              <h2 className="text-sm font-semibold">{t("dash.upcomingMatches")}</h2>
              <Link to="/dashboard/matches" className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors">
                {t("dash.viewAll")} <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border/60">
              {matchesLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="w-6 h-6 rounded" />
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-6 mx-1" />
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="w-6 h-6 rounded ml-1" />
                    <div className="ml-auto flex gap-2">
                      <Skeleton className="h-3.5 w-10 rounded" />
                      <Skeleton className="h-3.5 w-14" />
                    </div>
                  </div>
                ))
                : matches?.slice(1, 7).map((m) => (
                  <Link
                    key={m.id}
                    to={`/dashboard/match/${m.id}?team1=${encodeURIComponent(m.team1)}&team2=${encodeURIComponent(m.team2)}&event=${encodeURIComponent(m.event)}&format=${encodeURIComponent(m.format)}&time=${encodeURIComponent(m.time)}&rank1=${m.rank1}&rank2=${m.rank2}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors group"
                  >
                    <TeamLogo name={m.team1} size={20} badgeUrl={m.team1Badge} />
                    <span className="font-medium text-sm truncate flex-1 min-w-0">{m.team1}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground/50">vs</span>
                    <span className="font-medium text-sm truncate flex-1 min-w-0 text-right">{m.team2}</span>
                    <TeamLogo name={m.team2} size={20} badgeUrl={m.team2Badge} />
                    <div className="hidden sm:flex items-center gap-2 ml-2 flex-shrink-0">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{m.format}</span>
                      <span className="text-xs font-semibold text-primary font-mono-data">{convertTime(m.time)}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </Link>
                ))
              }
            </div>
          </section>

          {/* AI Predictions */}
          <section className="surface-raised rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <h2 className="text-sm font-semibold">{t("dash.aiPredictions")}</h2>
              </div>
              <Link to="/dashboard/predictions" className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors">
                {t("dash.allPredictions")} <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border/60">
              {predictionsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3">
                    <Skeleton className="h-3.5 w-36" />
                    <div className="ml-auto flex items-center gap-3">
                      <Skeleton className="h-5 w-10" />
                      <Skeleton className="h-1.5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-10" />
                      <Skeleton className="h-5 w-14 rounded" />
                    </div>
                  </div>
                ))
                : predictions?.map((p) => {
                  if (!p.analysis) return null;
                  const prob = p.analysis.prediction.winProbability;
                  const conf = p.analysis.prediction.confidence;
                  const isHigh = conf >= 70;
                  return (
                    <div key={p.match.id} className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.match.team1} vs {p.match.team2}</p>
                        <p className="text-[11px] text-muted-foreground">{p.match.event} · {convertTime(p.match.time)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">{p.match.team1}</p>
                          <p className="text-sm font-bold text-primary font-mono-data">{prob.team1}%</p>
                        </div>
                        <div className="w-14 h-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${prob.team1}%` }} />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">{p.match.team2}</p>
                          <p className="text-sm font-bold font-mono-data">{prob.team2}%</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${isHigh ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                          {conf}%
                        </span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </section>
        </motion.div>

        {/* Sidebar widgets */}
        <motion.div className="space-y-4" variants={fade}>
          {/* Demo bets */}
          {betStats && betStats.total > 0 && (
            <Link to="/dashboard/demo-betting">
              <div className="surface-raised rounded-lg p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">{t("dash.demoBettingWidget")}</h2>
                  </div>
                  <span className={`text-xs font-semibold font-mono-data ${betStats.profit >= 0 ? "text-accent" : "text-destructive"}`}>
                    {betStats.profit >= 0 ? "+" : ""}${betStats.profit.toFixed(2)}
                  </span>
                </div>
                {betStats.chartData.length > 1 && (
                  <div className="h-12 -mx-1 mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={betStats.chartData}>
                        <defs>
                          <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={betStats.profit >= 0 ? "hsl(152 55% 44%)" : "hsl(4 72% 57%)"} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={betStats.profit >= 0 ? "hsl(152 55% 44%)" : "hsl(4 72% 57%)"} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="balance" stroke={betStats.profit >= 0 ? "hsl(152 55% 44%)" : "hsl(4 72% 57%)"} strokeWidth={1.5} fill="url(#miniGrad)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{betStats.won}W · {betStats.lost}L · {betStats.pending}P</span>
                  <span>ROI: <strong className={betStats.roi >= 0 ? "text-accent" : "text-destructive"}>{betStats.roi >= 0 ? "+" : ""}{betStats.roi.toFixed(1)}%</strong></span>
                </div>
              </div>
            </Link>
          )}

          {/* Best value pick */}
          <div className="surface-raised rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-3.5 h-3.5 text-primary" />
              <h2 className="text-sm font-semibold">{t("dash.bestValuePick")}</h2>
            </div>
            {predictionsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-14 w-full rounded-md" />
              </div>
            ) : bestPick?.analysis ? (
              <div className="space-y-3">
                <div className="p-3 rounded-md bg-primary/5 border border-primary/15">
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">
                    {bestPick.analysis.prediction.confidence}% confidence
                  </p>
                  <p className="text-sm font-semibold mb-1">{bestPick.analysis.prediction.recommendedBet}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {bestPick.analysis.analysis.summary}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{t("dash.compareOdds")}</p>
                  {Object.entries(bestPick.analysis.odds?.team1 || {}).slice(0, 3).map(([bk, odd]) => (
                    <div key={bk} className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground capitalize">{bk}</span>
                      <span className="font-semibold font-mono-data">{odd}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-3">{t("dash.noPredictions")}</p>
            )}
          </div>

          {/* Top players */}
          <div className="surface-raised rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <h2 className="text-sm font-semibold">{t("dash.topPlayers")}</h2>
            </div>
            {predictionsLoading ? (
              <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <div className="flex-1 space-y-1"><Skeleton className="h-3 w-20" /><Skeleton className="h-2.5 w-14" /></div>
                    <Skeleton className="h-3.5 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {predictions?.flatMap(p => p.analysis?.playerStats || [])
                  .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
                  .slice(0, 5)
                  .map((player, i) => (
                    <div key={player.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${i === 0 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-[12px] font-medium">{player.name}</p>
                          <p className="text-[10px] text-muted-foreground">{player.team}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold font-mono-data ${parseFloat(player.rating) >= 1.2 ? "text-accent" : "text-foreground"}`}>
                        {player.rating}
                      </span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { to: "/dashboard/matches", icon: Zap, label: t("dash.liveMatches") },
              { to: "/dashboard/odds", icon: BarChart3, label: t("dash.compareOdds") },
              { to: "/dashboard/demo-betting?tab=simulation", icon: Trophy, label: t("dash.simulation") },
              { to: "/dashboard/predictions", icon: Sparkles, label: t("dash.predictions") },
            ].map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}>
                <div className="p-3 rounded-md bg-muted/40 border border-border/60 hover:bg-muted/70 hover:border-border transition-all text-center pressable">
                  <Icon className="w-3.5 h-3.5 mx-auto mb-1.5 text-muted-foreground" />
                  <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

function StatCard({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <motion.div variants={fade} className={`surface-raised rounded-lg p-4 ${accent ? "border-primary/25 bg-primary/3" : ""}`}>
      <div className={`w-7 h-7 rounded-md flex items-center justify-center mb-2.5 ${accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <p className="text-[11px] text-muted-foreground font-medium mb-0.5">{label}</p>
      <p className="text-2xl font-bold tracking-tight font-mono-data">{value}</p>
    </motion.div>
  );
}

export default Dashboard;
