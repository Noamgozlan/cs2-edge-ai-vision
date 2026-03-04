import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Users, TrendingUp, Zap } from "lucide-react";
import heroImage from "@/assets/cs2-hero-new.jpg";

const stats = [
  { label: "Win Rate", value: "73.2%", icon: TrendingUp },
  { label: "Matches Analyzed", value: "24K+", icon: Activity },
  { label: "Active Users", value: "8.4K", icon: Users },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="CS2 Esports Arena"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent" />
        {/* Animated grain overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 w-full pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-8"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-[11px] font-bold text-primary tracking-wide">
                Neural Engine v4.0 — Now Live
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              The Sharpest{" "}
              <span className="relative inline-block">
                <span className="text-primary">Edge</span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-[3px] bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
              <br />
              in CS2 Betting
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-lg mb-10"
            >
              AI-powered predictions grounded in real HLTV data. Smart bets across every market — from player props to map handicaps — engineered to find value others miss.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-col sm:flex-row gap-4 mb-14"
            >
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/25"
              >
                Start Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/dashboard/predictions"
                className="inline-flex items-center justify-center gap-2 bg-card/60 backdrop-blur-md text-foreground px-8 py-4 rounded-xl text-sm font-bold border border-border hover:border-primary/40 hover:bg-card/80 transition-all"
              >
                <Zap className="w-4 h-4 text-primary" />
                View Live Predictions
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-8"
            >
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-foreground leading-tight">{s.value}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  </div>
                  {i < stats.length - 1 && <div className="h-8 w-px bg-border ml-5 hidden sm:block" />}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — live prediction card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-primary/8 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-6 shadow-2xl">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Live Analysis</span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">PGL Major 2025</span>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-xl bg-muted/50 border border-border flex items-center justify-center mb-2 mx-auto text-lg font-black text-primary">Na</div>
                    <p className="text-sm font-bold">NAVI</p>
                    <p className="text-xs text-muted-foreground">#1</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-3xl font-black text-muted-foreground/30">VS</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-2 mx-auto text-lg font-black text-primary">Vi</div>
                    <p className="text-sm font-bold">Vitality</p>
                    <p className="text-xs text-muted-foreground">#2</p>
                  </div>
                </div>

                {/* Smart bet */}
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">AI Smart Bet</span>
                  </div>
                  <p className="text-sm font-bold mb-2">Both Teams Win a Map (Yes) @ 1.88</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-primary">85% confidence</span>
                    <span className="text-xs font-bold text-accent">EV: +14.2%</span>
                  </div>
                </div>

                {/* Probability bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] font-bold mb-1.5">
                    <span>NAVI 48%</span>
                    <span className="text-primary">Vitality 52%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden flex">
                    <div className="h-full bg-muted-foreground/30 rounded-l-full" style={{ width: "48%" }} />
                    <div className="h-full bg-primary rounded-r-full" style={{ width: "52%" }} />
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground text-center">
                  Powered by live HLTV data • Updated 2m ago
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};

export default HeroSection;
