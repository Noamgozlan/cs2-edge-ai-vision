import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Standard",
    price: { monthly: 0, yearly: 0 },
    period: "Lifetime",
    color: "text-muted-foreground",
    features: [
      "3 Tactical Simulations / Day",
      "Public Intel Feed",
      "Basic Performance Logs",
    ],
    cta: "Establish Link",
    highlight: false,
  },
  {
    name: "Pro Edge",
    price: { monthly: 19, yearly: 15 },
    period: "Monthly",
    color: "text-primary",
    badge: "Operational Choice",
    features: [
      "Unlimited Veto Simulations",
      "75% Confidence Tier Access",
      "Real-time Arbitrage Tools",
      "Encrypted Discord Alerts",
    ],
    cta: "Initialize Protocol",
    highlight: true,
  },
  {
    name: "Syndicate",
    price: { monthly: 49, yearly: 39 },
    period: "Monthly",
    color: "text-accent",
    features: [
      "Everything in Pro Access",
      "Ultra-High Confidence (90%+)",
      "Private API Deployment",
      "Custom Strategy Modeling",
    ],
    cta: "Join Syndicate",
    highlight: false,
  },
];

const PricingSection = () => {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="py-32 bg-background">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-primary text-[11px] font-black uppercase tracking-[0.5em] mb-4">The Selection</h2>
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Choose Your <span className="italic text-primary">Weapon</span>
          </h3>

          <div className="mt-12 flex items-center justify-center gap-6">
            <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className="w-16 h-8 rounded-full bg-muted border border-border p-1 relative flex items-center transition-all"
            >
              <div className={`w-6 h-6 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary)/0.5)] transition-transform ${yearly ? "translate-x-8" : "translate-x-0"}`} />
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
                Yearly Deployment
              </span>
              <span className="px-3 py-1 bg-destructive/20 text-destructive text-[9px] font-black uppercase tracking-widest rounded-full">
                Save 25%
              </span>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-12 flex flex-col transition-all relative ${
                plan.highlight
                  ? "bg-card border-x-2 border-primary md:scale-105 z-20 shadow-[0_0_50px_hsl(0_0%_0%/0.5)]"
                  : "bg-card border border-border group hover:bg-muted/30"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em]">
                  {plan.badge}
                </div>
              )}

              <h4 className={`text-xl font-bold mb-2 uppercase tracking-tight ${plan.color}`}>
                {plan.name}
              </h4>
              <div className="mb-12">
                <span className="text-5xl font-black italic">
                  ${yearly ? plan.price.yearly : plan.price.monthly}
                </span>
                <span className="text-muted-foreground text-sm font-bold ml-1">
                  / {plan.price.monthly === 0 ? "LIFETIME" : plan.period.toUpperCase()}
                </span>
              </div>

              <ul className="space-y-6 mb-16 flex-grow">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest ${plan.highlight ? "text-foreground" : "text-muted-foreground"}`}>
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-primary" : plan.color === "text-accent" ? "text-accent" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`w-full py-5 text-center text-[11px] font-black uppercase tracking-widest transition-all block ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                    : plan.color === "text-accent"
                    ? "border border-border hover:bg-accent hover:text-accent-foreground hover:border-accent"
                    : "border border-border hover:bg-foreground hover:text-background"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
