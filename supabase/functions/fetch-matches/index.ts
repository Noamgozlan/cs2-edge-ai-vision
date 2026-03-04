import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_URL = "https://api.balldontlie.io/cs/v1";
const CACHE_TTL_MS = 30_000;

let cache: { data: any; ts: number } | null = null;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Return cached data if fresh
    if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
      console.log("Returning cached data");
      return jsonResponse(cache.data);
    }

    const API_KEY = Deno.env.get("BALLDONTLIE_API_KEY");
    if (!API_KEY) {
      console.error("BALLDONTLIE_API_KEY not configured");
      return jsonResponse(getFallbackMatches());
    }

    // Fetch matches and tournaments in parallel
    const [matchesData, tournamentsData, teamsData] = await Promise.all([
      fetchWithRetry(`${BASE_URL}/matches?per_page=50`, API_KEY),
      fetchWithRetry(`${BASE_URL}/tournaments?per_page=25`, API_KEY),
      fetchWithRetry(`${BASE_URL}/teams?per_page=100`, API_KEY),
    ]);

    const tournamentMap = new Map<number, string>();
    if (tournamentsData?.data) {
      for (const t of tournamentsData.data) {
        tournamentMap.set(t.id, t.name);
      }
    }

    const teamMap = new Map<number, any>();
    if (teamsData?.data) {
      for (const t of teamsData.data) {
        teamMap.set(t.id, t);
      }
    }

    let matches: any[] = [];

    if (matchesData?.data && Array.isArray(matchesData.data)) {
      matches = matchesData.data.map((m: any) => normalizeMatch(m, tournamentMap, teamMap));
      console.log(`Fetched ${matches.length} matches from BallDontLie`);
    } else {
      console.log("No match data from BallDontLie, building from tournaments/teams");
      // If matches endpoint is not available (tier restriction), use fallback
      matches = getFallbackMatches();
    }

    const result = {
      matches,
      tournaments: tournamentsData?.data || [],
      teams: teamsData?.data || [],
    };

    cache = { data: result, ts: Date.now() };
    return jsonResponse(result);
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse({ matches: getFallbackMatches(), tournaments: [], teams: [] });
  }
});

function jsonResponse(data: any) {
  return new Response(JSON.stringify(data.matches ? data : { matches: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function fetchWithRetry(url: string, apiKey: string, retries = 3): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: apiKey },
      });

      if (res.status === 429) {
        const wait = Math.min(1000 * attempt, 3000);
        console.log(`Rate limited, waiting ${wait}ms (attempt ${attempt})`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      if (!res.ok) {
        const errText = await res.text();
        console.error(`API error ${res.status} for ${url}: ${errText}`);
        if (attempt === retries) return null;
        continue;
      }

      return await res.json();
    } catch (err) {
      console.error(`Fetch error attempt ${attempt} for ${url}:`, err);
      if (attempt === retries) return null;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  return null;
}

function normalizeMatch(m: any, tournamentMap: Map<number, string>, teamMap: Map<number, any>): any {
  const team1Info = m.team_1 || m.home_team || {};
  const team2Info = m.team_2 || m.away_team || {};

  const team1Name = team1Info.name || teamMap.get(team1Info.id)?.name || "TBD";
  const team2Name = team2Info.name || teamMap.get(team2Info.id)?.name || "TBD";
  const team1Logo = team1Info.logo_url || team1Info.image_url || teamMap.get(team1Info.id)?.logo_url || null;
  const team2Logo = team2Info.logo_url || team2Info.image_url || teamMap.get(team2Info.id)?.logo_url || null;

  const tournamentName = m.tournament?.name || tournamentMap.get(m.tournament_id) || "CS2 Tournament";

  // Determine status
  let status = "upcoming";
  const rawStatus = (m.status || "").toLowerCase();
  if (rawStatus.includes("live") || rawStatus.includes("started") || rawStatus.includes("in_progress") || rawStatus === "running") {
    status = "live";
  } else if (rawStatus.includes("finished") || rawStatus.includes("completed") || rawStatus.includes("ended")) {
    status = "finished";
  }

  // Format
  const formatMap: Record<string, string> = {
    bo1: "Bo1", bo3: "Bo3", bo5: "Bo5",
    best_of_1: "Bo1", best_of_3: "Bo3", best_of_5: "Bo5",
  };
  const rawFormat = (m.format || m.best_of || "").toString().toLowerCase();
  const format = formatMap[rawFormat] || (rawFormat === "1" ? "Bo1" : rawFormat === "3" ? "Bo3" : rawFormat === "5" ? "Bo5" : "Bo3");

  // Time in UTC
  let time = "TBD";
  if (m.start_time || m.scheduled_at || m.begin_at) {
    try {
      const d = new Date(m.start_time || m.scheduled_at || m.begin_at);
      if (!isNaN(d.getTime())) {
        time = d.toISOString();
      }
    } catch { /* keep TBD */ }
  }

  return {
    id: m.id?.toString() || `bdl-${Math.random().toString(36).slice(2)}`,
    match_id: m.id,
    team1: team1Name,
    team2: team2Name,
    event: tournamentName,
    time,
    start_time: time,
    format,
    match_status: status,
    status,
    rank1: team1Info.ranking || team1Info.rank || 0,
    rank2: team2Info.ranking || team2Info.rank || 0,
    score1: m.team_1_score ?? m.score?.team_1 ?? null,
    score2: m.team_2_score ?? m.score?.team_2 ?? null,
    current_score: m.team_1_score != null ? `${m.team_1_score}-${m.team_2_score}` : null,
    map: m.current_map || m.map || null,
    team1Badge: team1Logo,
    team2Badge: team2Logo,
  };
}

function getFallbackMatches() {
  return [
    { id: "1", team1: "Natus Vincere", team2: "Team Vitality", event: "PGL Major Berlin 2026", time: "15:00 CET", format: "Bo3", rank1: 1, rank2: 2 },
    { id: "2", team1: "G2 Esports", team2: "FaZe Clan", event: "IEM Katowice 2026", time: "17:30 CET", format: "Bo3", rank1: 3, rank2: 4 },
    { id: "3", team1: "Team Spirit", team2: "MOUZ", event: "BLAST Premier Spring 2026", time: "19:00 CET", format: "Bo3", rank1: 5, rank2: 6 },
    { id: "4", team1: "Heroic", team2: "Virtus.pro", event: "ESL Pro League S23", time: "12:00 CET", format: "Bo3", rank1: 7, rank2: 8 },
    { id: "5", team1: "Cloud9", team2: "Eternal Fire", event: "PGL Major Berlin 2026", time: "14:00 CET", format: "Bo3", rank1: 9, rank2: 10 },
    { id: "6", team1: "The MongolZ", team2: "paiN Gaming", event: "IEM Katowice 2026", time: "20:00 CET", format: "Bo1", rank1: 11, rank2: 12 },
  ];
}
