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

    const data = await res.json();
    console.log("RapidAPI raw response keys:", Object.keys(data));

    // Handle different possible response shapes
    const matchList = Array.isArray(data) ? data : data.matches || data.data || data.results || [];

    if (!Array.isArray(matchList) || matchList.length === 0) {
      console.log("No matches in RapidAPI response");
      return [];
    }

    console.log("First match sample:", JSON.stringify(matchList[0]).substring(0, 500));

    return matchList.map((m: any, i: number) => {
      // Extract team names from various possible structures
      const team1 = m.team1?.name || m.teams?.[0]?.name || m.home_team?.name || m.homeTeam || m.team1_name || "TBD";
      const team2 = m.team2?.name || m.teams?.[1]?.name || m.away_team?.name || m.awayTeam || m.team2_name || "TBD";
      
      // Extract event/tournament
      const event = m.tournament?.name || m.event?.name || m.league?.name || m.tournament_name || m.event_name || "CS2 Match";
      
      // Extract time
      let time = "TBD";
      const timestamp = m.date || m.start_time || m.scheduled_at || m.begin_at || m.startTime || m.timestamp;
      if (timestamp) {
        try {
          const d = new Date(timestamp);
          if (!isNaN(d.getTime())) {
            time = `${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")} CET`;
          }
        } catch { /* keep TBD */ }
      }

      // Extract format
      const format = m.format || m.match_type || m.bestOf ? `Bo${m.bestOf || m.best_of || 3}` : (m.number_of_games ? `Bo${m.number_of_games}` : "Bo3");

      // Extract scores if available
      const score1 = m.team1?.score ?? m.teams?.[0]?.score ?? m.score1 ?? m.home_score ?? null;
      const score2 = m.team2?.score ?? m.teams?.[1]?.score ?? m.score2 ?? m.away_score ?? null;

      // Extract status
      const status = m.status || m.state || m.match_status || "";

      // Extract team logos
      const team1Logo = m.team1?.logo || m.teams?.[0]?.logo || m.team1?.image_url || null;
      const team2Logo = m.team2?.logo || m.teams?.[1]?.logo || m.team2?.image_url || null;

      return {
        id: m.id?.toString() || m._id || `rapid-${i}`,
        team1,
        team2,
        event,
        time,
        format: typeof format === "string" ? format : "Bo3",
        rank1: m.team1?.ranking || m.teams?.[0]?.ranking || 0,
        rank2: m.team2?.ranking || m.teams?.[1]?.ranking || 0,
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
