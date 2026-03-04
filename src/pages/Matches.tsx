import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const matches = [
  { id: "1", team1: "M80", team2: "Team Liquid", event: "PGL Major", time: "15:00 CET", format: "Bo3", rank1: 14, rank2: 8 },
  { id: "2", team1: "G2", team2: "FaZe", event: "IEM Katowice", time: "17:30 CET", format: "Bo3", rank1: 3, rank2: 5 },
  { id: "3", team1: "NAVI", team2: "Vitality", event: "BLAST Premier", time: "19:00 CET", format: "Bo5", rank1: 1, rank2: 2 },
  { id: "4", team1: "Cloud9", team2: "Heroic", event: "ESL Pro League", time: "12:00 CET", format: "Bo1", rank1: 12, rank2: 18 },
  { id: "5", team1: "MOUZ", team2: "Astralis", event: "PGL Major", time: "14:00 CET", format: "Bo3", rank1: 4, rank2: 15 },
  { id: "6", team1: "Spirit", team2: "Falcons", event: "IEM Katowice", time: "20:00 CET", format: "Bo3", rank1: 6, rank2: 9 },
];

const Matches = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Upcoming Matches</h1>
        <p className="text-sm text-muted-foreground">Today's CS2 matches with AI analysis available</p>
      </div>

      <div className="grid gap-4">
        {matches.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/dashboard/match/${m.id}`}
              className="block rounded-xl bg-card border border-border/50 p-5 hover:border-primary/30 hover:glow-blue transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-right w-32">
                    <p className="font-display font-bold">{m.team1}</p>
                    <p className="text-xs text-muted-foreground">#{m.rank1}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-display">VS</span>
                  <div className="w-32">
                    <p className="font-display font-bold">{m.team2}</p>
                    <p className="text-xs text-muted-foreground">#{m.rank2}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-border/50 text-muted-foreground">{m.format}</Badge>
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
    </div>
  );
};

export default Matches;
