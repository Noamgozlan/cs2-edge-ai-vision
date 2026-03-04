import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Crosshair } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(210_100%_55%/0.08)_0%,_transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(hsl(210 100% 55% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(210 100% 55% / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-glow bg-surface/50 mb-8">
            <Crosshair className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Powered by Advanced Machine Learning</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-6 leading-tight">
            <span className="text-gradient">AI-Powered</span>
            <br />
            <span className="text-foreground">CS2 Betting Intelligence</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Predict Counter-Strike 2 matches with data-driven AI analysis, veto simulations, and bookmaker odds comparison.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity text-base px-8 h-12 glow-blue" asChild>
              <Link to="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-glow text-foreground hover:bg-surface-hover text-base px-8 h-12" asChild>
              <Link to="/dashboard/predictions">
                <BarChart3 className="mr-2 h-4 w-4" /> View Predictions
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { label: "Win Rate", value: "73.2%" },
            { label: "Matches Analyzed", value: "12,847" },
            { label: "Active Users", value: "4,200+" },
            { label: "Value Bets Found", value: "1,893" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-surface/50 border border-border/50">
              <div className="text-2xl font-display font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
