import { useState } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Standard",
    description: "Essential analytics for casual bettors.",
    monthlyPrice: 19,
    yearlyPrice: 15,
    popular: false,
    features: ["Basic match predictions", "Live odds from 3 books", "Daily summary email"],
  },
  {
    name: "Pro",
    description: "Advanced intelligence for serious traders.",
    monthlyPrice: 49,
    yearlyPrice: 39,
    popular: true,
    features: [
      "Deep AI match analysis",
      "All 12+ bookmaker odds",
      "Player prop edge detection",
      "Real-time Discord alerts",
      "Priority email support",
    ],
  },
];

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-landing-display text-3xl text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-white/[0.45]">
            Start finding better lines immediately. Cancel anytime.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-10 flex justify-center">
          <div className="relative flex items-center rounded-full border border-white/[0.06] bg-black/20 p-1">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`relative z-10 w-28 rounded-full py-1.5 text-xs font-semibold transition-colors ${
                !isYearly ? "text-white" : "text-white/[0.45] hover:text-white/[0.7]"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`relative z-10 w-28 rounded-full py-1.5 text-xs font-semibold transition-colors ${
                isYearly ? "text-white" : "text-white/[0.45] hover:text-white/[0.7]"
              }`}
            >
              Yearly
            </button>
            {/* Animated pill background */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute left-1 top-1 bottom-1 w-28 rounded-full border border-white/[0.08] bg-white/[0.04]"
              animate={{ x: isYearly ? 112 : 0 }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto mt-14 grid max-w-md gap-6 lg:max-w-none lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 ${
                plan.popular ? "landing-surface-strong" : "landing-surface"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 inset-x-0 mx-auto flex w-max items-center rounded-full border border-[hsl(221,83%,58%)]/20 bg-[hsl(221,83%,58%)]/[0.1] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[hsl(221,83%,68%)]">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-white/[0.45]">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="font-mono-data text-4xl font-bold text-white">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-sm font-medium text-white/[0.45]">/month</span>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/[0.6]">
                    <Check className="h-4 w-4 flex-shrink-0 text-[hsl(221,83%,65%)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`w-full rounded-xl py-3 text-center text-[13px] font-semibold transition-colors ${
                  plan.popular
                    ? "landing-primary-button"
                    : "landing-outline-button"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
