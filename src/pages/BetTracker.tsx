import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  TrendingUp, TrendingDown, Target, DollarSign, BarChart3,
  CheckCircle2, XCircle, Clock, Loader2, Trash2, Zap, Database
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import { useState } from "react";
import { toast } from "sonner";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

function usePredictionTracking() {
  return useQuery({
    queryKey: ["prediction-tracking"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prediction_tracking" as any)
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as any[];
    },
    staleTime: 60 * 1000,
  });
}

const BetTracker = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data: predictions, isLoading } = usePredictionTracking();
  const [filter, setFilter] = useState<"all" | "pending" | "won" | "lost">("all");

  const updateResult = useMutation({
    mutationFn: async ({ id, result }: { id: string; result: string }) => {
      const pred = predictions?.find((p: any) => p.id === id);
      const payout = result === "won" ? (pred?.stake || 100) * (pred?.odds_at_prediction || 1.5) : 0;
      const { error } = await supabase
        .from("prediction_tracking" as any)
        .update({ actual_result: result, payout } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prediction-tracking"] });
      toast.success("Result updated");
    },
  });

  const deletePred = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prediction_tracking" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prediction-tracking"] });
      toast.success("Prediction removed");
    },
  });

  // Compute stats
  const all = predictions || [];
  const settled = all.filter((p: any) => p.actual_result !== "pending");
  const won = settled.filter((p: any) => p.actual_result === "won");
  const lost = settled.filter((p: any) => p.actual_result === "lost");
  const pending = all.filter((p: any) => p.actual_result === "pending");

  const totalStaked = settled.reduce((s: number, p: any) => s + Number(p.stake), 0);
  const totalPayout = settled.reduce((s: number, p: any) => s + Number(p.payout), 0);
  const profit = totalPayout - totalStaked;
  const roi = totalStaked > 0 ? ((profit / totalStaked) * 100) : 0;
  const winRate = settled.length > 0 ? ((won.length / settled.length) * 100) : 0;

  // Bankroll chart
  let balance = 10000;
  const chartData = [{ name: "Start", balance, label: "Start" }];
  settled.forEach((p: any, i: number) => {
    if (p.actual_result === "won") balance += Number(p.payout) - Number(p.stake);
    else balance -= Number(p.stake);
    chartData.push({ name: `${i + 1}`, balance: +balance.toFixed(2), label: p.recommended_bet?.substring(0, 20) || `Bet ${i + 1}` });
  });

  // Streak calculation
  let currentStreak = 0;
  let streakType = "";
  for (let i = settled.length - 1; i >= 0; i--) {
    const r = settled[i].actual_result;
    if (i === settled.length - 1) {
      streakType = r;
      currentStreak = 1;
    } else if (r === streakType) {
      currentStreak++;
    } else break;
  }

  // Bet type breakdown
  const betTypeStats: Record<string, { total: number; won: number }> = {};
  settled.forEach((p: any) => {
    const t = p.bet_type || "match_winner";
    if (!betTypeStats[t]) betTypeStats[t] = { total: 0, won: 0 };
    betTypeStats[t].total++;
    if (p.actual_result === "won") betTypeStats[t].won++;
  });

  // Data source breakdown
  const liveCount = all.filter((p: any) => p.data_source === "live").length;
  const trainingCount = all.filter((p: any) => p.data_source === "training").length;

  const filtered = filter === "all" ? all :
    filter === "pending" ? pending :
    filter === "won" ? won : lost;

  const pieData = [
    { name: "Won", value: won.length, color: "hsl(160, 60%, 45%)" },
    { name: "Lost", value: lost.length, color: "hsl(0, 70%, 50%)" },
    { name: "Pending", value: pending.length, color: "hsl(215, 15%, 45%)" },
  ].filter(d => d.value > 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading bet tracker...</span>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6 max-w-6xl" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Bet <span className="text-primary">Tracker</span> & ROI
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track every AI prediction's result. Measure real profitability.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-5 gap-3" variants={stagger}>
        <KPICard icon={<Target className="w-4 h-4" />} label="Win Rate" value={`${winRate.toFixed(1)}%`} accent={winRate >= 55} />
        <KPICard icon={<DollarSign className="w-4 h-4" />} label="Profit / Loss" value={`${profit >= 0 ? "+" : ""}$${profit.toFixed(0)}`} accent={profit > 0} negative={profit < 0} />
        <KPICard icon={<TrendingUp className="w-4 h-4" />} label="ROI" value={`${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%`} accent={roi > 0} negative={roi < 0} />
        <KPICard icon={<BarChart3 className="w-4 h-4" />} label="Total Bets" value={String(all.length)} />
        <KPICard icon={<Zap className="w-4 h-4" />} label="Streak" value={`${currentStreak} ${streakType === "won" ? "W" : streakType === "lost" ? "L" : "—"}`} accent={streakType === "won"} negative={streakType === "lost"} />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Bankroll Chart */}
        <motion.div variants={fadeUp} className="xl:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Bankroll Growth</h2>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Database className="w-3 h-3" />
              {liveCount} live · {trainingCount} AI-only
            </div>
          </div>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="bankrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199, 90%, 55%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(199, 90%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 10%, 50%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215, 10%, 50%)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(200, 20%, 12%)", border: "1px solid hsl(200, 15%, 20%)", borderRadius: "10px", fontSize: "12px" }}
                  formatter={(v: number) => [`$${v.toFixed(2)}`, "Balance"]}
                />
                <Area type="monotone" dataKey="balance" stroke="hsl(199, 90%, 55%)" fill="url(#bankrollGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              No settled bets yet. Track predictions to see your bankroll growth.
            </div>
          )}
        </motion.div>

        {/* Pie + Bet Type Breakdown */}
        <motion.div variants={fadeUp} className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold mb-3">Results Breakdown</h2>
            {pieData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={45} dataKey="value" stroke="none">
                      {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="font-bold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No predictions tracked yet.</p>
            )}
          </div>

          {/* Bet Type Win Rates */}
          {Object.keys(betTypeStats).length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-bold mb-3">Win Rate by Bet Type</h2>
              <div className="space-y-2">
                {Object.entries(betTypeStats).map(([type, stats]) => {
                  const wr = stats.total > 0 ? (stats.won / stats.total) * 100 : 0;
                  return (
                    <div key={type} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground capitalize">{type.replace(/_/g, " ")}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${wr}%` }} />
                        </div>
                        <span className="font-bold w-10 text-right">{wr.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Prediction History */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm font-bold">Prediction History</h2>
          <div className="flex items-center gap-1">
            {(["all", "pending", "won", "lost"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  filter === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} {f === "all" ? `(${all.length})` : f === "pending" ? `(${pending.length})` : f === "won" ? `(${won.length})` : `(${lost.length})`}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            {all.length === 0
              ? "No predictions tracked yet. Save predictions from match analysis to start tracking."
              : "No predictions match this filter."}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((p: any) => (
              <div key={p.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:bg-muted/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate">{p.team1} vs {p.team2}</p>
                    {p.data_source === "live" && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent/15 text-accent">LIVE DATA</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{p.recommended_bet}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {(p.bet_type || "match_winner").replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{p.confidence}% conf</span>
                    <span className="text-[10px] text-muted-foreground">@ {Number(p.odds_at_prediction).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {p.actual_result === "pending" ? (
                    <>
                      <button
                        onClick={() => updateResult.mutate({ id: p.id, result: "won" })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Won
                      </button>
                      <button
                        onClick={() => updateResult.mutate({ id: p.id, result: "lost" })}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
                      >
                        <XCircle className="w-3 h-3" /> Lost
                      </button>
                    </>
                  ) : (
                    <span className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${
                      p.actual_result === "won"
                        ? "bg-accent/15 text-accent"
                        : "bg-destructive/15 text-destructive"
                    }`}>
                      {p.actual_result === "won" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {p.actual_result === "won" ? `+$${(Number(p.payout) - Number(p.stake)).toFixed(0)}` : `-$${Number(p.stake).toFixed(0)}`}
                    </span>
                  )}
                  <button
                    onClick={() => deletePred.mutate(p.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

function KPICard({ icon, label, value, accent, negative }: {
  icon: React.ReactNode; label: string; value: string; accent?: boolean; negative?: boolean;
}) {
  return (
    <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className={accent ? "text-accent" : negative ? "text-destructive" : "text-muted-foreground"}>{icon}</span>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-2xl font-black ${accent ? "text-accent" : negative ? "text-destructive" : ""}`}>{value}</p>
    </motion.div>
  );
}

export default BetTracker;
