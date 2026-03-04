import { useState, useEffect } from "react";
import { Clock, Users, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface PreMatchCountdownProps {
  matchTime: string;
  team1: string;
  team2: string;
  event: string;
  format: string;
}

function parseMatchTime(timeStr: string): Date | null {
  // Try parsing various HLTV time formats
  const now = new Date();
  
  // If it's like "15:30" or "3:30 PM"
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    if (timeMatch[3]?.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (timeMatch[3]?.toUpperCase() === "AM" && hours === 12) hours = 0;
    
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    if (target < now) target.setDate(target.getDate() + 1);
    return target;
  }
  
  // If it says "LIVE" or "Live"
  if (timeStr.toLowerCase().includes("live")) return null;
  
  return null;
}

const PreMatchCountdown = ({ matchTime, team1, team2, event, format }: PreMatchCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const target = parseMatchTime(matchTime);
    if (!target) {
      setIsLive(true);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setIsLive(true);
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [matchTime]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)' }}
      />

      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
          {isLive ? "MATCH IS LIVE" : "COUNTDOWN TO MATCH"}
        </span>
      </div>

      {isLive ? (
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
          <span className="text-2xl font-black text-destructive">LIVE NOW</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <TimeBlock value={timeLeft.hours} label="HRS" />
          <span className="text-2xl font-black text-muted-foreground">:</span>
          <TimeBlock value={timeLeft.minutes} label="MIN" />
          <span className="text-2xl font-black text-muted-foreground">:</span>
          <TimeBlock value={timeLeft.seconds} label="SEC" />
        </div>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{team1} vs {team2}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted font-bold">{format}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3" />
          <span className="truncate">{event}</span>
        </div>
      </div>
    </motion.div>
  );
};

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <motion.p
        key={value}
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-black tabular-nums"
      >
        {String(value).padStart(2, "0")}
      </motion.p>
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
    </div>
  );
}

export default PreMatchCountdown;
