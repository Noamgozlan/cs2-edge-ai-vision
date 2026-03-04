import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches, fetchAIAnalysis, Match } from "@/lib/api";
import { TeamLogo } from "@/lib/team-logos";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Play, RotateCcw, TrendingUp, TrendingDown,
  DollarSign, Target, Trophy, Zap, Clock, Calendar,
  CalendarDays, BarChart3, ChevronRight, Flame, Shield,
  Percent, Dice1
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, ReferenceLine
} from "recharts";

type Period = "today" | "week" | "month";
type Strategy = "flat" | "percentage" | "kelly" | "ai-confidence";

interface SimMatch {
  match: Match;
  aiPick: string;
  confidence: number;
  odds: number;
  opponentOdds: number;
  winProb: number;
}

interface SimResult {
  match: Match;
  pick: string;
  odds: number;
  stake: number;
  won: boolean;
  payout: number;
  profit: number;
  balanceAfter: number;
  confidence: number;
}

const PERIOD_CONFIG: Record<Period, { label: string; icon: React.ReactNode; desc: string }> = {
  today: { label: "Today", icon: <Clock className="w-4 h-4" />, desc: "Today's matches" },
  week: { label: "This Week", icon: <Calendar className="w-4 h-4" />, desc: "7 days of matches" },
  month: { label: "This Month", icon: <CalendarDays className="w-4 h-4" />, desc: "30 days of matches" },
};

const STRATEGY_CONFIG: Record<Strategy, { label: string; icon: React.ReactNode; desc: string; color: string }> = {
  flat: { label: "Flat Stake", icon: <DollarSign className="w-4 h-4" />, desc: "Same amount every bet", color: "text-primary" },
  percentage: { label: "% of Bank", icon: <Percent className="w-4 h-4" />, desc: "Bet % of current balance", color: "text-accent" },
  kelly: { label: "Kelly Criterion", icon: <BarChart3 className="w-4 h-4" />, desc: "Mathematically optimal sizing", color: "text-yellow-500" },
  "ai-confidence": { label: "AI Confidence", icon: <Zap className="w-4 h-4" />, desc: "Scale stake by AI confidence", color: "text-purple-400" },
};

