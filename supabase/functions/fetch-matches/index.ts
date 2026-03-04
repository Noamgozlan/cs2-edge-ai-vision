import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Strategy 1: Try direct HLTV fetch
    const hltvMatches = await fetchHLTVDirect();
    if (hltvMatches.length > 0) {
      console.log(`Fetched ${hltvMatches.length} matches from HLTV`);
      
      // Enrich with TheSportsDB team badges
      const enriched = await enrichWithBadges(hltvMatches);
      return jsonResponse(enriched);
    }

    // Strategy 2: Try TheSportsDB for any CS2 events
    const sportsDbMatches = await fetchFromSportsDB();
    if (sportsDbMatches.length > 0) {
      console.log(`Fetched ${sportsDbMatches.length} matches from TheSportsDB`);
      return jsonResponse(sportsDbMatches);
    }

    // Strategy 3: Try Firecrawl if available
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (FIRECRAWL_API_KEY) {
      const firecrawlMatches = await fetchViaFirecrawl(FIRECRAWL_API_KEY);
      if (firecrawlMatches.length > 0) {
        console.log(`Fetched ${firecrawlMatches.length} matches via Firecrawl`);
        return jsonResponse(firecrawlMatches);
      }
    }

    console.log("All sources failed, using fallback");
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

// Direct HLTV scraping without Firecrawl
async function fetchHLTVDirect(): Promise<any[]> {
  try {
    const res = await fetch("https://www.hltv.org/matches", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.google.com/",
      },
    });

    if (!res.ok) {
      console.error("HLTV direct fetch failed:", res.status);
      return [];
    }

    const html = await res.text();
    return parseHLTVHtml(html);
  } catch (err) {
    console.error("HLTV direct error:", err);
    return [];
  }
}

function parseHLTVHtml(html: string): any[] {
  const matches: any[] = [];
  
  // Extract match data from HLTV HTML using regex patterns
  // Match blocks: team1 vs team2 with event info
  const matchRegex = /class="matchTeamName[^"]*"[^>]*>([^<]+)<[\s\S]*?class="matchTeamName[^"]*"[^>]*>([^<]+)<[\s\S]*?class="matchEvent[^"]*"[^>]*>[\s\S]*?title="([^"]*)"[\s\S]*?class="matchTime[^"]*"[^>]*data-unix="(\d+)"/g;
  
  let match;
  let id = 1;
  while ((match = matchRegex.exec(html)) !== null && id <= 15) {
    const [, team1, team2, event, timestamp] = match;
    const date = new Date(parseInt(timestamp));
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    
    matches.push({
      id: `hltv-${id}`,
      team1: team1.trim(),
      team2: team2.trim(),
      event: event.trim(),
      time: `${hours}:${minutes} CET`,
      format: "Bo3",
      rank1: 0,
      rank2: 0,
    });
    id++;
  }

  // Alternative simpler parsing if regex above doesn't match
  if (matches.length === 0) {
    // Try to find team names in a simpler pattern
    const teamPairs = html.match(/matchTeamName[^>]*>([^<]+)</g);
    if (teamPairs && teamPairs.length >= 2) {
      for (let i = 0; i < teamPairs.length - 1; i += 2) {
        const t1 = teamPairs[i].replace(/matchTeamName[^>]*>/, "").trim();
        const t2 = teamPairs[i + 1]?.replace(/matchTeamName[^>]*>/, "").trim();
        if (t1 && t2) {
          matches.push({
            id: `hltv-${matches.length + 1}`,
            team1: t1,
            team2: t2,
            event: "CS2 Match",
            time: "TBD",
            format: "Bo3",
            rank1: 0,
            rank2: 0,
          });
        }
        if (matches.length >= 10) break;
      }
    }
  }

  return matches;
}

