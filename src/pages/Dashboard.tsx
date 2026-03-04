import { motion } from "framer-motion";
import { Swords, Brain, TrendingUp, Gem } from "lucide-react";

const stats = [
  { label: "Today's Matches", value: "8", icon: Swords, change: "+3 from yesterday" },
  { label: "Active Predictions", value: "12", icon: Brain, change: "5 pending results" },
  { label: "Win Rate", value: "73.2%", icon: TrendingUp, change: "+2.1% this week" },
  { label: "Best Value Bet", value: "2.45x", icon: Gem, change: "M80 vs Liquid" },
];

const recentPredictions = [
  { match: "M80 vs Team Liquid", bet: "M80 ML", odds: "1.82", confidence: 72, result: "pending" },
  { match: "G2 vs FaZe", bet: "G2 ML", odds: "1.55", confidence: 81, result: "won" },
  { match: "NAVI vs Vitality", bet: "Vitality +1.5", odds: "1.65", confidence: 68, result: "won" },
  { match: "Cloud9 vs Heroic", bet: "Heroic ML", odds: "2.10", confidence: 59, result: "lost" },
  { match: "MOUZ vs Astralis", bet: "MOUZ ML", odds: "1.45", confidence: 85, result: "won" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your AI-powered betting overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card border border-border/50 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-display font-bold">{s.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent predictions */}
      <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h2 className="font-display font-bold">Recent Predictions</h2>
        </div>
        <div className="divide-y divide-border/50">
          {recentPredictions.map((p) => (
            <div key={p.match} className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-hover transition-colors">
              <div>
                <p className="text-sm font-medium">{p.match}</p>
                <p className="text-xs text-muted-foreground">{p.bet} @ {p.odds}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{p.confidence}%</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  p.result === "won" ? "bg-neon-green/10 text-neon-green" :
                  p.result === "lost" ? "bg-destructive/10 text-destructive" :
                  "bg-primary/10 text-primary"
                }`}>
                  {p.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
