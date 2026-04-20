import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches, fetchAIAnalysis } from "@/lib/api";
import { Loader2, Lock, Crown } from "lucide-react";
import { useState } from "react";

const Predictions = () => {
  const { t, language } = useLanguage();
  const { isPro, openCheckout } = useSubscription();
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const FREE_LIMIT = 3;

  const { data: matches, isLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
  });

  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ["predictions-batch", matches?.map(m => `${m.team1}-${m.team2}`), language],
    queryFn: async () => {
      if (!matches) return [];
      const results = await Promise.allSettled(
        matches.slice(0, 6).map(m =>
          fetchAIAnalysis(m.team1, m.team2, m.event, m.format, language)
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
          {predictions.map((p, i) => {
            const isLocked = !isPro && i >= FREE_LIMIT;
            return (
              <motion.div
                key={p.match}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-xl bg-card border border-border p-5 transition-all ${
                  isLocked ? "opacity-60" : "hover:border-primary/50 cursor-pointer"
                }`}
                onClick={() => !isLocked && setSelectedMatch(selectedMatch === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold mb-1">{p.match}</p>
                    <p className="text-xs text-muted-foreground">{p.event}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    {isLocked ? (
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        <button
                          onClick={(e) => { e.stopPropagation(); openCheckout(); }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-primary/15 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                        >
                          <Crown className="w-3 h-3" /> Unlock Pro
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-accent">{p.bet}</p>
                        <Badge className={`border-0 ${
                          p.confidence >= 80 ? "bg-accent/15 text-accent" :
                          p.confidence >= 70 ? "bg-primary/15 text-primary" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {p.confidence}%
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                {selectedMatch === i && p.summary && !isLocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.summary}</p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {!isPro && predictions.length > FREE_LIMIT && (
            <div className="rounded-xl p-5 text-center"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(270 80% 60% / 0.05) 100%)",
                border: "1px solid hsl(var(--primary) / 0.2)",
              }}
            >
              <Crown className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-bold mb-1">Unlock All Predictions</p>
              <p className="text-xs text-muted-foreground mb-3">
                Free users get {FREE_LIMIT} predictions per day. Go Pro for unlimited access.
              </p>
              <button
                onClick={openCheckout}
                className="px-4 py-2 rounded-lg text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
              >
                Upgrade to Pro - $19.99/mo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Predictions;
