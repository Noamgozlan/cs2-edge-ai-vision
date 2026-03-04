import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchMatches, fetchAIAnalysis, Match } from "@/lib/api";
import { TeamLogo } from "@/lib/team-logos";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, TrendingUp, TrendingDown, DollarSign, Target,
  Trophy, Trash2, ChevronDown, Zap, CircleDot
} from "lucide-react";
import { toast } from "sonner";

interface DemoBet {
  id: string;
  match_id: string;
  team1: string;
  team2: string;
  event: string;
  team_picked: string;
  odds_at_bet: number;
  stake: number;
  result: string;
  payout: number;
  created_at: string;
}

const STARTING_BALANCE = 10000;
const DEFAULT_STAKE = 100;

const DemoBetting = () => {
  const queryClient = useQueryClient();
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [stakes, setStakes] = useState<Record<string, number>>({});

  // Fetch matches
  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user's demo bets
  const { data: bets = [], isLoading: betsLoading } = useQuery({
    queryKey: ["demo-bets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demo_bets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as DemoBet[];
    },
  });

  // Place bet mutation
  const placeBet = useMutation({
    mutationFn: async (params: {
      match: Match; teamPicked: string; odds: number; stake: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("demo_bets").insert({
        user_id: user.id,
        match_id: params.match.id,
        team1: params.match.team1,
        team2: params.match.team2,
        event: params.match.event,
        team_picked: params.teamPicked,
        odds_at_bet: params.odds,
        stake: params.stake,
        result: "pending",
        payout: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demo-bets"] });
      toast.success("Bet placed!");
    },
    onError: () => toast.error("Failed to place bet"),
  });

  // Settle bet mutation (manually resolve)
  const settleBet = useMutation({
    mutationFn: async ({ id, result, odds, stake }: { id: string; result: "won" | "lost"; odds: number; stake: number }) => {
      const payout = result === "won" ? +(odds * stake).toFixed(2) : 0;
      const { error } = await supabase
        .from("demo_bets")
        .update({ result, payout })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demo-bets"] });
      toast.success("Bet settled!");
    },
  });

  // Delete bet
  const deleteBet = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("demo_bets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demo-bets"] });
      toast.success("Bet removed");
    },
  });

  // Stats
  const stats = useMemo(() => {
    const settled = bets.filter(b => b.result !== "pending");
    const won = settled.filter(b => b.result === "won");
    const totalStaked = bets.reduce((s, b) => s + Number(b.stake), 0);
    const totalPayout = settled.reduce((s, b) => s + Number(b.payout), 0);
    const totalLost = settled.filter(b => b.result === "lost").reduce((s, b) => s + Number(b.stake), 0);
    const profit = totalPayout - totalStaked;
    const pendingStake = bets.filter(b => b.result === "pending").reduce((s, b) => s + Number(b.stake), 0);
    const balance = STARTING_BALANCE + totalPayout - totalStaked;
    const roi = totalStaked > 0 ? ((totalPayout - totalStaked) / totalStaked * 100) : 0;
    return {
      total: bets.length,
      won: won.length,
      lost: settled.length - won.length,
      pending: bets.length - settled.length,
      profit,
      balance,
      roi,
      pendingStake,
    };
  }, [bets]);

  if (matchesLoading || betsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Demo Betting</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Virtual betting to track how profitable the AI system is. Starting balance: ${STARTING_BALANCE.toLocaleString()}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<DollarSign className="w-4 h-4" />}
          label="Balance"
          value={`$${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          trend={stats.profit >= 0 ? "up" : "down"}
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Profit / Loss"
          value={`${stats.profit >= 0 ? "+" : ""}$${stats.profit.toFixed(2)}`}
          trend={stats.profit >= 0 ? "up" : "down"}
        />
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="Win Rate"
          value={stats.won + stats.lost > 0 ? `${((stats.won / (stats.won + stats.lost)) * 100).toFixed(1)}%` : "—"}
          trend="neutral"
        />
        <StatCard
          icon={<Trophy className="w-4 h-4" />}
          label="ROI"
          value={`${stats.roi >= 0 ? "+" : ""}${stats.roi.toFixed(1)}%`}
          trend={stats.roi >= 0 ? "up" : "down"}
        />
      </div>

      {/* Record summary */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">Record:</span>
        <span className="font-bold text-accent">{stats.won}W</span>
        <span className="font-bold text-destructive">{stats.lost}L</span>
        <span className="font-bold text-muted-foreground">{stats.pending}P</span>
      </div>

      {/* Available Matches */}
      <div>
        <h2 className="text-lg font-bold mb-3">Place Bets</h2>
        <div className="space-y-2">
          {matches?.slice(0, 10).map((m) => {
            const alreadyBet = bets.some(b => b.match_id === m.id && b.result === "pending");
            const isExpanded = expandedMatch === m.id;
            const stake = stakes[m.id] || DEFAULT_STAKE;

            return (
              <motion.div
                key={m.id}
                className="rounded-xl border border-border bg-card overflow-hidden"
                layout
              >
                {/* Match row */}
                <button
                  onClick={() => setExpandedMatch(isExpanded ? null : m.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
                >
                  <TeamLogo name={m.team1} size={28} />
                  <span className="font-bold text-sm flex-1 truncate">{m.team1}</span>
                  <span className="text-xs text-muted-foreground font-medium">vs</span>
                  <span className="font-bold text-sm flex-1 truncate text-right">{m.team2}</span>
                  <TeamLogo name={m.team2} size={28} />
                  {alreadyBet && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-primary/15 text-primary border border-primary/20">
                      BET PLACED
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded betting panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <BettingPanel
                        match={m}
                        stake={stake}
                        onStakeChange={(v) => setStakes(prev => ({ ...prev, [m.id]: v }))}
                        onBet={(teamPicked, odds) => {
                          placeBet.mutate({ match: m, teamPicked, odds, stake });
                        }}
                        disabled={placeBet.isPending || alreadyBet}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bet History */}
      {bets.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Bet History</h2>
          <div className="space-y-2">
            {bets.map((bet) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-4 rounded-xl border bg-card ${
                  bet.result === "won" ? "border-accent/30" :
                  bet.result === "lost" ? "border-destructive/30" :
                  "border-border"
                }`}
              >
                <TeamLogo name={bet.team_picked} size={24} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{bet.team1} vs {bet.team2}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Picked: {bet.team_picked} @ {Number(bet.odds_at_bet).toFixed(2)} • ${Number(bet.stake).toFixed(0)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {bet.result === "pending" && (
                    <>
                      <button
                        onClick={() => settleBet.mutate({ id: bet.id, result: "won", odds: Number(bet.odds_at_bet), stake: Number(bet.stake) })}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition-colors"
                      >
                        Won ✓
                      </button>
                      <button
                        onClick={() => settleBet.mutate({ id: bet.id, result: "lost", odds: Number(bet.odds_at_bet), stake: Number(bet.stake) })}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive/25 transition-colors"
                      >
                        Lost ✗
                      </button>
                    </>
                  )}
                  {bet.result === "won" && (
                    <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-accent/15 text-accent">
                      +${Number(bet.payout).toFixed(2)}
                    </span>
                  )}
                  {bet.result === "lost" && (
                    <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-destructive/15 text-destructive">
                      -${Number(bet.stake).toFixed(2)}
                    </span>
                  )}
                  <button
                    onClick={() => deleteBet.mutate(bet.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* Sub-components */

function StatCard({ icon, label, value, trend }: {
  icon: React.ReactNode; label: string; value: string; trend: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${
          trend === "up" ? "bg-accent/15 text-accent" :
          trend === "down" ? "bg-destructive/15 text-destructive" :
          "bg-muted text-muted-foreground"
        }`}>
          {icon}
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-xl font-black ${
        trend === "up" ? "text-accent" :
        trend === "down" ? "text-destructive" :
        "text-foreground"
      }`}>{value}</p>
    </div>
  );
}

function BettingPanel({ match, stake, onStakeChange, onBet, disabled }: {
  match: Match;
  stake: number;
  onStakeChange: (v: number) => void;
  onBet: (team: string, odds: number) => void;
  disabled: boolean;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["odds-quick", match.team1, match.team2],
    queryFn: async () => {
      const analysis = await fetchAIAnalysis(match.team1, match.team2, match.event, match.format);
      const p = analysis.prediction;
      // Build simple odds from probabilities
      const odds1 = p.winProbability.team1 > 0 ? +(100 / p.winProbability.team1).toFixed(2) : 2.0;
      const odds2 = p.winProbability.team2 > 0 ? +(100 / p.winProbability.team2).toFixed(2) : 2.0;
      return {
        team1Odds: odds1,
        team2Odds: odds2,
        confidence: p.confidence,
        recommended: p.recommendedBet,
        winner: p.winProbability.team1 >= p.winProbability.team2 ? match.team1 : match.team2,
      };
    },
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="px-4 pb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading AI odds…
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="px-4 pb-4 space-y-3">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Zap className="w-3 h-3 text-primary" />
        <span>AI Confidence: <strong className="text-primary">{data.confidence}%</strong></span>
        <span className="mx-1">•</span>
        <span>Recommended: <strong className="text-foreground">{data.recommended}</strong></span>
      </div>

      {/* Stake input */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Stake:</span>
        {[50, 100, 250, 500].map(v => (
          <button
            key={v}
            onClick={() => onStakeChange(v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              stake === v
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ${v}
          </button>
        ))}
      </div>

      {/* Bet buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={disabled}
          onClick={() => onBet(match.team1, data.team1Odds)}
          className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          <div className="flex items-center gap-2">
            <TeamLogo name={match.team1} size={20} />
            <span className="text-sm font-bold">{match.team1}</span>
          </div>
          <span className="font-mono font-black text-primary text-lg">{data.team1Odds.toFixed(2)}</span>
        </button>
        <button
          disabled={disabled}
          onClick={() => onBet(match.team2, data.team2Odds)}
          className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          <div className="flex items-center gap-2">
            <TeamLogo name={match.team2} size={20} />
            <span className="text-sm font-bold">{match.team2}</span>
          </div>
          <span className="font-mono font-black text-primary text-lg">{data.team2Odds.toFixed(2)}</span>
        </button>
      </div>

      {/* Potential payout */}
      <p className="text-[11px] text-muted-foreground">
        Potential payout: <strong className="text-foreground">${(stake * Math.max(data.team1Odds, data.team2Odds)).toFixed(2)}</strong> (best odds)
      </p>
    </div>
  );
}

export default DemoBetting;
