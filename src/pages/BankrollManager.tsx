import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Wallet, TrendingUp, TrendingDown, AlertTriangle,
  Shield, Target, Loader2, Calculator
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  CartesianGrid, BarChart, Bar, Cell
} from "recharts";
import { useState, useMemo } from "react";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

function useAllBets() {
  return useQuery({
    queryKey: ["bankroll-all-bets"],
    queryFn: async () => {
      const [{ data: demos }, { data: predictions }] = await Promise.all([
        supabase.from("demo_bets").select("*").order("created_at", { ascending: true }),
        supabase.from("prediction_tracking" as any).select("*").order("created_at", { ascending: true }),
      ]);
      return {
        demoBets: (demos || []) as any[],
        predictions: (predictions || []) as any[],
      };
    },
    staleTime: 60 * 1000,
  });
}

function kellyStake(bankroll: number, probability: number, odds: number): number {
  const q = 1 - probability;
  const b = odds - 1;
  const kelly = (probability * b - q) / b;
  // Quarter Kelly for safety
  const quarterKelly = Math.max(0, kelly * 0.25);
  return Math.round(bankroll * quarterKelly);
}

const BankrollManager = () => {
  const { t } = useLanguage();
  const { data, isLoading } = useAllBets();
  const [startingBankroll] = useState(10000);

  const stats = useMemo(() => {
    if (!data) return null;

    const allSettled = [
      ...data.demoBets.filter((b: any) => b.result !== "pending").map((b: any) => ({
        date: b.created_at, result: b.result, stake: Number(b.stake), payout: Number(b.payout), type: "demo",
      })),
      ...data.predictions.filter((p: any) => p.actual_result && p.actual_result !== "pending").map((p: any) => ({
        date: p.created_at, result: p.actual_result, stake: Number(p.stake), payout: Number(p.payout), type: "prediction",
      })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Bankroll curve
    let balance = startingBankroll;
    let peak = balance;
    let maxDrawdown = 0;
    const curve = [{ date: "Start", balance, drawdown: 0 }];

    allSettled.forEach((bet, i) => {
      if (bet.result === "won") balance += bet.payout - bet.stake;
      else balance -= bet.stake;
      if (balance > peak) peak = balance;
      const dd = peak > 0 ? ((peak - balance) / peak) * 100 : 0;
      if (dd > maxDrawdown) maxDrawdown = dd;
      curve.push({
        date: new Date(bet.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
        balance: +balance.toFixed(2),
        drawdown: +dd.toFixed(1),
      });
    });

    // Daily P&L
    const dailyMap = new Map<string, number>();
    allSettled.forEach(bet => {
      const day = new Date(bet.date).toLocaleDateString("en", { month: "short", day: "numeric" });
      const pl = bet.result === "won" ? bet.payout - bet.stake : -bet.stake;
      dailyMap.set(day, (dailyMap.get(day) || 0) + pl);
    });
    const dailyPL = Array.from(dailyMap).map(([day, pl]) => ({ day, pl: +pl.toFixed(0) }));

    const totalStaked = allSettled.reduce((s, b) => s + b.stake, 0);
    const totalPayout = allSettled.reduce((s, b) => s + b.payout, 0);
    const profit = totalPayout - totalStaked;
    const roi = totalStaked > 0 ? (profit / totalStaked) * 100 : 0;
    const won = allSettled.filter(b => b.result === "won").length;
    const winRate = allSettled.length > 0 ? (won / allSettled.length) * 100 : 0;

    // Risk level
    const riskLevel = maxDrawdown > 30 ? "HIGH" : maxDrawdown > 15 ? "MEDIUM" : "LOW";

    // Kelly suggestion for next bet (using average win rate & odds)
    const avgOdds = 1.8;
    const kellySuggestion = kellyStake(balance, winRate / 100, avgOdds);

    return {
      balance, profit, roi, winRate, maxDrawdown, riskLevel,
      totalBets: allSettled.length, won,
      curve, dailyPL, kellySuggestion, peak,
    };
  }, [data, startingBankroll]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading bankroll data...</span>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6 max-w-6xl" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Bankroll <span className="text-primary">Manager</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Smart money management with Kelly Criterion & risk analytics
        </p>
      </motion.div>

      {/* KPIs */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-5 gap-3" variants={stagger}>
        <KPI icon={<Wallet className="w-4 h-4" />} label="Current Bankroll" value={`$${stats?.balance?.toFixed(0) || "10,000"}`} accent={!!stats && stats.balance > startingBankroll} />
        <KPI icon={<TrendingUp className="w-4 h-4" />} label="Total Profit" value={`${(stats?.profit ?? 0) >= 0 ? "+" : ""}$${stats?.profit?.toFixed(0) || "0"}`} accent={(stats?.profit ?? 0) > 0} negative={(stats?.profit ?? 0) < 0} />
        <KPI icon={<Target className="w-4 h-4" />} label="ROI" value={`${(stats?.roi ?? 0) >= 0 ? "+" : ""}${stats?.roi?.toFixed(1) || "0"}%`} accent={(stats?.roi ?? 0) > 0} negative={(stats?.roi ?? 0) < 0} />
        <KPI icon={<AlertTriangle className="w-4 h-4" />} label="Max Drawdown" value={`${stats?.maxDrawdown?.toFixed(1) || "0"}%`} negative={(stats?.maxDrawdown ?? 0) > 15} />
        <KPI
          icon={<Shield className="w-4 h-4" />}
          label="Risk Level"
          value={stats?.riskLevel || "N/A"}
          accent={stats?.riskLevel === "LOW"}
          negative={stats?.riskLevel === "HIGH"}
        />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Bankroll Growth Chart */}
        <motion.div variants={fadeUp} className="xl:col-span-2 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold mb-4">Bankroll Growth</h2>
          {stats && stats.curve.length > 1 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats.curve}>
                <defs>
                  <linearGradient id="bankrollGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199, 90%, 55%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(199, 90%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 18%)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 10%, 50%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215, 10%, 50%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(200, 20%, 12%)", border: "1px solid hsl(200, 15%, 20%)", borderRadius: "10px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="balance" stroke="hsl(199, 90%, 55%)" fill="url(#bankrollGrowth)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
              Place bets to see bankroll growth.
            </div>
          )}
        </motion.div>

        {/* Kelly Calculator + Risk */}
        <motion.div variants={fadeUp} className="space-y-4">
          {/* Kelly Suggestion */}
          <div className="rounded-2xl border border-primary/20 p-5 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, transparent 100%)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Kelly Criterion</span>
            </div>
            <p className="text-3xl font-black">${stats?.kellySuggestion || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Suggested next bet (¼ Kelly)</p>
            <p className="text-[10px] text-muted-foreground mt-2">
              Based on {stats?.winRate?.toFixed(0)}% win rate × avg 1.80 odds
            </p>
          </div>

          {/* Daily P&L */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold mb-3">Daily P&L</h2>
            {stats && stats.dailyPL.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={stats.dailyPL}>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(215, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(200, 20%, 12%)", border: "1px solid hsl(200, 15%, 20%)", borderRadius: "10px", fontSize: "12px" }} />
                  <Bar dataKey="pl" radius={[4, 4, 0, 0]}>
                    {stats.dailyPL.map((d, i) => (
                      <Cell key={i} fill={d.pl >= 0 ? "hsl(160, 60%, 45%)" : "hsl(0, 70%, 50%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No daily data yet.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Risk Alerts */}
      {stats && stats.maxDrawdown > 15 && (
        <motion.div
          variants={fadeUp}
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-destructive">Risk Alert: High Drawdown Detected</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your bankroll has experienced a {stats.maxDrawdown.toFixed(1)}% drawdown from peak (${stats.peak.toFixed(0)}).
              Consider reducing stake sizes until you recover. The Kelly Criterion suggests ${stats.kellySuggestion} per bet.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

function KPI({ icon, label, value, accent, negative }: {
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

export default BankrollManager;
