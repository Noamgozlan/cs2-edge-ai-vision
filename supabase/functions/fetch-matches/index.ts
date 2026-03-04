import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Primary: RapidAPI CSGO Matches
    const rapidApiMatches = await fetchFromRapidAPI();
    if (rapidApiMatches.length > 0) {
      console.log(`Fetched ${rapidApiMatches.length} matches from RapidAPI`);
      return jsonResponse(rapidApiMatches);
    }

    console.log("RapidAPI returned no matches, using fallback");
    return jsonResponse(getFallbackMatches());
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(getFallbackMatches());
  }
});

function jsonResponse(matches: any[]) {
  return new Response(JSON.stringify({ matches }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function fetchFromRapidAPI(): Promise<any[]> {
  const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY");
  if (!RAPIDAPI_KEY) {
    console.error("RAPIDAPI_KEY not configured");
    return [];
  }

  try {
    const res = await fetch(
      "https://csgo-matches-and-tournaments.p.rapidapi.com/matches?page=1&limit=20",
      {
        headers: {
          "x-rapidapi-host": "csgo-matches-and-tournaments.p.rapidapi.com",
          "x-rapidapi-key": RAPIDAPI_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error("RapidAPI error:", res.status, await res.text());
      return [];
    }

    const json = await res.json();
    console.log("RapidAPI raw response keys:", Object.keys(json));

    // API returns { data: [...], meta: {...} }
    const matchList = Array.isArray(json) ? json : json.data || json.matches || json.results || [];

    if (!Array.isArray(matchList) || matchList.length === 0) {
      console.log("No matches in RapidAPI response");
      return [];
    }

    console.log("First match sample:", JSON.stringify(matchList[0]).substring(0, 600));

    return matchList.map((m: any, i: number) => {
      // The API uses team_won / team_lose structure
      const team1Name = m.team_won?.title || m.team1?.name || m.teams?.[0]?.name || m.home_team?.name || "TBD";
      const team2Name = m.team_lose?.title || m.team2?.name || m.teams?.[1]?.name || m.away_team?.name || "TBD";

      // Event / tournament
      const event = m.event?.title || m.tournament?.name || m.event?.name || m.league?.name || "CS2 Match";

      // Time from created_at or other date fields
      let time = "TBD";
      const timestamp = m.played_at || m.created_at || m.date || m.start_time || m.scheduled_at || m.begin_at;
      if (timestamp) {
        try {
          const d = new Date(timestamp);
          if (!isNaN(d.getTime())) {
            time = `${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")} CET`;
          }
        } catch { /* keep TBD */ }
      }

      // Format - check best_of or number_of_games
      const bo = m.best_of || m.bestOf || m.number_of_games || 3;
      const format = m.format || `Bo${bo}`;

      // Scores
      const score1 = m.score_won ?? m.team1?.score ?? m.teams?.[0]?.score ?? null;
      const score2 = m.score_lose ?? m.team2?.score ?? m.teams?.[1]?.score ?? null;

      // Status
      const status = m.status || m.state || (score1 != null ? "finished" : "upcoming");

      // Team logos
      const team1Logo = m.team_won?.image_url || m.team1?.logo || null;
      const team2Logo = m.team_lose?.image_url || m.team2?.logo || null;

      // Stars as a rough rank proxy
      const stars = m.stars || 0;

      return {
        id: m.id?.toString() || `rapid-${i}`,
        team1: team1Name,
        team2: team2Name,
        event,
        time,
        format: typeof format === "string" ? format : `Bo${bo}`,
        rank1: stars > 0 ? stars : 0,
        rank2: 0,
        score1,
        score2,
        status,
        team1Badge: team1Logo,
        team2Badge: team2Logo,
      };
    }).filter((m: any) => m.team1 !== "TBD" && m.team2 !== "TBD");
  } catch (err) {
    console.error("RapidAPI fetch error:", err);
    return [];
  }
}

function getFallbackMatches() {
  return [
    { id: "1", team1: "Natus Vincere", team2: "Team Vitality", event: "PGL Major Berlin 2026", time: "15:00 CET", format: "Bo3", rank1: 1, rank2: 2 },
    { id: "2", team1: "G2 Esports", team2: "FaZe Clan", event: "IEM Katowice 2026", time: "17:30 CET", format: "Bo3", rank1: 3, rank2: 4 },
    { id: "3", team1: "Team Spirit", team2: "MOUZ", event: "BLAST Premier Spring 2026", time: "19:00 CET", format: "Bo3", rank1: 5, rank2: 6 },
    { id: "4", team1: "Heroic", team2: "Virtus.pro", event: "ESL Pro League S23", time: "12:00 CET", format: "Bo3", rank1: 7, rank2: 8 },
    { id: "5", team1: "Cloud9", team2: "Eternal Fire", event: "PGL Major Berlin 2026", time: "14:00 CET", format: "Bo3", rank1: 9, rank2: 10 },
    { id: "6", team1: "The MongolZ", team2: "paiN Gaming", event: "IEM Katowice 2026", time: "20:00 CET", format: "Bo1", rank1: 11, rank2: 12 },
    { id: "7", team1: "Complexity", team2: "BIG", event: "ESL Pro League S23", time: "16:00 CET", format: "Bo3", rank1: 13, rank2: 14 },
    { id: "8", team1: "3DMAX", team2: "SAW", event: "BLAST Premier Spring 2026", time: "18:30 CET", format: "Bo3", rank1: 15, rank2: 16 },
  ];
}
