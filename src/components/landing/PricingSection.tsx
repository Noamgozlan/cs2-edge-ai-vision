import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKeys } from "@/i18n/translations";

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);
  const { t } = useLanguage();

  const plans = [
    {
      name: t("pricing.free"), monthly: 0, yearly: 0,
      features: [t("pricing.freeFeat1"), t("pricing.freeFeat2"), t("pricing.freeFeat3")],
      cta: t("hero.cta1"), highlight: false,
    },
    {
      name: t("pricing.pro"), monthly: 19, yearly: 15,
      features: [t("pricing.proFeat1"), t("pricing.proFeat2"), t("pricing.proFeat3"), t("pricing.proFeat4")],
      cta: `Go ${t("pricing.pro")}`, highlight: true,
    },
    {
      name: t("pricing.elite"), monthly: 49, yearly: 39,
      features: [t("pricing.eliteFeat1"), t("pricing.eliteFeat2"), t("pricing.eliteFeat3"), t("pricing.eliteFeat4")],
      cta: `Go ${t("pricing.elite")}`, highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("pricing.title1")} <span className="text-gradient">{t("pricing.title2")}</span>
          </h2>
          <p className="text-muted-foreground mb-8">{t("pricing.subtitle")}</p>

          <div className="inline-flex items-center gap-1 bg-muted rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!yearly ? "bg-gradient-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${yearly ? "bg-gradient-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {t("pricing.yearly")} <span className="text-xs opacity-70">(-20%)</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-6 border transition-all ${
                plan.highlight
                  ? "bg-card border-primary/40 glow-blue scale-[1.02]"
                  : "bg-card border-border"
              }`}
            >
              <h3 className="font-display font-bold text-lg mb-1">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-display font-bold">${yearly ? plan.yearly : plan.monthly}</span>
                {plan.monthly > 0 && <span className="text-muted-foreground text-sm">/mo</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.highlight ? "bg-gradient-primary hover:opacity-90 text-primary-foreground" : ""}`}
                variant={plan.highlight ? "default" : "outline"}
                asChild
              >
                <Link to="/register">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
