import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAIAnalysis, type MatchAnalysis } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, TrendingUp, XCircle, CheckCircle, Scale, Loader2, Brain, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const MatchDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const team1 = searchParams.get("team1") || "Team A";
  const team2 = searchParams.get("team2") || "Team B";
  const event = searchParams.get("event") || "CS2 Tournament";
  const format = searchParams.get("format") || "Bo3";
  const time = searchParams.get("time") || "";
  const rank1 = searchParams.get("rank1") || "";
  const rank2 = searchParams.get("rank2") || "";

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ["ai-analysis", team1, team2, event, format],
    queryFn: () => fetchAIAnalysis(team1, team2, event, format),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <Link to="/dashboard/matches" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t("match.back")}
      </Link>

      {/* Match Header */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-2xl">{team1}</span>
                <span className="text-muted-foreground text-lg">vs</span>
                <span className="font-bold text-2xl">{team2}</span>
              </div>
              <p className="text-sm text-muted-foreground">{event} · {format} {time && `· ${time}`}</p>
              {rank1 && rank2 && (
                <p className="text-xs text-muted-foreground mt-1">#{rank1} vs #{rank2}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary">AI Analysis</span>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="p-12 flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <Zap className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <p className="font-semibold">AI is analyzing this matchup...</p>
              <p className="text-sm text-muted-foreground mt-1">Evaluating player stats, map pools, recent form, and historical data</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-6">
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
              Failed to generate AI analysis: {(error as Error).message}
            </div>
          </div>
        )}

        {analysis && (
          <>
            {/* Prediction */}
            <div className="p-6 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-accent">{t("match.recommendedBet")}</span>
                  </div>
                  <p className="font-bold text-2xl">{analysis.prediction.recommendedBet}</p>
                </div>
                <Badge className="bg-primary text-primary-foreground border-0 text-lg px-5 py-2">
                  {analysis.prediction.confidence}% Confidence
                </Badge>
              </div>

              {/* Win Probability Bar */}
              <div className="mt-4 bg-card rounded-xl p-4 border border-border">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold">{team1} ({analysis.prediction.winProbability.team1}%)</span>
                  <span className="font-bold">{team2} ({analysis.prediction.winProbability.team2}%)</span>
                </div>
                <div className="w-full h-3 bg-border rounded-full overflow-hidden flex">
                  <div className="h-full bg-primary" style={{ width: `${analysis.prediction.winProbability.team1}%` }} />
                  <div className="h-full bg-accent" style={{ width: `${analysis.prediction.winProbability.team2}%` }} />
                </div>
              </div>
            </div>

            {/* Veto Prediction */}
            <div className="p-6 border-b border-border">
              <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">{t("match.projectedVeto")}</h4>
              <div className="space-y-3">
                {analysis.veto.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    {v.action === "ban" ? <XCircle className="h-4 w-4 text-destructive" /> :
                     v.action === "pick" ? <CheckCircle className="h-4 w-4 text-accent" /> :
                     <Scale className="h-4 w-4 text-primary" />}
                    <span className="text-muted-foreground w-32">{v.team} {v.action}</span>
                    <span className="font-medium">{v.map}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Analysis Breakdown */}
            <div className="p-6 space-y-5 border-b border-border">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">🔥 {t("match.breakdown")}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.analysis.summary}</p>
              {analysis.analysis.sections.map((section) => (
                <div key={section.title}>
                  <h5 className="text-sm font-semibold mb-1">{section.emoji} {section.title}</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Player Stats */}
            {analysis.playerStats && analysis.playerStats.length > 0 && (
              <div className="p-6 border-b border-border">
                <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">📊 Key Player Stats</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-muted-foreground font-medium">Player</th>
                        <th className="text-left p-3 text-muted-foreground font-medium">Team</th>
                        <th className="text-center p-3 text-muted-foreground font-medium">Rating</th>
                        <th className="text-center p-3 text-muted-foreground font-medium">KPR</th>
                        <th className="text-center p-3 text-muted-foreground font-medium">DPR</th>
                        <th className="text-center p-3 text-muted-foreground font-medium">Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.playerStats.map((p) => (
                        <tr key={p.name} className="border-b border-border last:border-0 hover:bg-muted/50">
                          <td className="p-3 font-medium">{p.name}</td>
                          <td className="p-3 text-muted-foreground">{p.team}</td>
                          <td className="p-3 text-center font-mono font-bold text-primary">{p.rating}</td>
                          <td className="p-3 text-center font-mono">{p.kpr}</td>
                          <td className="p-3 text-center font-mono">{p.dpr}</td>
                          <td className="p-3 text-center font-mono">{p.impact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Odds Comparison */}
            <div className="p-6">
              <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">{t("odds.title")}</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-muted-foreground font-medium">{t("odds.site")}</th>
                      <th className="text-center p-3 text-muted-foreground font-medium">{team1}</th>
                      <th className="text-center p-3 text-muted-foreground font-medium">{team2}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.odds && Object.keys(analysis.odds.team1 || {}).map((site) => (
                      <tr key={site} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="p-3 font-medium capitalize">{site}</td>
                        <td className="p-3 text-center font-mono font-bold">{analysis.odds.team1[site]}</td>
                        <td className="p-3 text-center font-mono font-bold">{analysis.odds.team2[site]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchDetail;
