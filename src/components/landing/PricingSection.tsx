import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    features: ["Limited predictions", "Basic stats", "Community insights"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: 19,
    yearly: 15,
    features: ["Full AI predictions", "Map veto simulator", "Odds comparison", "Match breakdowns"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Elite",
    monthly: 49,
    yearly: 39,
    features: ["Early predictions", "Advanced analytics", "Value bet detection", "API access"],
    cta: "Go Elite",
    highlight: false,
  },
];

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 relative">
      <div className="neon-line mb-24" />
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Choose Your <span className="text-gradient">Edge</span>
          </h2>
          <p className="text-muted-foreground mb-8">Unlock the full power of AI-driven CS2 analysis.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-surface rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!yearly ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${yearly ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Yearly <span className="text-xs opacity-70">(-20%)</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-6 border transition-all ${
                plan.highlight
                  ? "bg-card border-primary/40 glow-blue scale-105"
                  : "bg-card border-border/50"
              }`}
            >
              <h3 className="font-display font-bold text-lg mb-1">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-display font-black">
                  ${yearly ? plan.yearly : plan.monthly}
                </span>
                {plan.monthly > 0 && <span className="text-muted-foreground text-sm">/mo</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-neon-green flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.highlight ? "bg-gradient-primary hover:opacity-90" : ""}`}
                variant={plan.highlight ? "default" : "outline"}
                asChild
              >
                <Link to="/register">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
