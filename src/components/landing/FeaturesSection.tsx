import { motion } from "framer-motion";
import { Brain, Map, TrendingUp, Timer, BarChart3, Bell } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Predictions",
    desc: "Advanced outcome probabilities calculated using deep learning models trained on 10 years of pro demos.",
  },
  {
    icon: Map,
    title: "Veto Simulation",
    desc: "Predict team pick/ban behavior with 92% accuracy. Dominate the map selection phase before the match begins.",
  },
  {
    icon: TrendingUp,
    title: "Odds Arbitrage",
    desc: "Real-time discrepancy detection across global markets to find maximum value and locked-in profits.",
  },
  {
    icon: Timer,
    title: "Zero Latency",
    desc: "Direct feed from official tournament servers ensures you have the numbers before the broadcast delay.",
  },
  {
    icon: BarChart3,
    title: "Match Breakdown",
    desc: "Deep-dive technical analysis into player form, utility efficiency, and tactical tendencies.",
  },
  {
    icon: Bell,
    title: "Direct Alerts",
    desc: "Customizable high-priority push notifications for line movements or system-calculated value bets.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-32 border-y border-border/50 bg-background">
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div>
          <h2 className="text-primary text-[11px] font-black uppercase tracking-[0.4em] mb-4">
            Tactical Intelligence
          </h2>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Beyond Human{" "}
            <span className="italic text-muted-foreground">Intuition</span>
          </h3>
        </div>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          Our neural networks analyze 500k+ data points per match to give you an unfair advantage in every engagement.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group p-10 bg-card hover:bg-muted/30 transition-all relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
              <f.icon className="w-24 h-24" />
            </div>
            <div className="w-10 h-[2px] bg-primary mb-8 group-hover:w-20 transition-all duration-500" />
            <h4 className="text-xl font-bold mb-4 uppercase tracking-tight">{f.title}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
