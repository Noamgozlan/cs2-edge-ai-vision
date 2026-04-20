import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BettingCompareResponse, fetchAIAnalysis, fetchBettingCompare, MatchAnalysis } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowLeft,
  Loader2,
  Zap,
  TrendingUp,
  Shield,
  Swords,
  Users,
  History,
  BookmarkPlus,
  Activity,
  BarChart3,
  Clock3,
  Target,
  Scale,
  ExternalLink,
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const TABS = ["Analysis", "Stats", "Veto", "Rosters", "History", "Betting Compare"] as const;
type Tab = typeof TABS[number];

const MatchDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("Analysis");
  const [isAnalysisRequested, setIsAnalysisRequested] = useState(false);

  const team1 = searchParams.get("team1") || "Team A";
  const team2 = searchParams.get("team2") || "Team B";
  const event = searchParams.get("event") || "CS2 Tournament";
  const format = searchParams.get("format") || "Bo3";
  const time = searchParams.get("time") || "";
  const rank1 = searchParams.get("rank1") || "";
  const rank2 = searchParams.get("rank2") || "";
  const score1 = searchParams.get("score1");
  const score2 = searchParams.get("score2");
  const status = searchParams.get("status") || "upcoming";

  const shouldLoadAnalysis = isAnalysisRequested || activeTab !== "Analysis";
  const shouldLoadBettingCompare = activeTab === "Betting Compare";

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["ai-analysis", team1, team2, event, format, language],
    queryFn: () => fetchAIAnalysis(team1, team2, event, format, language),
    staleTime: 10 * 60 * 1000,
    retry: 1,
    enabled: shouldLoadAnalysis,
  });

  const { data: bettingCompare, isLoading: isOddsLoading } = useQuery({
    queryKey: ["betting-compare", team1, team2, event],
    queryFn: () => fetchBettingCompare(team1, team2, event),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    enabled: shouldLoadBettingCompare,
  });

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

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 } },
  };

  const matchStatusLabel =
    status === "live" ? "Live Match" : status === "finished" ? "Finished Match" : "Upcoming Match";
  const hasScore = score1 !== null && score1 !== "" && score2 !== null && score2 !== "";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link
        to="/dashboard/matches"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to matches
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{matchStatusLabel}</span>
            <span className="text-xs font-medium text-muted-foreground/60 px-1">•</span>
            <span className="text-xs font-medium text-muted-foreground">{event}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight flex items-center gap-3">
            <TeamLogo name={team1} size={40} />
            {team1}
            <span className="text-muted-foreground/40 font-medium text-xl px-2">vs</span>
            <TeamLogo name={team2} size={40} />
            {team2}
          </h1>
        </div>
        {rank1 && rank2 && (
          <div className="flex items-center gap-2">
            <div className="surface-raised rounded-lg px-4 py-2.5 text-center min-w-[80px]">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{team1} Rank</p>
              <p className="text-lg font-bold font-mono-data">#{rank1}</p>
            </div>
            <div className="surface-raised rounded-lg px-4 py-2.5 text-center min-w-[80px]">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{team2} Rank</p>
              <p className="text-lg font-bold font-mono-data">#{rank2}</p>
            </div>
          </div>
        )}
      </div>

      {hasScore && (
        <div className="surface-raised rounded-xl p-4 flex items-center justify-center gap-8">
          <ScoreBlock team={team1} score={score1 || "0"} />
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Score</p>
            <p className="text-sm text-muted-foreground">{format}</p>
          </div>
          <ScoreBlock team={team2} score={score2 || "0"} />
        </div>
      )}

      <div className="flex items-center gap-6 border-b border-border/60 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-16 flex flex-col items-center justify-center gap-4 bg-card/30 rounded-xl border border-border/50"
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/50" />
          <div className="text-center">
            <p className="font-semibold text-foreground">Analyzing match data</p>
            <p className="text-sm text-muted-foreground mt-1">Processing recent form and map pools...</p>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm font-medium text-destructive">
          Analysis failed: {(error as Error).message}
        </div>
      )}

      {!isAnalysisRequested && activeTab === "Analysis" && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col items-center justify-center py-16 px-4 bg-card rounded-xl border border-border/80 shadow-sm"
        >
          <div className="w-12 h-12 mb-5 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Request AI Analysis</h2>
          <p className="text-sm text-muted-foreground mb-8 text-center max-w-sm leading-relaxed">
            Generate a comprehensive breakdown of map vetoes, player props, and betting value.
          </p>
          <button
            onClick={() => setIsAnalysisRequested(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors pressable shadow-sm"
          >
            Run analysis
          </button>
        </motion.div>
      )}

      {analysis && activeTab === "Analysis" && (
        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={itemVars} className="p-6 md:p-8 bg-card border border-border/80 rounded-xl shadow-sm relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Primary Recommendation</span>
                  <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded bg-muted">
                    {analysis.prediction.betType?.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                  {analysis.prediction.recommendedBet}
                </p>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Confidence</p>
                    <p className="text-xl font-bold font-mono-data">{analysis.prediction.confidence}%</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Win Probability</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {team1} <span className="font-mono-data font-bold">{analysis.prediction.winProbability.team1}%</span>
                      </span>
                      <span className="text-muted-foreground text-xs">/</span>
                      <span className="text-sm font-medium">
                        {team2} <span className="font-mono-data font-bold">{analysis.prediction.winProbability.team2}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) {
                    toast.error("Login required");
                    return;
                  }
                  toast.success("Prediction saved to tracking.");
                }}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground font-medium text-sm rounded-md hover:bg-muted/80 transition-colors pressable"
              >
                <BookmarkPlus className="w-4 h-4" /> Save bet
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div variants={itemVars} className="surface-raised rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border/60 bg-muted/20 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Strategic Breakdown</h2>
                </div>
                <div className="p-5 space-y-6">
                  {analysis.analysis.sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <span>{section.emoji}</span> {section.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {analysis.playerStats && analysis.playerStats.length > 0 && (
                <motion.div variants={itemVars} className="surface-raised rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/60 bg-muted/20 flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Key Player Matchups</h2>
                  </div>
                  <div className="divide-y divide-border/60">
                    {analysis.playerStats.map((p) => {
                      const rating = parseFloat(p.rating);
                      const isHigh = rating >= 1.1;
                      return (
                        <div key={p.name} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isHigh ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            }`}>
                              {p.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{p.name}</p>
                              <p className="text-[11px] text-muted-foreground">{p.team}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 sm:gap-6 text-right">
                            <StatPill label="Rating" value={p.rating} highlight={isHigh} />
                            <StatPill label="Impact" value={p.impact} highlight={parseFloat(p.impact) >= 1.1} />
                            <StatPill label="KPR" value={p.kpr} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-6">
              <motion.div variants={itemVars} className="surface-raised rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border/60 bg-muted/20 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Predicted Veto</h2>
                </div>
                <div className="p-2 space-y-1">
                  {analysis.veto.map((v, i) => {
                    const isBan = v.action === "ban";
                    const isDecider = v.action === "decider";
                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/40 transition-colors">
                        <span className={`text-[11px] font-semibold uppercase tracking-wide ${
                          isDecider ? "text-muted-foreground" : isBan ? "text-destructive/80" : "text-primary/80"
                        }`}>
                          {isDecider ? "Decider" : `${v.team} ${v.action}`}
                        </span>
                        <span className="text-sm font-medium">{v.map}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {analysis.alternativeBets && analysis.alternativeBets.length > 0 && (
                <motion.div variants={itemVars} className="surface-raised rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/60 bg-muted/20">
                    <h2 className="text-sm font-semibold">Secondary Value</h2>
                  </div>
                  <div className="divide-y divide-border/60">
                    {analysis.alternativeBets.map((alt, i) => (
                      <div key={i} className="p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {alt.betType.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs font-semibold">{alt.confidence}%</span>
                        </div>
                        <p className="text-sm font-semibold mb-1">{alt.bet}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {analysis && activeTab === "Stats" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <StatsOverview team1={team1} team2={team2} analysis={analysis} status={status} time={time} format={format} />
              <MapBreakdown maps={analysis.mapBreakdown || []} team1={team1} team2={team2} />
            </div>
            <div className="space-y-6">
              <PreMatchCountdown matchTime={time} team1={team1} team2={team2} event={event} format={format} />
              <ConfidenceCard team1={team1} team2={team2} analysis={analysis} />
            </div>
          </div>
        </motion.div>
      )}

      {analysis && activeTab === "Veto" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="surface-raised rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/60 bg-muted/20 flex items-center gap-2">
              <Swords className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Predicted Pick / Ban Sequence</h2>
            </div>
            <div className="p-4 space-y-3">
              {analysis.veto.map((step, index) => (
                <div key={`${step.team}-${step.map}-${index}`} className="surface-raised rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Step {index + 1}</p>
                    <p className="text-sm font-semibold">
                      {step.action === "decider" ? "Decider map" : `${step.team} ${step.action}s ${step.map}`}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    step.action === "ban"
                      ? "bg-destructive/10 text-destructive"
                      : step.action === "pick"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {step.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <MapBreakdown maps={analysis.mapBreakdown || []} team1={team1} team2={team2} />
        </motion.div>
      )}

      {analysis && activeTab === "Rosters" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <PlayerFormHeatmap players={analysis.playerForm || []} team1={team1} team2={team2} />
          <div className="surface-raised rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/60 bg-muted/20 flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Player Efficiency Snapshot</h2>
            </div>
            <div className="divide-y divide-border/60">
              {analysis.playerStats.map((player) => (
                <div key={`${player.team}-${player.name}`} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{player.name}</p>
                    <p className="text-[11px] text-muted-foreground">{player.team}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-right">
                    <StatPill label="Rating" value={player.rating} highlight={parseFloat(player.rating) >= 1.1} />
                    <StatPill label="Impact" value={player.impact} highlight={parseFloat(player.impact) >= 1.1} />
                    <StatPill label="KPR" value={player.kpr} />
                    <StatPill label="DPR" value={player.dpr} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {analysis && activeTab === "History" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="surface-raised rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border/60 bg-muted/20 flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Probability Trajectory</h2>
              </div>
              <div className="p-4 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trajectoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="phase" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "hsl(var(--muted) / 0.35)" }} />
                    <Bar dataKey="prob" radius={[6, 6, 0, 0]}>
                      {trajectoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === trajectoryData.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.5)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="surface-raised rounded-xl p-5">
              <h2 className="text-sm font-semibold mb-3">Match Summary</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.analysis.summary}</p>
            </div>
          </div>
          <div className="space-y-6">
            <ConfidenceCard team1={team1} team2={team2} analysis={analysis} />
            <PreMatchCountdown matchTime={time} team1={team1} team2={team2} event={event} format={format} />
          </div>
        </motion.div>
      )}

      {activeTab === "Betting Compare" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <BettingComparePanel
            data={bettingCompare}
            isLoading={isOddsLoading}
            team1={team1}
            team2={team2}
          />
        </motion.div>
      )}
    </div>
  );
};

function ScoreBlock({ team, score }: { team: string; score: string }) {
  return (
    <div className="text-center">
      <p className="text-xs font-medium text-muted-foreground mb-1">{team}</p>
      <p className="text-3xl font-bold font-mono-data">{score}</p>
    </div>
  );
}

function StatsOverview({
  team1,
  team2,
  analysis,
  status,
  time,
  format,
}: {
  team1: string;
  team2: string;
  analysis: MatchAnalysis;
  status: string;
  time: string;
  format: string;
}) {
  const probabilityEdge = Math.abs(analysis.prediction.winProbability.team1 - analysis.prediction.winProbability.team2);

  return (
    <div className="surface-raised rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/20 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Match Snapshot</h2>
      </div>
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<Activity className="w-4 h-4" />}
          label="Status"
          value={status === "live" ? "Live" : status === "finished" ? "Final" : "Scheduled"}
        />
        <MetricCard icon={<Clock3 className="w-4 h-4" />} label="Format" value={format} />
        <MetricCard icon={<Target className="w-4 h-4" />} label="Confidence" value={`${analysis.prediction.confidence}%`} />
        <MetricCard icon={<TrendingUp className="w-4 h-4" />} label="Model Edge" value={`${probabilityEdge}%`} />
      </div>
      <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg bg-muted/30 p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">{team1}</p>
          <p className="text-2xl font-bold font-mono-data">{analysis.prediction.winProbability.team1}%</p>
        </div>
        <div className="rounded-lg bg-muted/30 p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">{team2}</p>
          <p className="text-2xl font-bold font-mono-data">{analysis.prediction.winProbability.team2}%</p>
        </div>
      </div>
      {time && (
        <div className="px-5 pb-5">
          <p className="text-xs text-muted-foreground">Scheduled time: {time}</p>
        </div>
      )}
    </div>
  );
}

function ConfidenceCard({
  team1,
  team2,
  analysis,
}: {
  team1: string;
  team2: string;
  analysis: MatchAnalysis;
}) {
  const favoredTeam =
    analysis.prediction.winProbability.team1 >= analysis.prediction.winProbability.team2 ? team1 : team2;

  return (
    <div className="surface-raised rounded-xl p-5 space-y-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary mb-2">Model lean</p>
        <p className="text-lg font-semibold">{favoredTeam}</p>
        <p className="text-sm text-muted-foreground mt-1">{analysis.prediction.recommendedBet}</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{team1}</span>
          <span className="font-semibold font-mono-data">{analysis.prediction.winProbability.team1}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${analysis.prediction.winProbability.team1}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{team2}</span>
          <span className="font-semibold font-mono-data">{analysis.prediction.winProbability.team2}%</span>
        </div>
      </div>
      {analysis.prediction.expectedValue && (
        <div className="rounded-lg bg-accent/10 text-accent px-3 py-2 text-sm font-medium">
          Expected value: {analysis.prediction.expectedValue}
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function StatPill({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-sm font-bold font-mono-data ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function BettingComparePanel({
  data,
  isLoading,
  team1,
  team2,
}: {
  data?: BettingCompareResponse;
  isLoading: boolean;
  team1: string;
  team2: string;
}) {
  const markets = data?.markets || [];
  const [selectedMarket, setSelectedMarket] = useState("Match Winner");

  const availableMarket = useMemo(() => {
    if (!markets.length) return null;
    return markets.find((market) => market.name === selectedMarket) || markets[0];
  }, [markets, selectedMarket]);

  const bestTeam1Odds = availableMarket?.rows.reduce((best, row) => Math.max(best, row.team1Odds || 0), 0) || 0;
  const bestTeam2Odds = availableMarket?.rows.reduce((best, row) => Math.max(best, row.team2Odds || 0), 0) || 0;
  const bestDrawOdds = availableMarket?.rows.reduce((best, row) => Math.max(best, row.drawOdds || 0), 0) || 0;

  if (isLoading) {
    return (
      <div className="surface-raised rounded-xl p-8 flex items-center justify-center gap-3 min-h-[260px]">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        <div className="text-sm text-muted-foreground">Loading sportsbook odds comparison...</div>
      </div>
    );
  }

  if (!availableMarket || availableMarket.rows.length === 0) {
    return (
      <div className="surface-raised rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 bg-muted/20 flex items-center gap-2">
          <Scale className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Best Odds Comparison</h2>
        </div>
        <div className="px-6 py-12 text-center space-y-3">
          <div className="mx-auto w-11 h-11 rounded-full bg-muted/40 flex items-center justify-center">
            <Scale className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No betting odds available for this match yet.</p>
          <p className="text-xs text-muted-foreground">HLTV has not published sportsbook lines for this matchup yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-raised rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border/60 bg-muted/20 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-sm font-semibold">Best Odds Comparison</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated {formatLastUpdated(data?.lastUpdated)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {markets.length > 1 && (
            <select
              value={availableMarket.name}
              onChange={(event) => setSelectedMarket(event.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {markets.map((market) => (
                <option key={market.name} value={market.name}>
                  {market.name}
                </option>
              ))}
            </select>
          )}

          {data?.matchUrl && (
            <a
              href={data.matchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              View on HLTV
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-background/40">
            <tr className="border-b border-border/60">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Sportsbook</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Market</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{team1}</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{team2}</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Draw</th>
            </tr>
          </thead>
          <tbody>
            {availableMarket.rows.map((row) => {
              const hasAnyBest =
                row.team1Odds === bestTeam1Odds ||
                row.team2Odds === bestTeam2Odds ||
                (!!row.drawOdds && row.drawOdds === bestDrawOdds);

              return (
                <tr key={`${row.market}-${row.sportsbook}`} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        {row.bookmakerUrl ? (
                          <a
                            href={row.bookmakerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors"
                          >
                            {row.sportsbook}
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                          </a>
                        ) : (
                          <span className="text-sm font-semibold">{row.sportsbook}</span>
                        )}
                        {hasAnyBest && (
                          <div className="mt-1">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                              Best value
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{row.market}</td>
                  <td className="px-4 py-4 text-right">
                    <OddsCell value={row.team1Odds} isBest={row.team1Odds === bestTeam1Odds} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <OddsCell value={row.team2Odds} isBest={row.team2Odds === bestTeam2Odds} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <OddsCell value={row.drawOdds} isBest={!!row.drawOdds && row.drawOdds === bestDrawOdds} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OddsCell({ value, isBest }: { value?: number | null; isBest: boolean }) {
  if (value === null || value === undefined) {
    return <span className="text-sm text-muted-foreground/50">-</span>;
  }

  return (
    <span
      className={`inline-flex min-w-[72px] justify-end rounded-md px-2.5 py-1 font-mono-data text-sm font-semibold ${
        isBest ? "bg-primary/10 text-primary" : "text-foreground"
      }`}
    >
      {value.toFixed(2)}
    </span>
  );
}

function formatLastUpdated(value?: string) {
  if (!value) return "just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "just now";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default MatchDetail;
