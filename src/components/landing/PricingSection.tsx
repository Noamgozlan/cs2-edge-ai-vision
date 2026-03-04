import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    desc: "Get started with basic predictions",
    features: [
      "3 AI predictions per day",
      "Basic match analysis",
      "Community insights",
      "Public odds comparison",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: { monthly: 19.99, yearly: 14.99 },
    desc: "Unlock the full AI advantage",
    badge: "Most Popular",
    features: [
      "Unlimited AI predictions",
      "Smart bet recommendations",
      "Player prop analysis",
      "Map veto simulations",
      "Real-time HLTV data",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Elite",
    price: { monthly: 49.99, yearly: 39.99 },
    desc: "For professional bettors",
    features: [
      "Everything in Pro",
      "90%+ confidence alerts",
      "Custom strategy models",
      "API access",
      "Dedicated analyst",
    ],
    cta: "Contact Us",
    highlight: false,
  },
];

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-28 bg-background relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Choose Your <span className="text-primary">Edge</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Start free, upgrade when you're ready for unlimited AI-powered predictions.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold transition-colors ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <button
                onClick={() => setYearly(!yearly)}
                className="w-14 h-7 rounded-full bg-muted border border-border p-1 relative flex items-center"
              >
                <div className={`w-5 h-5 bg-primary rounded-full shadow-md transition-transform ${yearly ? "translate-x-7" : "translate-x-0"}`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold transition-colors ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
                  Yearly
                </span>
                <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  Save 25%
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl p-7 flex flex-col transition-all ${
                plan.highlight
                  ? "bg-card border-2 border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                  : "bg-card border border-border hover:border-primary/30"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                  <Crown className="w-3 h-3" /> {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h4 className={`text-lg font-bold mb-1 ${plan.highlight ? "text-primary" : ""}`}>
                  {plan.name}
                </h4>
                <p className="text-sm text-muted-foreground">{plan.desc}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-black">
                  ${yearly ? plan.price.yearly : plan.price.monthly}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {plan.price.monthly === 0 ? "" : "/mo"}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-primary" : "text-accent"}`} />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`w-full py-3.5 rounded-xl text-center text-sm font-bold transition-all block ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20"
                    : "border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground"
                }`}
              >
                {plan.highlight && <Zap className="w-4 h-4 inline mr-2 -mt-0.5" />}
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
