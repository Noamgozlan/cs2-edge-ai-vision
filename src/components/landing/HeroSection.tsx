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

// --- Static Data ---

import GlobeBackground from "./GlobeBackground";

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
      {/* SellAuth Style hero-bg-img */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
        {/* Core glow */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30 blur-[120px] bg-gradient-to-b from-[hsl(221,83%,58%)] to-transparent rounded-[100%]" />
        
        {/* Fine structural grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* 3D Globe Background */}
      <div className="absolute inset-0 z-0">
        <GlobeBackground />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28 w-full z-10">
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

          {/* Right: Mac App Window Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[40rem]"
          >
            {/* App Window Chrome */}
            <div className="landing-surface-strong rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/40 px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 border border-black/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 border border-black/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80 border border-black/20" />
                </div>
                <div className="text-[11px] font-mono font-medium text-white/[0.4]">
                  cs2edge-intelligence-engine
                </div>
                <div className="w-10"></div> {/* Spacer for centering */}
              </div>

              {/* App Content */}
              <div className="flex h-[380px] bg-[#050508]/80">
                {/* Sidebar */}
                <div className="w-14 border-r border-white/[0.06] flex flex-col items-center py-4 gap-6 bg-white/[0.01]">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(221,83%,58%)]/20 flex items-center justify-center border border-[hsl(221,83%,58%)]/30">
                    <LineChart className="w-4 h-4 text-[hsl(221,83%,68%)]" />
                  </div>
                  <WalletCards className="w-4 h-4 text-white/[0.3] hover:text-white transition-colors cursor-pointer" />
                  <ShieldCheck className="w-4 h-4 text-white/[0.3] hover:text-white transition-colors cursor-pointer" />
                </div>

                {/* Main View */}
                <div className="flex-1 p-5 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-sm font-semibold tracking-wide">Live Feed: IEM Cologne</h3>
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      SYNCING
                    </span>
                  </div>

                  <div className="grid gap-3 flex-1">
                    {/* Main Chart Card */}
                    <div className="landing-surface rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(221,83%,58%)]/0 via-[hsl(221,83%,58%)]/5 to-[hsl(221,83%,58%)]/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                      <div className="flex justify-between items-start z-10">
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Edge Detected</p>
                          <p className="text-2xl text-white font-mono-data mt-1">+<AnimatedNumber value={12.4} duration={2} suffix="%" /></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Confidence</p>
                          <p className="text-lg text-[hsl(221,83%,68%)] font-mono-data"><AnimatedNumber value={84} duration={1.5} suffix="%" /></p>
                        </div>
                      </div>
                      
                      {/* Fake Chart Line */}
                      <div className="mt-6 flex items-end gap-1 h-16 w-full z-10 opacity-60">
                        {[40, 55, 45, 60, 50, 75, 65, 80, 70, 90, 85, 100].map((h, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05 + 0.5, type: "spring" }}
                            className={`flex-1 rounded-t-sm ${i > 8 ? "bg-emerald-500" : "bg-[hsl(221,83%,58%)]"}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Secondary Data Rows */}
                    <div className="grid grid-cols-2 gap-3 h-full">
                      <div className="landing-surface rounded-xl p-3 flex flex-col justify-center">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Top Matchup</p>
                        <p className="text-xs text-white font-medium">Vitality vs MOUZ</p>
                        <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Vitality ML @ 1.95
                        </p>
                      </div>
                      <div className="landing-surface rounded-xl p-3 flex flex-col justify-center">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Prop Alert</p>
                        <p className="text-xs text-white font-medium">ZywOo over 19.5 Kills</p>
                        <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "78%" }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="bg-[hsl(221,83%,58%)] h-full"
                          />
                        </div>
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
