import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTimezone } from "@/contexts/TimezoneContext";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches, Match } from "@/lib/api";
import { Loader2, TrendingUp, Calendar, BarChart3, Heart, Zap, Clock } from "lucide-react";
import { TeamLogo } from "@/lib/team-logos";
import { useState } from "react";

const filters = [
  { label: "All Matches", icon: "All", active: true },
  { label: "Live Now", icon: "Live" },
  { label: "Majors", icon: "Maj" },
  { label: "Tier 1", icon: "T1" },
  { label: "Favorites", icon: "Fav" },
];

function matchLink(m: Match) {
  return `/dashboard/match/${m.id}?team1=${encodeURIComponent(m.team1)}&team2=${encodeURIComponent(m.team2)}&event=${encodeURIComponent(m.event)}&format=${encodeURIComponent(m.format)}&time=${encodeURIComponent(m.time)}&rank1=${m.rank1}&rank2=${m.rank2}`;
}

const Matches = () => {
  const { t } = useLanguage();
  const { convertTime, timezoneLabel } = useTimezone();
  const [activeFilter, setActiveFilter] = useState(0);

  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
  });

  const featured = matches?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-black tracking-tight">Upcoming Matches</h1>
        <span className="text-[10px] font-black uppercase tracking-widest bg-accent/20 text-accent px-2.5 py-1 rounded-full">
          Live 24h
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setActiveFilter(i)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === i
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
          Failed to load matches. Please try again.
        </div>
      )}

      {featured && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Grand Final Feature</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-card border border-border p-6"
          >
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded">
                    Premium AI Analysis
                  </span>
                  <span className="text-xs text-muted-foreground">• {featured.event}</span>
                </div>
                <h2 className="text-2xl font-black">
                  {featured.team1} <span className="text-muted-foreground font-normal text-lg mx-1">vs</span> {featured.team2}
                </h2>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {convertTime(featured.time)}</span>
                  <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {featured.format} Series</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <TeamLogo name={featured.team1} size={48} />
                    <p className="text-[10px] font-bold text-muted-foreground mt-1">Rank #{featured.rank1}</p>
                  </div>
                  <span className="text-primary font-black text-lg">VS</span>
                  <div className="text-center">
                    <TeamLogo name={featured.team2} size={48} />
                    <p className="text-[10px] font-bold text-muted-foreground mt-1">Rank #{featured.rank2}</p>
                  </div>
                </div>

                <Link
                  to={matchLink(featured)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                >
                  View Predictions <TrendingUp className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {matches && matches.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">All Scheduled Matches</span>
              <div className="h-px w-20 bg-border" />
            </div>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timezoneLabel}
            </span>
          </div>

          <div className="space-y-3">
            {matches.slice(1).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={matchLink(m)}
                  className="group flex items-center gap-4 rounded-xl bg-card border border-border p-4 hover:border-primary/40 transition-all"
                >
                  <div className="w-16 shrink-0 text-center">
                    <p className="text-lg font-black">{convertTime(m.time).split(" ")[0]}</p>
                    <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Today</p>
                  </div>

                  <div className="h-10 w-px bg-border shrink-0" />

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="font-bold text-sm truncate">{m.team1}</span>
                    <TeamLogo name={m.team1} size={32} />
                    <span className="text-xs text-muted-foreground font-bold shrink-0">VS</span>
                    <TeamLogo name={m.team2} size={32} />
                    <span className="font-bold text-sm truncate">{m.team2}</span>
                  </div>

                  <div className="hidden lg:flex flex-col items-center gap-0.5 w-44 shrink-0">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Tournament</span>
                    <span className="text-xs font-semibold text-center truncate w-full">{m.event}</span>
                  </div>

                  <div className="hidden md:flex flex-col items-center gap-0.5 w-16 shrink-0">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Format</span>
                    <span className="text-xs font-black">{m.format}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Matches;
