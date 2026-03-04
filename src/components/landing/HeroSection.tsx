import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.08)_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,_hsl(var(--secondary)/0.06)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }} />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/80 mb-8"
          >
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">{t("hero.badge")}</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            <span className="text-gradient">{t("hero.title1")}</span>
            <br />
            <span>{t("hero.title2")}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity text-sm px-8 h-12 text-primary-foreground glow-blue" asChild>
              <Link to="/register">
                {t("hero.cta1")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-sm px-8 h-12" asChild>
              <Link to="/dashboard/predictions">
                <BarChart3 className="mr-2 h-4 w-4" /> {t("hero.cta2")}
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {[
            { label: t("hero.winRate"), value: "73.2%" },
            { label: t("hero.matchesAnalyzed"), value: "12,847" },
            { label: t("hero.activeUsers"), value: "4,200+" },
            { label: t("hero.valueBets"), value: "1,893" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center p-5 rounded-2xl bg-card border border-border"
            >
              <div className="text-2xl font-display font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
