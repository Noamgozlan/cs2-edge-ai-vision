import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_PUBLISHABLE_KEY =
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

    // Get today's date range in UTC
    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Fetch only bettable matches (upcoming + live, not finished)
    const { data: dbMatches, error } = await supabase
      .from("cs2_matches")
      .select("*")
      .gte("start_time_utc", todayStart.toISOString())
      .lt("start_time_utc", todayEnd.toISOString())
      .neq("status", "finished")
      .order("start_time_utc", { ascending: true });

    if (error) {
      console.error("DB query error:", error);
    }

    let allMatches = dbMatches || [];
    const freshestUpdate = allMatches.reduce<number>((latest, match: any) => {
      const timestamp = match?.last_updated_utc ? new Date(match.last_updated_utc).getTime() : 0;
      return Math.max(latest, Number.isFinite(timestamp) ? timestamp : 0);
    }, 0);
    const cacheAgeMs = freshestUpdate > 0 ? Date.now() - freshestUpdate : Number.POSITIVE_INFINITY;
    const shouldRefreshFromPandaScore =
      allMatches.length === 0 ||
      cacheAgeMs > 10 * 60 * 1000 ||
      allMatches.every((match: any) => Boolean(match?.is_stale));

    // If DB is empty or stale, trigger PandaScore sync and re-query
    if (shouldRefreshFromPandaScore) {
      console.log(
        allMatches.length === 0
          ? "DB empty, triggering PandaScore sync..."
          : `Match cache stale (${Math.round(cacheAgeMs / 60000)}m old), triggering PandaScore sync...`
      );
      try {
        await supabase.functions.invoke("pandascore-matches");
        const { data: refreshed } = await supabase
          .from("cs2_matches")
          .select("*")
          .gte("start_time_utc", todayStart.toISOString())
          .lt("start_time_utc", todayEnd.toISOString())
          .neq("status", "finished")
          .order("start_time_utc", { ascending: true });
        allMatches = refreshed || [];
      } catch (e) {
        console.error("PandaScore sync error:", e);
      }
    }

    if (allMatches.length > 0) {
      console.log(`Returning ${allMatches.length} matches from database`);
      const matches = allMatches.map((m: any, i: number) => ({
        id: m.id || String(i + 1),
        team1: m.team1_name,
        team2: m.team2_name,
        event: m.tournament_name || "CS2 Match",
        time: m.start_time_utc || "TBD",
        format: formatString(m.match_format),
        rank1: m.team1_rank || 0,
        rank2: m.team2_rank || 0,
        score1: parseScore(m.score, 0),
        score2: parseScore(m.score, 1),
        status: m.status || "upcoming",
        team1Badge: m.team1_logo || null,
        team2Badge: m.team2_logo || null,
      }));

      return new Response(JSON.stringify({ matches }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try BallDontLie API
    console.log("No DB matches, trying BallDontLie API...");
    const API_KEY = Deno.env.get("BALLDONTLIE_API_KEY");
    if (API_KEY) {
      try {
        const res = await fetch("https://api.balldontlie.io/cs/v1/matches?per_page=50", {
          headers: { Authorization: API_KEY },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.data?.length > 0) {
            const matches = data.data.map((m: any) => ({
              id: m.id?.toString() || String(Math.random()),
              team1: m.team_1?.name || "TBD",
              team2: m.team_2?.name || "TBD",
              event: m.tournament?.name || "CS2 Match",
              time: m.start_time || m.scheduled_at || "TBD",
              format: formatString(m.format || m.best_of?.toString() || "bo3"),
              rank1: m.team_1?.ranking || 0,
              rank2: m.team_2?.ranking || 0,
              score1: m.team_1_score ?? null,
              score2: m.team_2_score ?? null,
              status: normalizeStatus(m.status),
              team1Badge: m.team_1?.logo_url || null,
              team2Badge: m.team_2?.logo_url || null,
            }));
            console.log(`Returning ${matches.length} from BallDontLie`);
            return new Response(JSON.stringify({ matches }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
      } catch (e) {
        console.error("BallDontLie error:", e);
      }
    }

    // Final fallback: trigger AI discovery and return placeholder
    console.log("No matches found anywhere, returning empty");
    return new Response(JSON.stringify({ matches: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ matches: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function formatString(raw: string): string {
  const f = raw?.toLowerCase() || "bo3";
  if (f === "bo1" || f === "best_of_1" || f === "1") return "Bo1";
  if (f === "bo5" || f === "best_of_5" || f === "5") return "Bo5";
  return "Bo3";
}

function normalizeStatus(raw: string): string {
  const s = (raw || "").toLowerCase();
  if (s.includes("live") || s.includes("started") || s.includes("running")) return "live";
  if (s.includes("finished") || s.includes("completed") || s.includes("ended")) return "finished";
  return "upcoming";
}

function parseScore(score: string | null, idx: number): number | null {
  if (!score) return null;
  const parts = score.split("-").map(s => parseInt(s.trim()));
  return parts[idx] ?? null;
}
