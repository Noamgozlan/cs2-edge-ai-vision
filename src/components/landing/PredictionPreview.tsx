import { motion } from "framer-motion";
import { ArrowUpRight, Boxes, NotebookTabs, SearchCheck, Zap } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: SearchCheck,
    title: "Open a live match",
    body: "Start from today’s board and jump into any series with team context, status, and current market pricing already prepared.",
  },
  {
    number: "02",
    icon: NotebookTabs,
    title: "Compare the edge",
    body: "Check AI analysis, predicted veto flow, player form, and bookmaker pricing side by side instead of opening five different tools.",
  },
  {
    number: "03",
    icon: Boxes,
    title: "Move with confidence",
    body: "Take the best line, save the bet, and keep the rationale attached so your workflow stays disciplined over time.",
  },
];

const PredictionPreview = () => {
  return (
    <section id="workflow" className="relative border-t border-white/7 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="landing-section-label text-xs font-semibold uppercase">As Simple As It Gets</p>
              <h2 className="font-landing-display mt-4 text-4xl font-semibold text-white sm:text-5xl">
                Start your edge in a few clean steps.
              </h2>
              <p className="mt-5 max-w-[56ch] text-base leading-8 text-white/60">
                This section borrows the strongest part of the reference flow: clear onboarding structure with polished depth,
                without turning your product into a generic clone.
              </p>
            </motion.div>

            <div className="mt-10 space-y-4">
              {steps.map((step, index) => (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="landing-surface rounded-[24px] p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                      <step.icon className="h-5 w-5 text-[#a7bbff]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono-data text-sm font-semibold text-white/40">{step.number}</span>
                        <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white/58">{step.body}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <motion.div
            id="predictions"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="landing-surface-strong rounded-[30px] p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-white/7 bg-black/16 px-4 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/38">Live preview</p>
                <p className="mt-1 text-lg font-semibold text-white">A landing experience that now feels product-grade</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm font-medium text-white/72">
                <Zap className="h-4 w-4 text-[#9fb7ff]" />
                Refined motion and hierarchy
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
              <div className="landing-surface rounded-[24px] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">Match board</p>
                    <p className="mt-1 text-sm font-semibold text-white">Monday slate · 12 live and upcoming spots</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold text-white/64">
                    Updated 2m ago
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    { match: "Vitality vs Spirit", lean: "Vitality ML", confidence: "82%" },
                    { match: "FaZe vs G2", lean: "Over 2.5 Maps", confidence: "76%" },
                    { match: "MOUZ NXT vs CYBERSHOKE", lean: "Best odds compare", confidence: "68%" },
                  ].map((row, index) => (
                    <div
                      key={row.match}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${
                        index === 0 ? "border-[#4d7cff]/20 bg-[#4d7cff]/10" : "border-white/7 bg-white/[0.03]"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{row.match}</p>
                        <p className="mt-1 text-xs text-white/48">{row.lean}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono-data text-xl font-semibold text-white">{row.confidence}</p>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-white/36">confidence</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="landing-surface rounded-[24px] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">Reasoning panel</p>
                  <p className="mt-3 text-lg font-semibold text-white">Every recommendation ships with the “why”.</p>
                  <p className="mt-3 text-sm leading-7 text-white/56">
                    The new landing preview leans into argument quality, bookmaker context, and map-level explanation so the product feels serious before login.
                  </p>
                </div>

                <div className="landing-surface rounded-[24px] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">Action layer</p>
                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/7 bg-white/[0.03] px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Open the full dashboard</p>
                      <p className="mt-1 text-xs text-white/48">See predictions, odds compare, and prop depth.</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-[#a7bbff]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PredictionPreview;
