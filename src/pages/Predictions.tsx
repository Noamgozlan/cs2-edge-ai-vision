import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const predictions = [
  { match: "M80 vs Team Liquid", bet: "M80 ML", odds: "1.82", confidence: 72, event: "PGL Major" },
  { match: "G2 vs FaZe", bet: "G2 ML", odds: "1.55", confidence: 81, event: "IEM Katowice" },
  { match: "NAVI vs Vitality", bet: "Vitality +1.5", odds: "1.65", confidence: 68, event: "BLAST Premier" },
  { match: "MOUZ vs Astralis", bet: "MOUZ ML", odds: "1.45", confidence: 85, event: "PGL Major" },
  { match: "Spirit vs Falcons", bet: "Spirit -1.5", odds: "2.20", confidence: 61, event: "IEM Katowice" },
  { match: "Cloud9 vs Heroic", bet: "Over 2.5", odds: "1.90", confidence: 64, event: "ESL Pro League" },
];

const Predictions = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("predictions.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("predictions.subtitle")}</p>
      </div>

      <div className="grid gap-3">
        {predictions.map((p, i) => (
          <motion.div
            key={p.match}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl bg-card border border-border p-5 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold mb-1">{p.match}</p>
                <p className="text-xs text-muted-foreground">{p.event}</p>
              </div>
              <div className="text-right flex items-center gap-3">
                <p className="text-sm font-semibold text-accent">{p.bet} @ {p.odds}</p>
                <Badge className={`font-display border-0 ${
                  p.confidence >= 80 ? "bg-accent/15 text-accent" :
                  p.confidence >= 70 ? "bg-primary/15 text-primary" :
                  "bg-secondary/15 text-secondary"
                }`}>
                  {p.confidence}%
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Predictions;
