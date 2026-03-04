import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/cs2-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="CS2 Cinematic Backdrop"
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-12 w-full pt-20">
        <div className="max-w-3xl">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-sm bg-destructive/10 border border-destructive/30 text-destructive text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
            </span>
            Neural Engine v3.0 // ESL Pro League Enabled
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase mb-8"
          >
            Master the <br />
            <span className="text-primary italic" style={{ textShadow: "0 0 30px hsl(var(--primary) / 0.5)" }}>
              High-Stakes
            </span>{" "}
            <br />
            Server
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl border-l-2 border-primary/30 pl-6"
          >
            Institutional-grade AI intelligence for the elite player. Predicting every round, veto, and clutch with unmatched precision.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-5 rounded-sm text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all group flex items-center justify-center gap-3 shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
            >
              Establish Connection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dashboard/predictions"
              className="w-full sm:w-auto bg-card/70 backdrop-blur-md text-foreground px-10 py-5 rounded-sm text-sm font-black uppercase tracking-widest border border-border hover:bg-muted/50 transition-all"
            >
              System Demo
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
