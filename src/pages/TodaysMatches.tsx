import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Wifi, WifiOff, Clock, Trophy, Zap, AlertTriangle, RefreshCw } from "lucide-react";
import { TeamLogo } from "@/lib/team-logos";
import { useTimezone } from "@/contexts/TimezoneContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState } from "react";

interface CS2Match {
  id: string;
  source: string;
  source_match_id: string;
  start_time_utc: string | null;
  team1_name: string;
  team2_name: string;
  team1_logo: string | null;
  team2_logo: string | null;
  team1_rank: number;
  team2_rank: number;
  tournament_name: string | null;
  match_format: string;
  status: string;
  score: string | null;
  map: string | null;
  url: string | null;
  last_updated_utc: string;
  is_stale: boolean;
}

async function fetchTodaysMatches(): Promise<{ matches: CS2Match[]; staleCount: number }> {
  const { data, error } = await supabase.functions.invoke("cs2-matches-api", {
    body: {},
  });
  if (error) throw error;
  return { matches: data?.matches || [], staleCount: data?.staleCount || 0 };
}

async function triggerScrape(): Promise<any> {
  // Use AI to discover today's matches
  const { data, error } = await supabase.functions.invoke("ai-discover-matches");
  if (error) throw error;
  return data;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Wifi }> = {
  live: { label: "LIVE", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: Wifi },
  upcoming: { label: "UPCOMING", color: "bg-primary/20 text-primary border-primary/30", icon: Clock },
  finished: { label: "FINISHED", color: "bg-muted text-muted-foreground border-border", icon: Trophy },
};

const TodaysMatches = () => {
  const { convertTime, timezoneLabel } = useTimezone();
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cs2-today-matches"],
    queryFn: fetchTodaysMatches,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

  const matches = data?.matches || [];
  const staleCount = data?.staleCount || 0;

  // Check if data is stale (oldest update > 15 min ago)
  const isDataStale = matches.some((m) => {
    const updated = new Date(m.last_updated_utc).getTime();
    return Date.now() - updated > 15 * 60 * 1000;
  });

  const liveMatches = matches.filter((m) => m.status === "live");
  const upcomingMatches = matches.filter((m) => m.status === "upcoming");
  const finishedMatches = matches.filter((m) => m.status === "finished");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await triggerScrape();
      await refetch();
    } catch (e) {
      console.error("Refresh failed:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTime = (utcStr: string | null) => {
    if (!utcStr) return "TBD";
    try {
      const d = new Date(utcStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    } catch {
      return "TBD";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight">Today's CS2 Matches</h1>
          <span className="text-[10px] font-black uppercase tracking-widest bg-accent/20 text-accent px-2.5 py-1 rounded-full">
            {timezoneLabel}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-bold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stale Data Warning */}
      {(isDataStale || staleCount > 0) && matches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-yellow-400">Data may be outdated</p>
            <p className="text-xs text-yellow-500/80">
              Some match data hasn't been updated in over 15 minutes. Scores and statuses may not be current.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Bar */}
      {matches.length > 0 && (
        <div className="flex items-center gap-4 text-xs">
          {liveMatches.length > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {liveMatches.length} Live
            </span>
          )}
          <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Clock className="w-3.5 h-3.5" />
            {upcomingMatches.length} Upcoming
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Trophy className="w-3.5 h-3.5" />
            {finishedMatches.length} Finished
          </span>
        </div>
      )}

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

      {!isLoading && matches.length === 0 && !error && (
        <div className="text-center py-16 space-y-4">
          <WifiOff className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-lg font-bold text-muted-foreground">No matches found for today</p>
          <p className="text-sm text-muted-foreground">Click refresh to scrape latest match data.</p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="mt-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            {isRefreshing ? "Scraping..." : "Scrape Matches Now"}
          </button>
        </div>
      )}

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <MatchSection title="Live Now" icon="🔴" matches={liveMatches} formatTime={formatTime} />
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <MatchSection title="Upcoming" icon="⏰" matches={upcomingMatches} formatTime={formatTime} />
      )}

      {/* Finished Matches */}
      {finishedMatches.length > 0 && (
        <MatchSection title="Finished" icon="✅" matches={finishedMatches} formatTime={formatTime} />
      )}
    </div>
  );
};

function MatchSection({ title, icon, matches, formatTime }: {
  title: string;
  icon: string;
  matches: CS2Match[];
  formatTime: (t: string | null) => string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <span>{icon}</span> {title}
        </span>
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] text-muted-foreground font-bold">{matches.length} matches</span>
      </div>

      <div className="space-y-2">
        {matches.map((m, i) => (
          <MatchCard key={m.id} match={m} index={i} formatTime={formatTime} />
        ))}
      </div>
    </div>
  );
}

function MatchCard({ match: m, index, formatTime }: {
  match: CS2Match;
  index: number;
  formatTime: (t: string | null) => string;
}) {
  const cfg = statusConfig[m.status] || statusConfig.upcoming;
  const StatusIcon = cfg.icon;

  const matchLink = `/dashboard/match/${m.id}?team1=${encodeURIComponent(m.team1_name)}&team2=${encodeURIComponent(m.team2_name)}&event=${encodeURIComponent(m.tournament_name || "")}&format=${encodeURIComponent(m.match_format)}&time=${encodeURIComponent(m.start_time_utc || "")}&rank1=${m.team1_rank}&rank2=${m.team2_rank}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        to={matchLink}
        className="group flex items-center gap-4 rounded-xl bg-card border border-border p-4 hover:border-primary/40 transition-all"
      >
        {/* Status Badge */}
        <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.color}`}>
          {m.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </div>

        {/* Time */}
        <div className="w-14 shrink-0 text-center">
          <p className="text-sm font-black">{formatTime(m.start_time_utc)}</p>
        </div>

        <div className="h-8 w-px bg-border shrink-0" />

        {/* Teams */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <TeamLogo name={m.team1_name} size={28} />
          <span className="font-bold text-sm truncate">{m.team1_name}</span>
          {m.score ? (
            <span className="text-sm font-black text-primary shrink-0">{m.score}</span>
          ) : (
            <span className="text-xs text-muted-foreground font-bold shrink-0">VS</span>
          )}
          <span className="font-bold text-sm truncate">{m.team2_name}</span>
          <TeamLogo name={m.team2_name} size={28} />
        </div>

        {/* Tournament */}
        <div className="hidden lg:flex flex-col items-center gap-0.5 w-40 shrink-0">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Tournament</span>
          <span className="text-xs font-semibold text-center truncate w-full">{m.tournament_name || "—"}</span>
        </div>

        {/* Format */}
        <div className="hidden md:flex flex-col items-center gap-0.5 w-12 shrink-0">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">FMT</span>
          <span className="text-xs font-black uppercase">{m.match_format}</span>
        </div>

        {/* Stale indicator */}
        {m.is_stale && (
          <span className="shrink-0" aria-label="Data may be outdated">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          </span>
        )}
      </Link>
    </motion.div>
  );
}

export default TodaysMatches;
