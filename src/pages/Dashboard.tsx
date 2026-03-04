import { motion } from "framer-motion";
import { Calendar, Sparkles, TrendingUp, CheckCircle, Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const recentPredictions = [
  { match: "NAVI vs Vitality", event: "IEM Cologne • Starts in 2h", prob: "64.2%", status: "value", probColor: "text-primary" },
  { match: "G2 vs FaZe Clan", event: "ESL Pro League • Starts in 4h", prob: "51.8%", status: "neutral", probColor: "text-muted-foreground" },
];

const Dashboard = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t("dash.todayMatches"), value: "24", icon: Calendar, change: "+5%", positive: true },
    { label: t("dash.activePredictions"), value: "18", icon: Sparkles, change: "+2%", positive: true },
    { label: t("dash.winRate"), value: "68.5%", icon: TrendingUp, change: "-1.2%", positive: false },
    { label: t("dash.bestValue"), value: "+12.4%", icon: CheckCircle, change: "+4.5%", positive: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Welcome back, Analyst</h1>
        <p className="text-muted-foreground max-w-2xl">Real-time CS2 AI insights and match projections for the current competitive season.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-6 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.positive ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                {s.change}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">{s.label}</p>
            <h3 className="text-3xl font-black">{s.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Performance Chart */}
          <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold">Performance Analytics</h2>
                <p className="text-sm text-muted-foreground">Prediction accuracy vs Market odds (Last 7 Days)</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold rounded bg-primary text-primary-foreground">Win Rate</button>
                <button className="px-3 py-1 text-xs font-bold rounded border border-border text-muted-foreground">ROI</button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[40, 60, 55, 80, 70, 45, 90].map((h, i) => (
                <div key={i} className="w-full bg-primary/10 rounded-t relative group" style={{ height: `${h}%` }}>
                  <div className="bg-primary/40 group-hover:bg-primary transition-all w-full rounded-t" style={{ height: `${h * 0.8}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </section>

          {/* Upcoming Predictions */}
          <section className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold">Upcoming Predictions</h2>
              <a className="text-sm text-primary font-bold hover:underline" href="#">View All</a>
            </div>
            <div className="divide-y divide-border">
              {recentPredictions.map((p) => (
                <div key={p.match} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-bold">{p.match}</p>
                    <p className="text-xs text-muted-foreground">{p.event}</p>
                  </div>
                  <div className="flex items-center gap-8 text-right">
                    <div className="hidden sm:block">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">AI Probability</p>
                      <p className={`text-lg font-black ${p.probColor}`}>{p.prob}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold text-sm border ${
                      p.status === "value" ? "bg-accent/10 text-accent border-accent/20" : "bg-muted text-muted-foreground border-border"
                    }`}>
                      {p.status === "value" ? "Value Pick" : "Neutral"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Side Widgets */}
        <div className="space-y-8">
          <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Best Value Today</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg p-4 bg-primary/10 border border-primary/20">
                <p className="text-[10px] font-black text-primary uppercase mb-1">High Confidence</p>
                <p className="text-sm font-bold mb-3">Cloud9 to win Map 2</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Odd: 1.85</span>
                  <span className="text-xl font-black text-primary">+14.2% EV</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted border border-border">
                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Medium Confidence</p>
                <p className="text-sm font-bold mb-3">MOUZ vs Spirit Over 2.5 Maps</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Odd: 2.10</span>
                  <span className="text-lg font-black">+8.5% EV</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Bookmaker Edge</h2>
            <div className="space-y-4">
              {[
                { name: "Bet365", pct: 75 },
                { name: "Pinnacle", pct: 92 },
                { name: "DraftKings", pct: 64 },
              ].map((b) => (
                <div key={b.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-muted" />
                    <span className="text-xs font-bold">{b.name}</span>
                  </div>
                  <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${b.pct}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{b.pct}% Matches</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
