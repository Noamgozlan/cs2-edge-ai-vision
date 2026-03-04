import { motion } from "framer-motion";

const oddsData = [
  {
    match: "M80 vs Team Liquid",
    odds: [
      { site: "HLTV Odds", team1: "1.82", team2: "1.95" },
      { site: "Bet365", team1: "1.80", team2: "2.00" },
      { site: "GGbet", team1: "1.85", team2: "1.90" },
      { site: "Pinnacle", team1: "1.83", team2: "1.97" },
    ],
    team1: "M80",
    team2: "Team Liquid",
  },
  {
    match: "G2 vs FaZe",
    odds: [
      { site: "HLTV Odds", team1: "1.55", team2: "2.35" },
      { site: "Bet365", team1: "1.50", team2: "2.50" },
      { site: "GGbet", team1: "1.58", team2: "2.28" },
      { site: "Pinnacle", team1: "1.53", team2: "2.42" },
    ],
    team1: "G2",
    team2: "FaZe",
  },
];

const OddsComparison = () => {
  const bestOdds = (odds: { team1: string; team2: string }[], key: "team1" | "team2") =>
    Math.max(...odds.map((o) => parseFloat(o[key]))).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Odds Comparison</h1>
        <p className="text-sm text-muted-foreground">Find the best value across bookmakers</p>
      </div>

      {oddsData.map((m, i) => (
        <motion.div
          key={m.match}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl bg-card border border-border/50 overflow-hidden"
        >
          <div className="p-5 border-b border-border/50">
            <h2 className="font-display font-bold">{m.match}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-muted-foreground font-medium">Site</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">{m.team1}</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">{m.team2}</th>
                </tr>
              </thead>
              <tbody>
                {m.odds.map((row) => (
                  <tr key={row.site} className="border-b border-border/50 last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="p-4 font-medium">{row.site}</td>
                    <td className={`p-4 text-center font-display font-bold ${row.team1 === bestOdds(m.odds, "team1") ? "text-neon-green" : ""}`}>
                      {row.team1}
                    </td>
                    <td className={`p-4 text-center font-display font-bold ${row.team2 === bestOdds(m.odds, "team2") ? "text-neon-green" : ""}`}>
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
