import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

// --- Components for SaaS Demo Effects ---

const AnimatedNumber = ({ value, duration = 1.5, suffix = "" }: { value: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (duration * 60);
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [value, duration]);
  return <span>{count}{suffix}</span>;
};

const OddsRow = ({ book, initialOdds, isBest, index }: { book: string, initialOdds: string, isBest: boolean, index: number }) => {
  const [odds, setOdds] = useState(initialOdds);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    // Simulate live odds movement for demo
    if (book !== "Pinnacle") return;
    const interval = setInterval(() => {
      setOdds((prev) => {
        const val = parseFloat(prev);
        // Toggle between 1.93 and 1.95
        return val === 1.93 ? "1.95" : "1.93";
      });
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, [book]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.8 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-500 ${
        flash 
          ? "border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.2)]" 
          : isBest
            ? "border-[hsl(221,83%,58%)]/20 bg-[hsl(221,83%,58%)]/[0.06]"
            : "border-white/[0.04] bg-white/[0.02]"
      }`}
    >
      <span className="text-xs font-medium text-white/[0.65]">{book}</span>
      <span className={`font-mono-data text-sm font-semibold transition-colors duration-300 ${flash ? "text-emerald-400" : "text-white"}`}>
        {odds}
      </span>
    </motion.div>
  );
};

// --- Static Data ---

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
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-[hsl(221,83%,58%)]/[0.06] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28 w-full">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

          {/* Left: Copy */}
          <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-xl">
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/[0.50]"
            >
              <Sparkles className="h-3 w-3 text-[hsl(221,83%,68%)]" />
              The sharper way to trade CS2 match markets
            </motion.div>

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

          {/* Right: Dashboard Animated Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[36rem]"
          >
            <div className="landing-surface-strong rounded-2xl p-4 sm:p-5">
              
              {/* Demo Header */}
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
                
                {/* Main Analysis Panel */}
                <div className="landing-surface rounded-xl p-4 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-white/[0.30]">Primary read</p>
                      <motion.h3 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-1.5 font-landing-display text-lg text-white"
                      >
                        Vitality ML
                      </motion.h3>
                    </div>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-right relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                      <p className="text-[10px] text-white/[0.30]">Confidence</p>
                      <p className="font-mono-data text-xl font-semibold text-white relative z-10">
                        <AnimatedNumber value={84} suffix="%" />
                      </p>
                    </motion.div>
                  </div>

                  {/* Cards Grid */}
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {[
                      { icon: ShieldCheck, label: "Map pool", value: "Mirage / Nuke", delay: 0.7 },
                      { icon: LineChart, label: "Edge", value: "+11.8% EV", delay: 0.8 },
                      { icon: WalletCards, label: "Best line", value: "1.93 Pinnacle", delay: 0.9 },
                    ].map(({ icon: Icon, label, value, delay }) => (
                      <motion.div 
                        key={label} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay }}
                        className="rounded-lg border border-white/[0.06] bg-black/15 p-3 relative group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-1.5 text-white/[0.30]">
                          <Icon className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
                        </div>
                        <p className="mt-2.5 text-[13px] font-medium text-white relative z-10">{value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Animated Progress Bar */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-4 rounded-lg border border-white/[0.06] bg-black/15 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-white/[0.40]">
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                        Vitality <AnimatedNumber value={56} duration={1} suffix="%" />
                      </motion.span>
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                        MOUZ NXT <AnimatedNumber value={44} duration={1} suffix="%" />
                      </motion.span>
                    </div>
                    <div className="flex h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "56%" }}
                        transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-[hsl(221,83%,58%)] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 w-1/2 -translate-x-full animate-[shimmer_2s_infinite_1s]" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  
                  {/* Odds Compare Widget */}
                  <div className="landing-surface rounded-xl p-3.5">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-white/[0.30]">Odds compare</p>
                    <div className="mt-3 space-y-2">
                      {[
                        { book: "Pinnacle", t1: "1.93", best: true },
                        { book: "GG.BET", t1: "1.91", best: false },
                        { book: "Thunderpick", t1: "1.88", best: false },
                      ].map((row, i) => (
                        <OddsRow key={row.book} book={row.book} initialOdds={row.t1} isBest={row.best} index={i} />
                      ))}
                    </div>
                  </div>

                  {/* Player Spotlight Widget */}
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="landing-surface rounded-xl p-3.5 group relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-[hsl(221,83%,58%)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="text-[10px] font-medium uppercase tracking-widest text-white/[0.30]">Player spotlight</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[hsl(221,83%,58%)]/20 bg-[hsl(221,83%,58%)]/10 text-xs font-bold text-[hsl(221,83%,68%)] relative overflow-hidden">
                        Zy
                        <div className="absolute inset-0 bg-white/10 w-1/2 -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-medium text-white group-hover:text-[hsl(221,83%,68%)] transition-colors">ZywOo over 19.5</p>
                          <TrendingUp className="h-3 w-3 text-emerald-400 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/[0.35]">Role matchup, KPR trend, favorable maps.</p>
                      </div>
                    </div>
                  </motion.div>
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
