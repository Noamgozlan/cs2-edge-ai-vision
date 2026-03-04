import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches } from "@/lib/api";
import { Loader2 } from "lucide-react";

const Matches = () => {
  const { t } = useLanguage();

  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("matches.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("matches.subtitle")}</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading matches from HLTV...</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
          Failed to load matches. Please try again.
        </div>
      )}

      {matches && (
        <div className="grid gap-3">
          {matches.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/dashboard/match/${m.id}?team1=${encodeURIComponent(m.team1)}&team2=${encodeURIComponent(m.team2)}&event=${encodeURIComponent(m.event)}&format=${encodeURIComponent(m.format)}&time=${encodeURIComponent(m.time)}&rank1=${m.rank1}&rank2=${m.rank2}`}
                className="block rounded-xl bg-card border border-border p-5 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-right w-32">
                      <p className="font-semibold">{m.team1}</p>
                      <p className="text-xs text-muted-foreground">#{m.rank1}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-bold">VS</span>
                    <div className="w-32">
                      <p className="font-semibold">{m.team2}</p>
                      <p className="text-xs text-muted-foreground">#{m.rank2}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{m.format}</Badge>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{m.event}</p>
                      <p className="text-xs font-medium text-primary">{m.time}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
