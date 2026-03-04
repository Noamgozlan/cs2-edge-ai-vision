import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Sparkles, TrendingUp, CheckCircle, Flame, Loader2, Zap, ArrowUpRight, ArrowDownRight, Target, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches, fetchAIAnalysis, Match } from "@/lib/api";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};
const cardHover = {
  rest: { scale: 1, boxShadow: "0 0 0 0 hsl(199 90% 55% / 0)" },
  hover: { scale: 1.02, boxShadow: "0 0 20px 0 hsl(199 90% 55% / 0.15)", transition: { type: "spring" as const, stiffness: 400 } },
};

/* ── Fetch AI analysis for first N matches ── */
function useTopPredictions(matches: Match[] | undefined, count = 3) {
  const top = useMemo(() => matches?.slice(0, count) || [], [matches, count]);

  const results = useQuery({
    queryKey: ["dashboard-predictions", top.map(m => m.id).join(",")],
    queryFn: async () => {
      const analyses = await Promise.allSettled(
        top.map(m => fetchAIAnalysis(m.team1, m.team2, m.event, m.format))
      );
      return top.map((m, i) => {
        const r = analyses[i];
        return {
          match: m,
          analysis: r.status === "fulfilled" ? r.value : null,
        };
      });
    },
    enabled: top.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  return results;
}

const Dashboard = () => {
  const { t } = useLanguage();

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000,
  });

  const { data: predictions, isLoading: predictionsLoading } = useTopPredictions(matches, 4);

  const matchCount = matches?.length ?? 0;
  const predCount = predictions?.filter(p => p.analysis)?.length ?? 0;
  const analysedPredictions = predictions?.filter(p => p.analysis) ?? [];
  const avgConfidence = analysedPredictions.length
    ? (analysedPredictions.reduce((s, p) => s + (p.analysis?.prediction?.confidence ?? 0), 0) / analysedPredictions.length).toFixed(1)
    : "—";

  const bestPick = predictions
    ?.filter(p => p.analysis)
    ?.sort((a, b) => (b.analysis?.prediction?.confidence ?? 0) - (a.analysis?.prediction?.confidence ?? 0))[0];

  const stats = [
    { label: t("dash.todayMatches"), value: matchesLoading ? "…" : String(matchCount), icon: Calendar, accent: false },
    { label: t("dash.activePredictions"), value: predictionsLoading ? "…" : String(predCount), icon: Sparkles, accent: false },
    { label: t("dash.winRate"), value: predictionsLoading ? "…" : `${avgConfidence}%`, icon: TrendingUp, accent: false },
    { label: t("dash.bestValue"), value: bestPick?.analysis ? `${bestPick.analysis.prediction.confidence}%` : "—", icon: Target, accent: true },
  ];

  return (
    <motion.div className="space-y-8" variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-black tracking-tight mb-1">
          Welcome back, <span className="text-gradient">Analyst</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Live CS2 match data & AI predictions — powered by real-time HLTV intel.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" variants={container}>
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <motion.div
              variants={cardHover}
              className={`relative overflow-hidden p-5 rounded-2xl border transition-colors ${
                s.accent
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              {s.accent && (
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
              )}
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className={`p-2 rounded-xl ${s.accent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-muted-foreground text-xs font-medium mb-0.5 relative z-10">{s.label}</p>
              <h3 className="text-2xl font-black relative z-10">{s.value}</h3>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main: Upcoming Matches with AI data */}
        <motion.div className="xl:col-span-2 space-y-6" variants={item}>

          {/* Live Matches */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h2 className="text-base font-bold">Upcoming Matches</h2>
              </div>
              <Link to="/dashboard/matches" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {matchesLoading && (
              <div className="p-12 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            <AnimatePresence>
              <div className="divide-y divide-border">
                {matches?.slice(0, 5).map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={`/dashboard/match/${m.id}?team1=${encodeURIComponent(m.team1)}&team2=${encodeURIComponent(m.team2)}&event=${encodeURIComponent(m.event)}&format=${encodeURIComponent(m.format)}&time=${encodeURIComponent(m.time)}&rank1=${m.rank1}&rank2=${m.rank2}`}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3 w-56">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground">
                            #{m.rank1}
                          </div>
                          <span className="font-semibold text-sm truncate">{m.team1}</span>
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground tracking-widest">VS</span>
                        <div className="flex items-center gap-3 w-56">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground">
                            #{m.rank2}
                          </div>
                          <span className="font-semibold text-sm truncate">{m.team2}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] px-2 py-1 rounded-md bg-muted font-bold text-muted-foreground">{m.format}</span>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{m.event}</p>
                          <p className="text-xs font-bold text-primary">{m.time}</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </section>

          {/* AI Predictions */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-base font-bold">AI Match Predictions</h2>
              </div>
              <Link to="/dashboard/predictions" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                All Predictions <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {predictionsLoading && (
              <div className="p-12 flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">AI is analyzing matches…</span>
              </div>
            )}

            <div className="divide-y divide-border">
              {predictions?.map((p, i) => {
                if (!p.analysis) return null;
                const prob = p.analysis?.prediction?.winProbability ?? { team1: 50, team2: 50 };
                const conf = p.analysis?.prediction?.confidence ?? 0;
                const isHighConf = conf >= 70;
                return (
                  <motion.div
                    key={p.match.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-bold">{p.match.team1} vs {p.match.team2}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{p.match.event} · {p.match.time}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        {/* Win probabilities */}
                        <div className="hidden md:flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">{p.match.team1}</p>
                            <p className="text-lg font-black text-primary">{prob.team1}%</p>
                          </div>
                          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden flex">
                            <motion.div
                              className="h-full bg-primary rounded-l-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${prob.team1}%` }}
                              transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                            />
                            <motion.div
                              className="h-full bg-destructive/60 rounded-r-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${prob.team2}%` }}
                              transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">{p.match.team2}</p>
                            <p className="text-lg font-black">{prob.team2}%</p>
                          </div>
                        </div>
                        {/* Confidence badge */}
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                          isHighConf
                            ? "bg-accent/10 text-accent border-accent/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}>
                          {isHighConf ? "🔥 High" : "— Neutral"} {conf}%
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </motion.div>

        {/* Sidebar Widgets */}
        <motion.div className="space-y-6" variants={item}>
          {/* Best Value Pick */}
          <motion.section
            className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-6"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-accent/10 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold">Best Value Pick</h2>
              </div>

              {predictionsLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}

              {bestPick?.analysis && (
                <div className="space-y-4">
                  <div className="rounded-xl p-4 bg-primary/10 border border-primary/20">
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">
                      🎯 {bestPick.analysis.prediction.confidence}% Confidence
                    </p>
                    <p className="text-sm font-bold mb-2">
                      {bestPick.analysis.prediction.recommendedBet}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {bestPick.analysis.analysis.summary}
                    </p>
                  </div>

                  {/* Quick odds */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Bookmaker Odds</p>
                    {Object.entries(bestPick?.analysis?.odds?.team1 || {}).slice(0, 3).map(([bk, odd]) => (
                      <div key={bk} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground capitalize">{bk}</span>
                        <span className="font-bold">{odd}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!predictionsLoading && !bestPick?.analysis && (
                <p className="text-xs text-muted-foreground py-4">No predictions available yet.</p>
              )}
            </div>
          </motion.section>

          {/* Top Players */}
          <motion.section
            className="bg-card border border-border rounded-2xl p-6"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold">Top Rated Players</h2>
            </div>

            {predictionsLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}

            <div className="space-y-3">
              {predictions
                ?.flatMap(p => p.analysis?.playerStats || [])
                .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
                .slice(0, 5)
                .map((player, i) => (
                  <motion.div
                    key={player.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
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
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-black ${parseFloat(player.rating) >= 1.2 ? "text-accent" : ""}`}>
                        {player.rating}
                      </span>
                      <TrendingUp className={`w-3 h-3 ${parseFloat(player.rating) >= 1.2 ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.section>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/dashboard/matches">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors text-center"
              >
                <Zap className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-[10px] font-bold">Live Matches</p>
              </motion.div>
            </Link>
            <Link to="/dashboard/odds">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors text-center"
              >
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-accent" />
                <p className="text-[10px] font-bold">Compare Odds</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
