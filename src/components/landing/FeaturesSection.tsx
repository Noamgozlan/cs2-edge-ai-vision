import { motion } from "framer-motion";
import { Search, BrainCircuit, Activity, Zap, Shield, Target } from "lucide-react";

const features = [
  {
    title: "Real-time odds engine",
    description: "Compare live lines across 12+ major bookmakers instantly to find the best value before lines move.",
    icon: Activity,
    colSpan: "lg:col-span-2",
  },
  {
    title: "AI match analysis",
    description: "Deep learning models evaluate team form, map vetos, and head-to-head history.",
    icon: BrainCircuit,
    colSpan: "lg:col-span-1",
  },
  {
    title: "Player prop tracking",
    description: "Identify over/under edges using historical KPR, opening kill success, and map-specific performance.",
    icon: Target,
    colSpan: "lg:col-span-1",
  },
  {
    title: "Market alerts",
    description: "Get notified when high-value opportunities or significant line movements occur.",
    icon: Zap,
    colSpan: "lg:col-span-2",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-landing-display text-3xl text-white sm:text-4xl">
            Everything you need for an edge
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-white/[0.45]">
            Stop jumping between HLTV and five different bookmakers. CS2Edge aggregates
            everything into a single, high-performance terminal.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`landing-surface group flex flex-col justify-between rounded-2xl p-6 transition-colors hover:bg-white/[0.04] ${feature.colSpan}`}
            >
              <div>
                <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-black/20 text-white/[0.55] transition-colors group-hover:bg-[hsl(221,83%,58%)]/[0.08] group-hover:text-[hsl(221,83%,65%)] group-hover:border-[hsl(221,83%,58%)]/20">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/[0.45]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
