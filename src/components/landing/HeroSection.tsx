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
  animate: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 min-h-[92vh] flex items-center">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[700px] rounded-full bg-[#4d7cff]/14 blur-[120px]" />
        <div className="absolute top-20 right-[8%] h-[300px] w-[400px] rounded-full bg-[#2bd0b0]/8 blur-[80px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28 w-full">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">

          {/* Left: Copy */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-2xl"
          >
            {/* Eyebrow pill */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#4d7cff]/20 text-[#9fb7ff]">
                <Sparkles className="h-3 w-3" />
              </span>
              The sharper way to trade CS2 match markets
            </motion.div>

            {/* H1 with gradient */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
              className="font-landing-display max-w-[13ch] text-[3rem] font-semibold leading-[0.93] sm:text-[4.3rem] lg:text-[5rem]"
              style={{
                background: "linear-gradient(135deg, #ffffff 30%, #9fb7ff 70%, #c2d0ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Secure. Precise. Built for profit.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[58ch] text-base leading-8 text-white/55 sm:text-lg"
            >
              Gozlan BETS turns live CS2 data into bookmaker-ready conviction — cleaner market
              comparison, stronger player prop analysis, and premium match intelligence that feels
              closer to a trading desk than a tip sheet.
            </motion.p>

            {/* CTA row */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6b8cff] to-[#4d7cff] px-7 py-4 text-sm font-semibold text-white shadow-[0_0_28px_rgba(77,124,255,0.4)] transition-shadow hover:shadow-[0_0_40px_rgba(77,124,255,0.55)]"
                >
                  Create your workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/dashboard/predictions"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/4 px-7 py-4 text-sm font-semibold text-white/75 transition-colors hover:bg-white/7 hover:text-white"
                >
                  View live predictions
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {trustPills.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-2 text-sm font-medium text-white/55"
                >
                  <BadgeCheck className="h-4 w-4 text-[#90a9ff]" />
                  {item}
                </span>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 grid gap-3 sm:grid-cols-3"
            >
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-4 backdrop-blur-sm"
                >
                  <p className="font-mono-data text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/45">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard preview card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[38rem]"
          >
            {/* Glow behind card */}
            <div className="pointer-events-none absolute inset-x-8 top-16 h-72 rounded-full bg-[#4d7cff]/16 blur-3xl" />

            <div
              className="relative overflow-hidden rounded-[28px] p-4 sm:p-5"
              style={{
                background: "linear-gradient(180deg, rgba(18,22,34,0.95) 0%, rgba(9,12,20,0.95) 100%)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Match header */}
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/38">Today's board</p>
                  <p className="mt-1 text-sm font-semibold text-white">MOUZ NXT vs CYBERSHOKE Esports</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Main analysis card */}
                <div
                  className="rounded-[22px] p-5"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">Primary read</p>
                      <h3 className="mt-2 font-landing-display text-xl font-semibold text-white">
                        Vitality moneyline
                      </h3>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-right">
                      <p className="text-[10px] font-medium text-white/38">Confidence</p>
                      <p className="font-mono-data text-2xl font-semibold text-white">84%</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      { icon: ShieldCheck, label: "Map pool", value: "Mirage / Nuke", sub: "Vitality stronger across the three-map spread." },
                      { icon: LineChart, label: "Market edge", value: "+11.8% EV", sub: "Books lagging recent rating shift." },
                      { icon: WalletCards, label: "Best line", value: "1.93 Pinnacle", sub: "Auto-compared across all books." },
                    ].map(({ icon: Icon, label, value, sub }) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/8 bg-black/20 p-4"
                      >
                        <div className="flex items-center gap-2 text-white/40">
                          <Icon className="h-4 w-4" />
                          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">{label}</span>
                        </div>
                        <p className="mt-4 text-sm font-semibold text-white">{value}</p>
                        <p className="mt-1 text-xs text-white/45">{sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 rounded-[18px] border border-white/8 bg-black/20 p-4">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                      <span>Model split</span>
                      <span>Adjusted line</span>
                    </div>
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-white/68">
                        <span>Vitality 56%</span>
                        <span>MOUZ NXT 44%</span>
                      </div>
                      <div className="flex h-2.5 overflow-hidden rounded-full bg-white/8">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "56%" }}
                          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full bg-gradient-to-r from-[#6b8cff] to-[#4d7cff]"
                        />
                        <div className="h-full flex-1 bg-white/18" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Odds compare */}
                  <div
                    className="rounded-[22px] p-4"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">Odds compare</p>
                        <p className="mt-1.5 text-sm font-semibold text-white">Best available line</p>
                      </div>
                      <span className="rounded-full border border-[#4d7cff]/20 bg-[#4d7cff]/10 px-2.5 py-1 text-[10px] font-semibold text-[#9fb7ff]">
                        Match Win
                      </span>
                    </div>
                    <div className="mt-4 space-y-2.5">
                      {[
                        { book: "Pinnacle", t1: "1.93", t2: "1.81", best: true },
                        { book: "GG.BET", t1: "1.91", t2: "1.79", best: false },
                        { book: "Thunderpick", t1: "1.88", t2: "1.84", best: false },
                      ].map((row) => (
                        <div
                          key={row.book}
                          className={`rounded-xl border px-3 py-2.5 ${
                            row.best
                              ? "border-[#4d7cff]/25 bg-[#4d7cff]/10"
                              : "border-white/7 bg-white/[0.025]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">{row.book}</span>
                            {row.best && (
                              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9fb7ff]">
                                Best
                              </span>
                            )}
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-1.5 text-center">
                            <div className="rounded-lg bg-black/18 px-2 py-1.5">
                              <p className="text-[9px] uppercase tracking-[0.2em] text-white/32">Vitality</p>
                              <p className="mt-0.5 font-mono-data text-sm font-semibold text-white">{row.t1}</p>
                            </div>
                            <div className="rounded-lg bg-black/18 px-2 py-1.5">
                              <p className="text-[9px] uppercase tracking-[0.2em] text-white/32">MOUZ</p>
                              <p className="mt-0.5 font-mono-data text-sm font-semibold text-white">{row.t2}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Player prop spotlight */}
                  <div
                    className="rounded-[22px] p-4"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">Player spotlight</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#4d7cff]/20 to-[#6b8cff]/10 text-sm font-bold text-white">
                        Zy
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">ZywOo over 19.5</p>
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <p className="mt-1 text-xs leading-5 text-white/48">
                          Role matchup, KPR trend, favorable map trio.
                        </p>
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
