import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  WalletCards,
  BadgeCheck,
  LineChart,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

const trustPills = [
  "HLTV-backed analysis",
  "Live odds comparison",
  "Player props & map reads",
];

const heroStats = [
  { label: "Markets tracked", value: "48+" },
  { label: "Daily sync cycles", value: "288" },
  { label: "Avg. edge surfaced", value: "+12.4%" },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      {/* Subtle background glow — restrained */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-[hsl(221,83%,58%)]/[0.06] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28 w-full">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

          {/* Left: Copy */}
          <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-xl">
            {/* Eyebrow */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/[0.50]"
            >
              <Sparkles className="h-3 w-3 text-[hsl(221,83%,68%)]" />
              The sharper way to trade CS2 match markets
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-landing-display text-[2.75rem] leading-[1.05] text-white sm:text-[3.5rem] lg:text-[4rem]"
            >
              Secure. Precise.{" "}
              <span className="text-white/[0.55]">Built for profit.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-[50ch] text-[15px] leading-7 text-white/[0.45]"
            >
              CS2Edge turns live CS2 data into bookmaker-ready conviction — cleaner market
              comparison, stronger player prop analysis, and premium match intelligence.
            </motion.p>

            {/* CTA row */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/register"
                className="landing-primary-button inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
              >
                Create your workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard/predictions"
                className="landing-outline-button inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium"
              >
                View live predictions
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {trustPills.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-white/[0.40]"
                >
                  <BadgeCheck className="h-3.5 w-3.5 text-[hsl(221,83%,68%)]" />
                  {item}
                </span>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 grid gap-3 sm:grid-cols-3"
            >
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <p className="font-mono-data text-xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-white/[0.35]">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[36rem]"
          >
            <div className="landing-surface-strong rounded-2xl p-4 sm:p-5">
              {/* Match header */}
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-white/[0.30]">Today's board</p>
                  <p className="mt-0.5 text-sm font-medium text-white">MOUZ NXT vs CYBERSHOKE</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Main analysis */}
                <div className="landing-surface rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-white/[0.30]">Primary read</p>
                      <h3 className="mt-1.5 font-landing-display text-lg text-white">Vitality ML</h3>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-right">
                      <p className="text-[10px] text-white/[0.30]">Confidence</p>
                      <p className="font-mono-data text-xl font-semibold text-white">84%</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {[
                      { icon: ShieldCheck, label: "Map pool", value: "Mirage / Nuke" },
                      { icon: LineChart, label: "Edge", value: "+11.8% EV" },
                      { icon: WalletCards, label: "Best line", value: "1.93 Pinnacle" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="rounded-lg border border-white/[0.06] bg-black/15 p-3">
                        <div className="flex items-center gap-1.5 text-white/[0.30]">
                          <Icon className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
                        </div>
                        <p className="mt-2.5 text-[13px] font-medium text-white">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Model split bar */}
                  <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/15 p-3">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-white/[0.40]">
                      <span>Vitality 56%</span>
                      <span>MOUZ NXT 44%</span>
                    </div>
                    <div className="flex h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "56%" }}
                        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-[hsl(221,83%,58%)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-3">
                  {/* Odds compare */}
                  <div className="landing-surface rounded-xl p-3.5">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-white/[0.30]">Odds compare</p>
                    <div className="mt-3 space-y-2">
                      {[
                        { book: "Pinnacle", t1: "1.93", best: true },
                        { book: "GG.BET", t1: "1.91", best: false },
                        { book: "Thunderpick", t1: "1.88", best: false },
                      ].map((row) => (
                        <div
                          key={row.book}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                            row.best
                              ? "border border-[hsl(221,83%,58%)]/20 bg-[hsl(221,83%,58%)]/[0.06]"
                              : "border border-white/[0.04] bg-white/[0.02]"
                          }`}
                        >
                          <span className="text-xs font-medium text-white/[0.65]">{row.book}</span>
                          <span className="font-mono-data text-sm font-semibold text-white">{row.t1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Player spotlight */}
                  <div className="landing-surface rounded-xl p-3.5">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-white/[0.30]">Player spotlight</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-xs font-bold text-white">
                        Zy
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-medium text-white">ZywOo over 19.5</p>
                          <TrendingUp className="h-3 w-3 text-emerald-400" />
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/[0.35]">Role matchup, KPR trend, favorable maps.</p>
                      </div>
                    </div>
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

export default HeroSection;
