import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GRID_GRAPHQL_URL = "https://api-op.grid.gg/central-data/graphql";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const matches = await fetchFromGRID();
    if (matches.length > 0) {
      console.log(`Fetched ${matches.length} matches from GRID`);
      return jsonResponse(matches);
    }

    console.log("GRID returned no matches, using fallback");
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

async function fetchFromGRID(): Promise<any[]> {
  const GRID_API_KEY = Deno.env.get("GRID_API_KEY");
  if (!GRID_API_KEY) {
    console.error("GRID_API_KEY not configured");
    return [];
  }

  // Query upcoming and recent CS2 series
  const query = `
    query GetCS2Series {
      series(
        filter: {
          titleIds: [29]
          types: [BEST_OF_1, BEST_OF_2, BEST_OF_3, BEST_OF_5]
        }
        first: 20
        orderBy: StartTimeScheduled
        orderDirection: DESC
      ) {
        edges {
          node {
            id
            type
            format {
              value
            }
            startTimeScheduled
            state
            tournament {
              name
            }
            teams {
              baseInfo {
                name
                logoUrl
              }
              score
              won
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(GRID_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": GRID_API_KEY,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("GRID API error:", res.status, errText);

      // If the schema doesn't match, try a simpler query
      if (res.status === 400) {
        return await fetchFromGRIDSimple(GRID_API_KEY);
      }
      return [];
    }

    const json = await res.json();
    console.log("GRID response keys:", JSON.stringify(Object.keys(json)));

    if (json.errors) {
      console.error("GRID GraphQL errors:", JSON.stringify(json.errors));
      // Try simpler query on schema errors
      return await fetchFromGRIDSimple(GRID_API_KEY);
    }

    const edges = json.data?.series?.edges || [];
    if (edges.length === 0) {
      console.log("No series in GRID response, trying simple query");
      return await fetchFromGRIDSimple(GRID_API_KEY);
    }

    return edges.map((edge: any, i: number) => {
      const s = edge.node;
      const teams = s.teams || [];
      const team1 = teams[0]?.baseInfo?.name || "TBD";
      const team2 = teams[1]?.baseInfo?.name || "TBD";
      const team1Logo = teams[0]?.baseInfo?.logoUrl || null;
      const team2Logo = teams[1]?.baseInfo?.logoUrl || null;
      const score1 = teams[0]?.score ?? null;
      const score2 = teams[1]?.score ?? null;

      let time = "TBD";
      if (s.startTimeScheduled) {
        try {
          const d = new Date(s.startTimeScheduled);
          if (!isNaN(d.getTime())) {
            time = `${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")} CET`;
          }
        } catch { /* keep TBD */ }
      }

      const formatMap: Record<string, string> = {
        BEST_OF_1: "Bo1",
        BEST_OF_2: "Bo2",
        BEST_OF_3: "Bo3",
        BEST_OF_5: "Bo5",
      };
      const format = formatMap[s.type] || s.format?.value || "Bo3";

      const stateMap: Record<string, string> = {
        SCHEDULED: "upcoming",
        STARTED: "live",
        FINISHED: "finished",
      };
      const status = stateMap[s.state] || s.state || "upcoming";

      return {
        id: s.id?.toString() || `grid-${i}`,
        team1,
        team2,
        event: s.tournament?.name || "CS2 Tournament",
        time,
        format,
        rank1: 0,
        rank2: 0,
        score1,
        score2,
        status,
        team1Badge: team1Logo,
        team2Badge: team2Logo,
      };
    }).filter((m: any) => m.team1 !== "TBD" && m.team2 !== "TBD");
  } catch (err) {
    console.error("GRID fetch error:", err);
    return [];
  }
}

// Fallback simpler query if the schema differs
async function fetchFromGRIDSimple(apiKey: string): Promise<any[]> {
  const query = `
    {
      series(first: 20) {
        edges {
          node {
            id
            type
            startTimeScheduled
            state
            tournament {
              name
            }
            teams {
              baseInfo {
                name
                logoUrl
              }
              score
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(GRID_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      console.error("GRID simple query error:", res.status, await res.text());
      return [];
    }

    const json = await res.json();
    if (json.errors) {
      console.error("GRID simple query GraphQL errors:", JSON.stringify(json.errors));
      return [];
    }

    const edges = json.data?.series?.edges || [];
    console.log(`GRID simple query returned ${edges.length} series`);

    return edges.map((edge: any, i: number) => {
      const s = edge.node;
      const teams = s.teams || [];
      const team1 = teams[0]?.baseInfo?.name || "TBD";
      const team2 = teams[1]?.baseInfo?.name || "TBD";

      let time = "TBD";
      if (s.startTimeScheduled) {
        try {
          const d = new Date(s.startTimeScheduled);
          if (!isNaN(d.getTime())) {
            time = `${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")} CET`;
          }
        } catch { /* keep TBD */ }
      }

      const formatMap: Record<string, string> = {
        BEST_OF_1: "Bo1", BEST_OF_2: "Bo2", BEST_OF_3: "Bo3", BEST_OF_5: "Bo5",
      };

      return {
        id: s.id?.toString() || `grid-${i}`,
        team1,
        team2,
        event: s.tournament?.name || "CS2 Tournament",
        time,
        format: formatMap[s.type] || "Bo3",
        rank1: 0,
        rank2: 0,
        score1: teams[0]?.score ?? null,
        score2: teams[1]?.score ?? null,
        status: s.state === "STARTED" ? "live" : s.state === "FINISHED" ? "finished" : "upcoming",
        team1Badge: teams[0]?.baseInfo?.logoUrl || null,
        team2Badge: teams[1]?.baseInfo?.logoUrl || null,
      };
    }).filter((m: any) => m.team1 !== "TBD" && m.team2 !== "TBD");
  } catch (err) {
    console.error("GRID simple fetch error:", err);
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
  ];
}
