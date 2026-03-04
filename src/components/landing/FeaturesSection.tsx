import { motion } from "framer-motion";
import { Brain, Map, TrendingUp, Radio, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Match Predictions",
    description: "Advanced machine learning models analyze team performance, map pools, and player stats.",
  },
  {
    icon: Map,
    title: "Map Veto Simulation",
    description: "Predicts bans and picks based on team history and map win rates.",
  },
  {
    icon: TrendingUp,
    title: "Odds Comparison",
    description: "Shows odds across multiple betting sites to find value bets.",
  },
  {
    icon: Radio,
    title: "Real-Time Data",
    description: "Pulls live match data, rankings, player statistics, and recent form.",
  },
  {
    icon: Shield,
    title: "Pro-Level Analysis",
    description: "Detailed breakdown explaining WHY a bet is recommended.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="neon-line mb-24" />
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="text-gradient">Cutting-Edge</span> Features
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to make smarter CS2 betting decisions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:glow-blue"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
