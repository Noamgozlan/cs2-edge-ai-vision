import { motion } from "framer-motion";
import { Map } from "lucide-react";

interface MapData {
  map: string;
  team1WinRate: number;
  team2WinRate: number;
  team1CtWinPct: number;
  team1TWinPct: number;
  team2CtWinPct: number;
  team2TWinPct: number;
  team1PistolWinPct: number;
  team2PistolWinPct: number;
  totalRoundsAvg: number;
  edge: string;
}

interface MapBreakdownProps {
  maps: MapData[];
  team1: string;
  team2: string;
}

const MapBreakdown = ({ maps, team1, team2 }: MapBreakdownProps) => {
  if (!maps || maps.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black flex items-center gap-2">
        <Map className="w-5 h-5 text-primary" /> Map-by-Map Breakdown
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {maps.map((m, i) => (
          <motion.div
            key={m.map}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm">{m.map}</h3>
              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                ~{m.totalRoundsAvg} rounds
              </span>
            </div>

            {/* Win Rate Bar */}
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="font-bold text-primary">{team1} {m.team1WinRate}%</span>
                <span className="font-bold text-muted-foreground">{team2} {m.team2WinRate}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden flex">
                <motion.div
                  className="h-full bg-primary rounded-l-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${m.team1WinRate}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                />
              </div>
            </div>

            {/* Side Splits */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="space-y-1">
                <p className="font-bold text-muted-foreground uppercase tracking-wider">{team1}</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CT</span>
                  <span className="font-bold">{m.team1CtWinPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">T</span>
                  <span className="font-bold">{m.team1TWinPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pistol</span>
                  <span className="font-bold text-accent">{m.team1PistolWinPct}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-muted-foreground uppercase tracking-wider">{team2}</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CT</span>
                  <span className="font-bold">{m.team2CtWinPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">T</span>
                  <span className="font-bold">{m.team2TWinPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pistol</span>
                  <span className="font-bold text-accent">{m.team2PistolWinPct}%</span>
                </div>
              </div>
            </div>

            {/* Edge */}
            <p className="text-[10px] text-primary italic border-t border-border pt-2">{m.edge}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MapBreakdown;