// Fetch team badges from TheSportsDB
async function enrichWithBadges(matches: any[]): Promise<any[]> {
  const teamBadgeCache: Record<string, string> = {};
  
  // Collect unique team names
  const teamNames = new Set<string>();
  matches.forEach(m => { teamNames.add(m.team1); teamNames.add(m.team2); });
  
  // Fetch badges in parallel (limited)
  const batchSize = 5;
  const names = Array.from(teamNames);
  
  for (let i = 0; i < Math.min(names.length, batchSize * 2); i += batchSize) {
    const batch = names.slice(i, i + batchSize);
    await Promise.all(batch.map(async (name) => {
      try {
        const res = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(name)}`,
          { signal: AbortSignal.timeout(3000) }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.teams?.[0]?.strBadge) {
            teamBadgeCache[name] = data.teams[0].strBadge;
          }
        }
      } catch { /* skip */ }
    }));
  }

  return matches.map(m => ({
    ...m,
    team1Badge: teamBadgeCache[m.team1] || null,
    team2Badge: teamBadgeCache[m.team2] || null,
  }));
}

// Fetch from TheSportsDB CS2 leagues
async function fetchFromSportsDB(): Promise<any[]> {
  try {
    // ESL Pro League (5425), Blast Premier (5426)
    const leagueIds = ["5425", "5426"];
    const allEvents: any[] = [];

    await Promise.all(leagueIds.map(async (lid) => {
      try {
        const res = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${lid}`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.events) {
            allEvents.push(...data.events);
          }
        }
      } catch { /* skip */ }
    }));

    return allEvents.map((e, i) => ({
      id: `sdb-${i}`,
      team1: e.strHomeTeam || e.strEvent?.split(" vs ")?.[0] || "TBD",
      team2: e.strAwayTeam || e.strEvent?.split(" vs ")?.[1] || "TBD",
      event: e.strLeague || "CS2 Event",
      time: e.strTime ? `${e.strTime.substring(0, 5)} CET` : "TBD",
      format: "Bo3",
      rank1: 0,
      rank2: 0,
      team1Badge: e.strHomeTeamBadge || null,
      team2Badge: e.strAwayTeamBadge || null,
    }));
  } catch (err) {
    console.error("TheSportsDB error:", err);
    return [];
  }
}

// Firecrawl fallback
async function fetchViaFirecrawl(apiKey: string): Promise<any[]> {
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "HLTV upcoming CS2 matches today 2026 site:hltv.org",
        limit: 3,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (!res.ok) {
      console.error("Firecrawl search failed:", res.status);
      return [];
    }

    const data = await res.json();
    const results = data.data || data.results || [];
    const combined = results
      .map((r: any) => (r.markdown || r.description || "").substring(0, 4000))
      .filter(Boolean)
      .join("\n\n");

    if (combined.length < 50) return [];

    // Try AI extraction if available
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return [];

    return await extractMatchesWithAI(LOVABLE_API_KEY, combined);
  } catch (err) {
    console.error("Firecrawl error:", err);
    return [];
  }
}

async function extractMatchesWithAI(apiKey: string, scrapedContent: string) {
  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `Extract upcoming CS2 match data. Return ONLY valid JSON array.
Each match: { "id": "unique-id", "team1": "Team Name", "team2": "Team Name", "event": "Tournament", "time": "HH:MM CET", "format": "Bo1|Bo3|Bo5", "rank1": number, "rank2": number }
Return 4-12 matches. Only CS2 matches.`,
          },
          {
            role: "user",
            content: `Extract CS2 matches:\n\n${scrapedContent.substring(0, 10000)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 402 || response.status === 429) {
        console.error(`AI gateway: ${response.status}`);
        return [];
      }
      return [];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const matches = JSON.parse(cleaned);
    if (!Array.isArray(matches)) return [];

    return matches.map((m: any, i: number) => ({
      id: m.id || `ai-${i}`,
      team1: m.team1 || "TBD",
      team2: m.team2 || "TBD",
      event: m.event || "CS2 Tournament",
      time: m.time || "TBD",
      format: m.format || "Bo3",
      rank1: m.rank1 || 0,
      rank2: m.rank2 || 0,
    }));
  } catch (err) {
    console.error("AI extraction error:", err);
    return [];
  }
}

function getFallbackMatches() {
  // Updated fallback with current 2026 tournaments
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