const BettingSimulation = () => {
  const [period, setPeriod] = useState<Period>("today");
  const [strategy, setStrategy] = useState<Strategy>("flat");
  const [stakeAmount, setStakeAmount] = useState(100);
  const [bankroll, setBankroll] = useState(10000);
  const [percentBet, setPercentBet] = useState(5);
  const [minConfidence, setMinConfidence] = useState(55);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimResult[] | null>(null);
  const [simProgress, setSimProgress] = useState(0);

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000,
  });

  // Filter matches by period (simulated — we use available matches and multiply for week/month)
  const periodMatches = useMemo(() => {
    if (!matches) return [];
    const base = matches.slice(0, 10);
    if (period === "today") return base.slice(0, 4);
    if (period === "week") return base.slice(0, 7);
    return base;
  }, [matches, period]);

  const calculateStake = useCallback((
    strat: Strategy,
    balance: number,
    confidence: number,
    odds: number,
    winProb: number
  ): number => {
    switch (strat) {
      case "flat":
        return Math.min(stakeAmount, balance);
      case "percentage":
        return Math.min(+(balance * percentBet / 100).toFixed(2), balance);
      case "kelly": {
        const b = odds - 1;
        const p = winProb / 100;
        const q = 1 - p;
        const kelly = Math.max(0, (b * p - q) / b);
        const halfKelly = kelly * 0.5; // Use half-Kelly for safety
        return Math.min(+(balance * halfKelly).toFixed(2), balance * 0.25);
      }
      case "ai-confidence": {
        const factor = Math.max(0, (confidence - 50) / 50); // 0-1 scale from 50-100%
        const base = stakeAmount * (1 + factor * 2); // 1x-3x multiplier
        return Math.min(+base.toFixed(2), balance * 0.2);
      }
      default:
        return stakeAmount;
    }
  }, [stakeAmount, percentBet]);

  const runSimulation = useCallback(async () => {
    if (!periodMatches.length) return;
    setIsRunning(true);
    setResults(null);
    setSimProgress(0);

    const simResults: SimResult[] = [];
    let currentBalance = bankroll;

    for (let i = 0; i < periodMatches.length; i++) {
      const match = periodMatches[i];
      setSimProgress(((i + 1) / periodMatches.length) * 100);

      try {
        const analysis = await fetchAIAnalysis(match.team1, match.team2, match.event, match.format);
        const pred = analysis.prediction;
        const isTeam1 = pred.winProbability.team1 >= pred.winProbability.team2;
        const pick = isTeam1 ? match.team1 : match.team2;
        const winProb = isTeam1 ? pred.winProbability.team1 : pred.winProbability.team2;
        const confidence = pred.confidence;

        // Skip low confidence
        if (confidence < minConfidence) {
          continue;
        }

        // Get odds from analysis
        const pickOdds = isTeam1
          ? Object.values(analysis.odds?.team1 || {}).map(Number).filter(n => !isNaN(n))
          : Object.values(analysis.odds?.team2 || {}).map(Number).filter(n => !isNaN(n));
        const bestOdds = pickOdds.length ? Math.max(...pickOdds) : (winProb > 0 ? +(100 / winProb).toFixed(2) : 1.5);

        const stake = calculateStake(strategy, currentBalance, confidence, bestOdds, winProb);
        if (stake <= 0) continue;

        // Simulate outcome based on AI probability (Monte Carlo style)
        const roll = Math.random() * 100;
        const won = roll < winProb;
        const payout = won ? +(stake * bestOdds).toFixed(2) : 0;
        const profit = won ? payout - stake : -stake;
        currentBalance = +(currentBalance + profit).toFixed(2);

        simResults.push({
          match,
          pick,
          odds: bestOdds,
          stake,
          won,
          payout,
          profit,
          balanceAfter: currentBalance,
          confidence,
        });
      } catch {
        // Skip failed analysis
        continue;
      }

      // Small delay for animation effect
      await new Promise(r => setTimeout(r, 300));
    }

    setResults(simResults);
    setIsRunning(false);
  }, [periodMatches, bankroll, strategy, stakeAmount, minConfidence, calculateStake]);

  const simStats = useMemo(() => {
    if (!results) return null;
    const won = results.filter(r => r.won);
    const totalStaked = results.reduce((s, r) => s + r.stake, 0);
    const totalPayout = results.reduce((s, r) => s + r.payout, 0);
    const profit = totalPayout - totalStaked;
    const roi = totalStaked > 0 ? (profit / totalStaked) * 100 : 0;
    const maxDrawdown = (() => {
      let peak = bankroll;
      let maxDD = 0;
      results.forEach(r => {
        if (r.balanceAfter > peak) peak = r.balanceAfter;
        const dd = ((peak - r.balanceAfter) / peak) * 100;
        if (dd > maxDD) maxDD = dd;
      });
      return maxDD;
    })();
    const longestStreak = (() => {
      let streak = 0, max = 0;
      results.forEach(r => {
        if (r.won) { streak++; max = Math.max(max, streak); }
        else streak = 0;
      });
      return max;
    })();

    return {
      total: results.length,
      won: won.length,
      lost: results.length - won.length,
      winRate: results.length > 0 ? (won.length / results.length) * 100 : 0,
      profit,
      roi,
      finalBalance: results.length > 0 ? results[results.length - 1].balanceAfter : bankroll,
      maxDrawdown,
      longestStreak,
      avgOdds: results.length > 0 ? results.reduce((s, r) => s + r.odds, 0) / results.length : 0,
      avgStake: results.length > 0 ? results.reduce((s, r) => s + r.stake, 0) / results.length : 0,
    };
  }, [results, bankroll]);

  const chartData = useMemo(() => {
    if (!results) return [];
    return [
      { name: "Start", balance: bankroll, profit: 0 },
      ...results.map((r, i) => ({
        name: `${i + 1}`,
        balance: r.balanceAfter,
        profit: r.balanceAfter - bankroll,
        matchLabel: `${r.match.team1} vs ${r.match.team2}`,
      })),
    ];
  }, [results, bankroll]);

  if (matchesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Config Panel */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              Simulation Engine
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Configure and run AI betting simulations</p>
          </div>
          {results && (
            <button
              onClick={() => { setResults(null); setSimProgress(0); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Period Selection */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Time Period</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(PERIOD_CONFIG) as [Period, typeof PERIOD_CONFIG["today"]][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold border transition-all ${
                  period === key
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                }`}
              >
                {cfg.icon}
                <div className="text-left">
                  <p className="text-sm font-bold">{cfg.label}</p>
                  <p className="text-[10px] text-muted-foreground">{periodMatches.length} matches</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Strategy Selection */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Betting Strategy</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(STRATEGY_CONFIG) as [Strategy, typeof STRATEGY_CONFIG["flat"]][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setStrategy(key)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all ${
                  strategy === key
                    ? "bg-primary/10 border-primary/30"
                    : "bg-muted/30 border-border hover:border-primary/20"
                }`}
              >
                <div className={`p-2 rounded-lg ${strategy === key ? "bg-primary/20" : "bg-muted"}`}>
                  <span className={strategy === key ? "text-primary" : "text-muted-foreground"}>{cfg.icon}</span>
                </div>
                <div>
                  <p className={`text-sm font-bold ${strategy === key ? cfg.color : "text-foreground"}`}>{cfg.label}</p>
                  <p className="text-[10px] text-muted-foreground">{cfg.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Parameters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Starting Bank</p>
            <div className="flex items-center gap-1">
              {[5000, 10000, 25000, 50000].map(v => (
                <button
                  key={v}
                  onClick={() => setBankroll(v)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex-1 ${
                    bankroll === v
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ${(v / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
              {strategy === "percentage" ? "Bet %" : "Stake / Game"}
            </p>
            <div className="flex items-center gap-1">
              {strategy === "percentage"
                ? [2, 5, 10, 15].map(v => (
                    <button
                      key={v}
                      onClick={() => setPercentBet(v)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex-1 ${
                        percentBet === v
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {v}%
                    </button>
                  ))
                : [50, 100, 250, 500].map(v => (
                    <button
                      key={v}
                      onClick={() => setStakeAmount(v)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex-1 ${
                        stakeAmount === v
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      ${v}
                    </button>
                  ))
              }
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Min Confidence</p>
            <div className="flex items-center gap-1">
              {[50, 55, 60, 70].map(v => (
                <button
                  key={v}
                  onClick={() => setMinConfidence(v)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex-1 ${
                    minConfidence === v
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={runSimulation}
              disabled={isRunning || !periodMatches.length}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Simulating…
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Simulation
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border border-primary/20 bg-primary/5 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Running simulation…
              </span>
              <span className="text-xs font-mono text-muted-foreground">{simProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${simProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results && simStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Result Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <ResultCard
                label="Final Balance"
                value={`$${simStats.finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                sub={`${simStats.profit >= 0 ? "+" : ""}$${simStats.profit.toFixed(2)}`}
                positive={simStats.profit >= 0}
                icon={<DollarSign className="w-4 h-4" />}
              />
              <ResultCard
                label="Win Rate"
                value={`${simStats.winRate.toFixed(1)}%`}
                sub={`${simStats.won}W - ${simStats.lost}L`}
                positive={simStats.winRate >= 50}
                icon={<Target className="w-4 h-4" />}
              />
              <ResultCard
                label="ROI"
                value={`${simStats.roi >= 0 ? "+" : ""}${simStats.roi.toFixed(1)}%`}
                sub={`${simStats.total} bets placed`}
                positive={simStats.roi >= 0}
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <ResultCard
                label="Max Drawdown"
                value={`${simStats.maxDrawdown.toFixed(1)}%`}
                sub="Peak to trough"
                positive={simStats.maxDrawdown < 15}
                icon={<Shield className="w-4 h-4" />}
              />
              <ResultCard
                label="Best Streak"
                value={`${simStats.longestStreak}W`}
                sub={`Avg odds: ${simStats.avgOdds.toFixed(2)}`}
                positive={simStats.longestStreak >= 3}
                icon={<Flame className="w-4 h-4" />}
              />
            </div>

            {/* Chart */}
            {chartData.length > 1 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Balance Over Time</p>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(199, 90%, 55%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(199, 90%, 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 20%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215, 10%, 55%)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(215, 10%, 55%)" }} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(200, 20%, 12%)",
                        border: "1px solid hsl(200, 15%, 20%)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, "Balance"]}
                      labelFormatter={(label, payload) => {
                        const p = payload?.[0]?.payload;
                        return p?.matchLabel || `Bet ${label}`;
                      }}
                    />
                    <ReferenceLine y={bankroll} stroke="hsl(215, 10%, 40%)" strokeDasharray="4 4" />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="hsl(199, 90%, 55%)"
                      strokeWidth={2.5}
                      fill="url(#balGrad)"
                      dot={{ r: 4, fill: "hsl(199, 90%, 55%)", stroke: "hsl(200, 20%, 12%)", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Individual Results */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Match-by-Match Breakdown</p>
              </div>
              <div className="divide-y divide-border">
                {results.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors"
                  >
                    <span className="text-[10px] font-mono text-muted-foreground w-6">#{i + 1}</span>
                    <TeamLogo name={r.match.team1} size={20} />
                    <span className="text-xs font-bold flex-1 truncate">
                      {r.match.team1} vs {r.match.team2}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">Pick:</span>
                      <TeamLogo name={r.pick} size={14} />
                      <span className="text-xs font-bold">{r.pick}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">@{r.odds.toFixed(2)}</span>
                    <span className="text-xs font-mono text-muted-foreground">${r.stake.toFixed(0)}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      r.won ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
                    }`}>
                      {r.won ? `+$${r.profit.toFixed(0)}` : `-$${Math.abs(r.profit).toFixed(0)}`}
                    </span>
                    <span className="text-xs font-mono font-bold w-20 text-right">
                      ${r.balanceAfter.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Verdict */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className={`rounded-2xl p-6 text-center ${
                simStats.profit >= 0
                  ? "bg-accent/10 border-2 border-accent/30"
                  : "bg-destructive/10 border-2 border-destructive/30"
              }`}
            >
              <div className="text-4xl mb-2">{simStats.profit >= 0 ? "🚀" : "📉"}</div>
              <h3 className={`text-2xl font-black ${simStats.profit >= 0 ? "text-accent" : "text-destructive"}`}>
                {simStats.profit >= 0 ? "Profitable!" : "Unprofitable"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {simStats.profit >= 0
                  ? `The AI system would have generated $${simStats.profit.toFixed(2)} profit with a ${simStats.roi.toFixed(1)}% ROI using ${STRATEGY_CONFIG[strategy].label} strategy.`
                  : `The AI system would have lost $${Math.abs(simStats.profit).toFixed(2)} with ${STRATEGY_CONFIG[strategy].label} strategy. Try adjusting parameters or strategy.`
                }
              </p>
              <p className="text-xs text-muted-foreground/60 mt-3">
                ⚠️ Results are simulated using Monte Carlo probability. Run multiple times for statistical significance.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function ResultCard({ label, value, sub, positive, icon }: {
  label: string; value: string; sub: string; positive: boolean; icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`p-1 rounded-md ${positive ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`}>
          {icon}
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-xl font-black ${positive ? "text-accent" : "text-destructive"}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
    </motion.div>
  );
}

export default BettingSimulation;
