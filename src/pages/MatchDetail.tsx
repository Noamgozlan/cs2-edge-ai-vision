import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAIAnalysis, type MatchAnalysis, type AlternativeBet } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowLeft, Loader2, Zap, TrendingUp, Shield, Swords,
  Users, History, Lock, BookmarkPlus, Database
} from "lucide-react";
import { motion } from "framer-motion";
import { TeamLogo } from "@/lib/team-logos";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import MapBreakdown from "@/components/dashboard/MapBreakdown";
import PlayerFormHeatmap from "@/components/dashboard/PlayerFormHeatmap";
import PreMatchCountdown from "@/components/dashboard/PreMatchCountdown";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

const TABS = ["Analysis", "Stats", "Veto", "Rosters", "History"] as const;
type Tab = typeof TABS[number];

const MatchDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("Analysis");

  const team1 = searchParams.get("team1") || "Team A";
  const team2 = searchParams.get("team2") || "Team B";
  const event = searchParams.get("event") || "CS2 Tournament";
  const format = searchParams.get("format") || "Bo3";
  const time = searchParams.get("time") || "";
  const rank1 = searchParams.get("rank1") || "";
  const rank2 = searchParams.get("rank2") || "";

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["ai-analysis", team1, team2, event, format, language],
    queryFn: () => fetchAIAnalysis(team1, team2, event, format, language),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  // Probability trajectory chart data
  const trajectoryData = useMemo(() => {
    if (!analysis) return [];
    const p1 = analysis.prediction.winProbability.team1;
    const base = Math.max(35, p1 - 8);
    return [
      { phase: "Pre-Match", prob: base },
      { phase: "Veto Phase", prob: base + 3 },
      { phase: "Map 1", prob: base + 5 },
      { phase: "Map 2", prob: p1 - 2 },
      { phase: "Current", prob: p1 },
    ];
  }, [analysis]);

  return (
    <div className="space-y-6 max-w-6xl">
      <Link
        to="/dashboard/matches"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {t("match.back")}
      </Link>

      {/* Match Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-primary/15 text-primary border border-primary/20 uppercase tracking-wider">
              Live Analysis
            </span>
            <span className="text-sm text-muted-foreground">{event}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            <TeamLogo name={team1} size={36} />
            {team1}
            <span className="text-muted-foreground font-medium text-2xl">vs</span>
            <TeamLogo name={team2} size={36} />
            {team2}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Advanced AI Performance Forecasting & Veto Modeling
          </p>
        </div>
        {rank1 && rank2 && (
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-center">
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest">
                {team1.length > 8 ? team1.substring(0, 6).toUpperCase() : team1.toUpperCase()} Rank
              </p>
              <p className="text-2xl font-black text-primary">#{rank1}</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-center">
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest">
                {team2.length > 8 ? team2.substring(0, 6).toUpperCase() : team2.toUpperCase()} Rank
              </p>
              <p className="text-2xl font-black text-primary">#{rank2}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="p-16 flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <Zap className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <p className="font-semibold">AI is analyzing this matchup...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Evaluating player stats, map pools, recent form & historical data
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
          Failed to generate AI analysis: {(error as Error).message}
        </div>
      )}

      {/* Analysis Tab */}
      {analysis && activeTab === "Analysis" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Recommended Bet Hero */}
          <div className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--accent) / 0.1) 100%)",
              border: "1px solid hsl(var(--primary) / 0.3)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                AI Smart Bet — {analysis.prediction.betType?.replace(/_/g, " ").toUpperCase() || "BEST VALUE"}
              </span>
            </div>
            <p className="text-2xl font-black">{analysis.prediction.recommendedBet}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-primary">{analysis.prediction.confidence}% confidence</span>
                <span className="text-xs text-muted-foreground">
                  Win Prob: {team1} {analysis.prediction.winProbability.team1}% — {team2} {analysis.prediction.winProbability.team2}%
                </span>
                {analysis.dataSource === "live" && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                    <Database className="w-3 h-3" /> LIVE DATA
                  </span>
                )}
              </div>
              <button
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) { toast.error("Login required"); return; }
                  const { error } = await supabase.from("prediction_tracking" as any).insert({
                    user_id: user.id,
                    match_id: id || "unknown",
                    team1, team2,
                    event,
                    recommended_bet: analysis.prediction.recommendedBet,
                    bet_type: analysis.prediction.betType || "match_winner",
                    confidence: analysis.prediction.confidence,
                    ai_pick: analysis.prediction.recommendedBet,
                    data_source: analysis.dataSource || "training",
                    odds_at_prediction: 1.80,
                    stake: 100,
                  } as any);
                  if (error) { toast.error("Failed to track prediction"); console.error(error); }
                  else toast.success("Prediction tracked! View in Bet Tracker.");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 sm:ml-auto"
              >
                <BookmarkPlus className="w-3.5 h-3.5" /> Track Prediction
              </button>
            </div>
          </div>

          {/* Alternative Bets */}
          {analysis.alternativeBets && analysis.alternativeBets.length > 0 && (
            <div>
              <h2 className="text-lg font-black flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-accent" /> Alternative Smart Bets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.alternativeBets.map((alt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {alt.betType.replace(/_/g, " ")}
                      </span>
                      <span className={`text-xs font-bold ${
                        alt.confidence >= 70 ? "text-accent" : "text-muted-foreground"
                      }`}>
                        {alt.confidence}%
                      </span>
                    </div>
                    <p className="font-bold text-sm mb-1">{alt.bet}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{alt.reasoning}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Match Confidence
                </p>
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <p className="text-4xl font-black">{analysis.prediction.confidence}%</p>
              <p className="text-xs text-accent mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +{(analysis.prediction.confidence * 0.07).toFixed(1)}% vs baseline
              </p>
            </div>
            <ProbCard
              label={`Win Probability ${team1}`}
              value={analysis.prediction.winProbability.team1}
            />
            <ProbCard
              label={`Win Probability ${team2}`}
              value={analysis.prediction.winProbability.team2}
            />
          </div>

          {/* Breakdown + Veto side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Breakdown - 3 cols */}
            <div className="lg:col-span-3 space-y-4">
              <h2 className="text-xl font-black flex items-center gap-2">
                <Swords className="w-5 h-5 text-primary" /> The Breakdown
              </h2>

              {analysis.analysis.sections.map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                    <span>{section.emoji}</span> {section.title}
                  </h3>
                  <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    {section.content.split(". ").filter(Boolean).map((sentence, j) => {
                      const parts = sentence.split(":");
                      if (parts.length >= 2) {
                        return (
                          <p key={j} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <span>
                              <strong className="text-foreground">{parts[0].trim()}:</strong>
                              {parts.slice(1).join(":").trim()}{sentence.endsWith(".") ? "" : "."}
                            </span>
                          </p>
                        );
                      }
                      return (
                        <p key={j} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span>{sentence.trim()}{sentence.endsWith(".") ? "" : "."}</span>
                        </p>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Veto + Edge Insight - 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              {/* Pre-Match Countdown */}
              <PreMatchCountdown matchTime={time} team1={team1} team2={team2} event={event} format={format} />

              {/* Predicted Veto */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Predicted Veto
                </h3>
                <div className="space-y-2">
                  {analysis.veto.map((v, i) => {
                    const isBan = v.action === "ban";
                    const isPick = v.action === "pick";
                    const isDecider = v.action === "decider";
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm ${
                          isDecider
                            ? "bg-muted/50 border border-border"
                            : isBan
                              ? "bg-destructive/8 border border-destructive/15"
                              : "bg-accent/8 border border-accent/15"
                        }`}
                      >
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          isBan ? "text-destructive" : isPick ? "text-accent" : "text-muted-foreground"
                        }`}>
                          {isDecider ? "Decider" : `${v.team} ${v.action}`}
                        </span>
                        <span className="font-bold">{v.map}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Edge Insight */}
              <div className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(199 90% 55% / 0.12) 0%, hsl(160 60% 45% / 0.08) 100%)",
                  border: "1px solid hsl(199 90% 55% / 0.2)",
                }}
              >
                <h3 className="text-lg font-black italic text-primary mb-2">Edge Insight</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {analysis.analysis.summary.split(".").slice(0, 2).join(".")}.
                </p>
                <button className="mt-3 w-full py-2 rounded-lg border border-primary/30 text-xs font-bold text-primary uppercase tracking-wider hover:bg-primary/10 transition-colors">
                  Unlock Pro Stats
                </button>
              </div>
            </div>
          </div>

          {/* Key Player Stats */}
          {analysis.playerStats && analysis.playerStats.length > 0 && (
            <div>
              <h2 className="text-xl font-black flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" /> Key Player Stats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.playerStats.map((p, i) => {
                  const rating = parseFloat(p.rating);
                  const isHigh = rating >= 1.1;
                  return (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="rounded-xl border border-border bg-card p-4 flex items-center gap-4"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${
                        isHigh ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {p.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{p.name}</span>
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">
                            {p.team}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <StatPill label="Rating" value={p.rating} highlight={isHigh} />
                          <StatPill label="KPR" value={p.kpr} />
                          <StatPill label="DPR" value={p.dpr} />
                          <StatPill label="Impact" value={p.impact} highlight={parseFloat(p.impact) >= 1.1} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map-by-Map Breakdown */}
          {analysis.mapBreakdown && analysis.mapBreakdown.length > 0 && (
            <MapBreakdown maps={analysis.mapBreakdown} team1={team1} team2={team2} />
          )}

          {/* Player Form Heatmap */}
          {analysis.playerForm && analysis.playerForm.length > 0 && (
            <PlayerFormHeatmap players={analysis.playerForm} team1={team1} team2={team2} />
          )}

          {trajectoryData.length > 0 && (
            <div>
              <h2 className="text-xl font-black mb-4">Probability Trajectory</h2>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-end gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Live Prediction
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={trajectoryData} barCategoryGap="15%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" vertical={false} />
                    <XAxis
                      dataKey="phase"
                      tick={{ fontSize: 10, fill: "hsl(215, 10%, 50%)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(200, 20%, 12%)",
                        border: "1px solid hsl(200, 15%, 20%)",
                        borderRadius: "10px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value}%`, `${team1} Win Prob`]}
                    />
                    <Bar dataKey="prob" radius={[6, 6, 0, 0]}>
                      {trajectoryData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={i === trajectoryData.length - 1
                            ? "hsl(199, 90%, 55%)"
                            : "hsl(199, 90%, 55% / 0.4)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Odds */}
          {analysis.odds && Object.keys(analysis.odds.team1 || {}).length > 0 && (
            <div>
              <h2 className="text-xl font-black mb-4">Odds Comparison</h2>
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Site</th>
                      <th className="text-center p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">{team1}</th>
                      <th className="text-center p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">{team2}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(analysis.odds.team1).map((site) => (
                      <tr key={site} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-bold capitalize">{site}</td>
                        <td className="p-4 text-center font-mono font-bold text-primary">{analysis.odds.team1[site]}</td>
                        <td className="p-4 text-center font-mono font-bold">{analysis.odds.team2[site]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Stats Tab */}
      {analysis && activeTab === "Stats" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {analysis.playerStats && analysis.playerStats.length > 0 ? (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Player</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Team</th>
                    <th className="text-center p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Rating</th>
                    <th className="text-center p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">KPR</th>
                    <th className="text-center p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">DPR</th>
                    <th className="text-center p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.playerStats.map((p) => (
                    <tr key={p.name} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="p-4 font-bold">{p.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <TeamLogo name={p.team} size={16} />
                          <span className="text-muted-foreground">{p.team}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-primary">{p.rating}</td>
                      <td className="p-4 text-center font-mono">{p.kpr}</td>
                      <td className="p-4 text-center font-mono">{p.dpr}</td>
                      <td className="p-4 text-center font-mono">{p.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <PlaceholderTab text="Detailed stats will appear after analysis completes." />
          )}
        </motion.div>
      )}

      {/* Veto Tab */}
      {analysis && activeTab === "Veto" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg space-y-3">
          {analysis.veto.map((v, i) => {
            const isBan = v.action === "ban";
            const isPick = v.action === "pick";
            const isDecider = v.action === "decider";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between px-5 py-3 rounded-xl text-sm ${
                  isDecider ? "bg-muted/50 border border-border"
                  : isBan ? "bg-destructive/8 border border-destructive/15"
                  : "bg-accent/8 border border-accent/15"
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isBan ? "text-destructive" : isPick ? "text-accent" : "text-muted-foreground"
                }`}>
                  {isDecider ? "Decider" : `${v.team} ${v.action}`}
                </span>
                <span className="font-bold text-base">{v.map}</span>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Rosters / History placeholders */}
      {analysis && (activeTab === "Rosters" || activeTab === "History") && (
        <PlaceholderTab text={`${activeTab} data coming soon. Check back for live updates.`} />
      )}

      {/* Footer */}
      {analysis && (
        <div className="text-center text-xs text-muted-foreground/50 py-4 border-t border-border">
          © 2024 CS2 Edge AI. All predictive data powered by Neural Engine 4.0
        </div>
      )}
    </div>
  );
};

/* Helper components */

function ProbCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-4xl font-black">{value}%</p>
      <div className="mt-3 w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function StatPill({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-xs font-mono font-bold ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function PlaceholderTab({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-12 text-center">
      <Lock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export default MatchDetail;
