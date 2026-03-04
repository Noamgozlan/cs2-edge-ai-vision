import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const oddsData = [
  {
    match: "M80 vs Team Liquid", team1: "M80", team2: "Team Liquid",
    odds: [
      { site: "HLTV Odds", team1: "1.82", team2: "1.95" },
      { site: "Bet365", team1: "1.80", team2: "2.00" },
      { site: "GGbet", team1: "1.85", team2: "1.90" },
      { site: "Pinnacle", team1: "1.83", team2: "1.97" },
    ],
  },
  {
    match: "G2 vs FaZe", team1: "G2", team2: "FaZe",
    odds: [
      { site: "HLTV Odds", team1: "1.55", team2: "2.35" },
      { site: "Bet365", team1: "1.50", team2: "2.50" },
      { site: "GGbet", team1: "1.58", team2: "2.28" },
      { site: "Pinnacle", team1: "1.53", team2: "2.42" },
    ],
  },
];

const OddsComparison = () => {
  const { t } = useLanguage();
  const bestOdds = (odds: { team1: string; team2: string }[], key: "team1" | "team2") =>
    Math.max(...odds.map((o) => parseFloat(o[key]))).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("odds.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("odds.subtitle")}</p>
      </div>

      {oddsData.map((m, i) => (
        <motion.div
          key={m.match}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl bg-card border border-border overflow-hidden"
        >
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold">{m.match}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium">{t("odds.site")}</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">{m.team1}</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">{m.team2}</th>
                </tr>
              </thead>
              <tbody>
                {m.odds.map((row) => (
                  <tr key={row.site} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{row.site}</td>
                    <td className={`p-4 text-center font-display font-bold ${row.team1 === bestOdds(m.odds, "team1") ? "text-accent" : ""}`}>
                      {row.team1}
                    </td>
                    <td className={`p-4 text-center font-display font-bold ${row.team2 === bestOdds(m.odds, "team2") ? "text-accent" : ""}`}>
                      {row.team2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OddsComparison;
