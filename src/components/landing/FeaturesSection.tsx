import { motion } from "framer-motion";
import { Brain, Map, TrendingUp, Timer, BarChart3, Crosshair } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Match Predictions",
    desc: "Deep learning models trained on 10+ years of pro match data deliver probability-weighted predictions across all bet types.",
    stat: "73.2%",
    statLabel: "Accuracy",
  },
  {
    icon: Map,
    title: "Map Veto Simulation",
    desc: "Predict ban/pick sequences with map-specific win rate analysis and team preference modeling.",
    stat: "92%",
    statLabel: "Veto Accuracy",
  },
  {
    icon: TrendingUp,
    title: "Smart Bet Discovery",
    desc: "Beyond match winner — the AI evaluates player props, handicaps, round totals, and more to find the highest-EV play.",
    stat: "+14%",
    statLabel: "Avg. EV",
  },
  {
    icon: Timer,
    title: "Real-Time HLTV Data",
    desc: "Live-scraped stats from HLTV ensure every prediction uses the latest player form, roster changes, and results.",
    stat: "< 5min",
    statLabel: "Data Freshness",
  },
  {
    icon: BarChart3,
    title: "Odds Comparison",
    desc: "Aggregated lines across major bookmakers so you always know where the best value sits before placing.",
    stat: "6+",
    statLabel: "Bookmakers",
  },
  {
    icon: Crosshair,
    title: "Player Prop Insights",
    desc: "Kill lines, impact ratings, and opening duel stats power per-player betting recommendations with precision.",
    stat: "50+",
    statLabel: "Stats Per Player",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-28 bg-background relative overflow-hidden">
    {/* Subtle background accent */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

    <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative">
      {/* Header */}
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Built for{" "}
            <span className="text-primary">Serious</span> Bettors
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Every tool you need to find value, validate your reads, and make smarter CS2 bets — powered by real data and neural networks.
          </p>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group relative rounded-2xl border border-border bg-card p-7 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            {/* Icon */}
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
              <f.icon className="w-5 h-5 text-primary" />
            </div>

            {/* Content */}
            <h4 className="text-base font-bold mb-2">{f.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{f.desc}</p>

            {/* Stat pill */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-primary">{f.stat}</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{f.statLabel}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
