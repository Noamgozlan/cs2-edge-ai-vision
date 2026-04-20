import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, Sparkles, Star, Gem, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    icon: Sparkles,
    monthly: 0,
    yearly: 0,
    description: "For testing the workflow and checking the daily slate.",
    badge: "",
    highlight: false,
    accent: "#6b8cff",
    features: [
      "3 AI analyses per day",
      "Basic odds comparison",
      "Public match board access",
      "Limited player prop preview",
    ],
    cta: "Start free",
    ctaPath: "/register",
  },
  {
    name: "Pro",
    icon: Crown,
    monthly: 19.99,
    yearly: 14.99,
    description: "For bettors who want the full product working every day.",
    badge: "Most Popular",
    highlight: true,
    accent: "#4d7cff",
    features: [
      "Unlimited AI analysis",
      "Betting Compare tab and book links",
      "Player prop and map veto depth",
      "Live data sync and faster updates",
      "Saved bets and smarter workflow",
    ],
    cta: "Start Pro",
    ctaPath: "/register",
  },
  {
    name: "Elite",
    icon: Gem,
    monthly: 49.99,
    yearly: 39.99,
    description: "For serious operators who need the deepest edge and priority support.",
    badge: "",
    highlight: false,
    accent: "#2bd0b0",
    features: [
      "Everything in Pro",
      "Higher-priority model access",
      "Premium market alerts",
      "Advanced props coverage",
      "Dedicated support lane",
    ],
    cta: "Contact sales",
    ctaPath: "/login",
  },
];

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <section id="pricing" className="relative border-t border-white/6 py-24 sm:py-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 h-80 w-[700px] rounded-full bg-[#4d7cff]/7 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="landing-section-label text-xs font-semibold uppercase">Pricing</p>
          <h2
            className="font-landing-display mt-4 text-4xl font-semibold sm:text-5xl"
            style={{
              background: "linear-gradient(135deg, #ffffff 40%, #9fb7ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Transparent pricing that feels as premium as the product.
          </h2>
          <p className="mx-auto mt-5 max-w-[60ch] text-base leading-8 text-white/52">
            One workspace, full clarity. No hidden fees, no confusing tiers.
          </p>

          {/* Billing toggle */}
          <div
            className="mt-8 inline-flex items-center rounded-2xl border border-white/10 bg-white/4 p-1"
            role="group"
            aria-label="Billing cycle"
          >
            <div className="relative flex">
              {/* Animated slider */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={billingCycle}
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    left: billingCycle === "monthly" ? 0 : "50%",
                    right: billingCycle === "yearly" ? 0 : "50%",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`relative z-10 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                  billingCycle === "monthly" ? "text-white" : "text-white/45"
                }`}
                aria-pressed={billingCycle === "monthly"}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`relative z-10 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                  billingCycle === "yearly" ? "text-white" : "text-white/45"
                }`}
                aria-pressed={billingCycle === "yearly"}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Save badge */}
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-white/50">
            <Star className="h-3.5 w-3.5 text-[#9fb7ff]" />
            Save 25% with annual billing
          </div>
        </motion.div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 xl:grid-cols-3">
          {plans.map((plan, index) => {
            const price = billingCycle === "yearly" ? plan.yearly : plan.monthly;

            return (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="relative overflow-hidden rounded-[26px] p-6 sm:p-7"
                style={
                  plan.highlight
                    ? {
                        background: "linear-gradient(180deg, rgba(22,28,44,0.97) 0%, rgba(12,16,28,0.97) 100%)",
                        border: `1px solid rgba(77,124,255,0.35)`,
                        boxShadow: `0 0 0 1px rgba(77,124,255,0.15), 0 32px 80px rgba(77,124,255,0.18), 0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)`,
                      }
                    : {
                        background: "linear-gradient(180deg, rgba(14,18,28,0.92) 0%, rgba(9,12,18,0.92) 100%)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                      }
                }
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div
                    className="absolute -top-px left-6 rounded-b-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{
                      background: "linear-gradient(135deg, #6b8cff, #4d7cff)",
                      color: "#fff",
                      boxShadow: "0 4px 16px rgba(77,124,255,0.4)",
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Card top glow for highlighted */}
                {plan.highlight && (
                  <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-[#4d7cff]/15 blur-3xl" />
                )}

                {/* Icon + name */}
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
                      style={{ background: plan.accent + "18" }}
                    >
                      <plan.icon className="h-5 w-5" style={{ color: plan.accent }} />
                    </div>
                    <h3 className="mt-6 font-landing-display text-3xl font-semibold text-white">{plan.name}</h3>
                    <p className="mt-3 max-w-[34ch] text-sm leading-7 text-white/52">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-8 flex items-end gap-2 border-b border-white/8 pb-6">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${plan.name}-${billingCycle}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="font-landing-display text-5xl font-semibold text-white"
                    >
                      {price === 0 ? "$0" : `$${price}`}
                    </motion.span>
                  </AnimatePresence>
                  <span className="pb-2 text-sm font-medium text-white/40">
                    {price === 0 ? "forever" : "/month"}
                  </span>
                </div>

                {/* Features list */}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-7 text-white/65">
                      <span
                        className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ background: plan.accent + "20" }}
                      >
                        <Check className="h-3.5 w-3.5" style={{ color: plan.accent }} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="mt-8">
                  <Link
                    to={plan.ctaPath}
                    className="inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-semibold transition-shadow"
                    style={
                      plan.highlight
                        ? {
                            background: "linear-gradient(135deg, #6b8cff 0%, #4d7cff 55%, #3968f6 100%)",
                            color: "#fff",
                            boxShadow: "0 0 24px rgba(77,124,255,0.4)",
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            color: "rgba(255,255,255,0.75)",
                            border: "1px solid rgba(255,255,255,0.09)",
                          }
                    }
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
