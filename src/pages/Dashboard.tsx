import { motion } from "framer-motion";
import { Swords, Brain, TrendingUp, Gem } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const recentPredictions = [
  { match: "M80 vs Team Liquid", bet: "M80 ML", odds: "1.82", confidence: 72, result: "pending" },
  { match: "G2 vs FaZe", bet: "G2 ML", odds: "1.55", confidence: 81, result: "won" },
  { match: "NAVI vs Vitality", bet: "Vitality +1.5", odds: "1.65", confidence: 68, result: "won" },
  { match: "Cloud9 vs Heroic", bet: "Heroic ML", odds: "2.10", confidence: 59, result: "lost" },
  { match: "MOUZ vs Astralis", bet: "MOUZ ML", odds: "1.45", confidence: 85, result: "won" },
];

const Dashboard = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t("dash.todayMatches"), value: "8", icon: Swords, change: "+3 from yesterday" },
    { label: t("dash.activePredictions"), value: "12", icon: Brain, change: "5 pending results" },
    { label: t("dash.winRate"), value: "73.2%", icon: TrendingUp, change: "+2.1% this week" },
    { label: t("dash.bestValue"), value: "2.45x", icon: Gem, change: "M80 vs Liquid" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("dash.dashboard")}</h1>
        <p className="text-sm text-muted-foreground">{t("dash.overview")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card border border-border p-5"
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

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold">{t("dash.recentPredictions")}</h2>
        </div>
        <div className="divide-y divide-border">
          {recentPredictions.map((p) => (
            <div key={p.match} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors">
              <div>
                <p className="text-sm font-medium">{p.match}</p>
                <p className="text-xs text-muted-foreground">{p.bet} @ {p.odds}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{p.confidence}%</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  p.result === "won" ? "bg-accent/10 text-accent" :
                  p.result === "lost" ? "bg-destructive/10 text-destructive" :
                  "bg-primary/10 text-primary"
                }`}>
                  {t(`common.${p.result}` as any)}
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
