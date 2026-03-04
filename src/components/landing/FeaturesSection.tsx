import { motion } from "framer-motion";
import { Brain, Map, TrendingUp, Radio, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Brain, title: t("features.ai"), description: t("features.aiDesc") },
    { icon: Map, title: t("features.veto"), description: t("features.vetoDesc") },
    { icon: TrendingUp, title: t("features.odds"), description: t("features.oddsDesc") },
    { icon: Radio, title: t("features.realtime"), description: t("features.realtimeDesc") },
    { icon: Shield, title: t("features.analysis"), description: t("features.analysisDesc") },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t("features.title1")}</span> {t("features.title2")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("features.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:glow-blue"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
