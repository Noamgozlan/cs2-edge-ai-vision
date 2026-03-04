import { motion } from "framer-motion";
import { Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PlayerFormData {
  name: string;
  team: string;
  recentRatings: number[];
  trend: "stable" | "rising" | "declining";
  avgKills: number;
  clutchRate: string;
  openingDuelWinRate: string;
}

interface PlayerFormHeatmapProps {
  players: PlayerFormData[];
  team1: string;
  team2: string;
}

function getRatingColor(rating: number): string {
  if (rating >= 1.3) return "bg-accent";
  if (rating >= 1.15) return "bg-accent/70";
  if (rating >= 1.0) return "bg-primary/50";
  if (rating >= 0.85) return "bg-orange-500/60";
  return "bg-destructive/60";
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "rising") return <TrendingUp className="w-3 h-3 text-accent" />;
  if (trend === "declining") return <TrendingDown className="w-3 h-3 text-destructive" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
}

const PlayerFormHeatmap = ({ players, team1, team2 }: PlayerFormHeatmapProps) => {
  if (!players || players.length === 0) return null;

  const team1Players = players.filter(p => p.team === team1);
  const team2Players = players.filter(p => p.team === team2);

  const renderTeam = (teamPlayers: PlayerFormData[], teamName: string) => (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{teamName}</p>
      {teamPlayers.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-lg border border-border bg-card/50 p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{p.name}</span>
              <TrendIcon trend={p.trend} />
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-muted-foreground">{p.avgKills} avg kills</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{p.clutchRate} clutch</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-accent font-bold">{p.openingDuelWinRate} OD</span>
            </div>
          </div>

          {/* Rating Heatmap */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-muted-foreground w-8">Last 10</span>
            <div className="flex gap-0.5 flex-1">
              {p.recentRatings.map((r, j) => (
                <motion.div
                  key={j}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + j * 0.04 }}
                  className={`flex-1 h-6 rounded-sm ${getRatingColor(r)} relative group cursor-default`}
                  title={`Match ${j + 1}: ${r.toFixed(2)}`}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-popover text-popover-foreground px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md border border-border">
                    {r.toFixed(2)}
                  </span>
                </motion.div>
              ))}
            </div>
            <span className={`text-[10px] font-bold w-10 text-right ${
              p.trend === "rising" ? "text-accent" : p.trend === "declining" ? "text-destructive" : "text-muted-foreground"
            }`}>
              {(p.recentRatings.reduce((a, b) => a + b, 0) / p.recentRatings.length).toFixed(2)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black flex items-center gap-2">
        <Flame className="w-5 h-5 text-accent" /> Player Form Heatmap
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderTeam(team1Players, team1)}
        {renderTeam(team2Players, team2)}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
        <span>Rating Scale:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-destructive/60" /> &lt;0.85
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-orange-500/60" /> 0.85-1.0
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary/50" /> 1.0-1.15
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-accent/70" /> 1.15-1.3
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-accent" /> &gt;1.3
        </div>
      </div>
    </div>
  );
};

export default PlayerFormHeatmap;
