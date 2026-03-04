import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches, fetchAIAnalysis } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const Predictions = () => {
  const { t } = useLanguage();
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

  const { data: matches, isLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch AI predictions for each match
  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ["predictions-batch", matches?.map(m => `${m.team1}-${m.team2}`)],
    queryFn: async () => {
      if (!matches) return [];
      // Fetch predictions for first 6 matches
      const results = await Promise.allSettled(
        matches.slice(0, 6).map(m =>
          fetchAIAnalysis(m.team1, m.team2, m.event, m.format)
            .then(analysis => ({
              match: `${m.team1} vs ${m.team2}`,
              bet: analysis.prediction.recommendedBet,
              confidence: analysis.prediction.confidence,
              event: m.event,
              summary: analysis.analysis.summary,
            }))
        )
      );
      return results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .map(r => r.value);
    },
    enabled: !!matches && matches.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const loading = isLoading || predictionsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("predictions.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("predictions.subtitle")}</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Generating AI predictions...</span>
        </div>
      )}

      {predictions && predictions.length > 0 && (
        <div className="grid gap-3">
          {predictions.map((p, i) => (
            <motion.div
              key={p.match}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl bg-card border border-border p-5 hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => setSelectedMatch(selectedMatch === i ? null : i)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold mb-1">{p.match}</p>
                  <p className="text-xs text-muted-foreground">{p.event}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-sm font-semibold text-accent">{p.bet}</p>
                  <Badge className={`border-0 ${
                    p.confidence >= 80 ? "bg-accent/15 text-accent" :
                    p.confidence >= 70 ? "bg-primary/15 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {p.confidence}%
                  </Badge>
                </div>
              </div>
              {selectedMatch === i && p.summary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-border"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.summary}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Predictions;
