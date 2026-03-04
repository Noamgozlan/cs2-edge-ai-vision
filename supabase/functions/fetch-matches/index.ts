import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");

    if (!FIRECRAWL_API_KEY) {
      console.log("No FIRECRAWL_API_KEY, using fallback");
      return jsonResponse(getFallbackMatches());
    }

    // Use Firecrawl to search for real upcoming CS2 matches
    const [hltvResults, dustResults] = await Promise.all([
      firecrawlSearch(FIRECRAWL_API_KEY, "HLTV upcoming CS2 matches today 2026 site:hltv.org", 3),
      firecrawlSearch(FIRECRAWL_API_KEY, "CS2 matches schedule today results 2026", 2),
    ]);

    const combined = [...hltvResults, ...dustResults].join("\n\n");
    console.log(`Scraped ${combined.length} chars of match data`);

    if (combined.length < 50) {
      console.log("Insufficient scraped data, using fallback");
      return jsonResponse(getFallbackMatches());
    }

    // Use Lovable AI to extract structured match data from scraped content
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.log("No LOVABLE_API_KEY, using fallback");
      return jsonResponse(getFallbackMatches());
    }

    const matches = await extractMatchesWithAI(LOVABLE_API_KEY, combined);

    if (matches.length === 0) {
      console.log("AI extraction returned 0 matches, using fallback");
      return jsonResponse(getFallbackMatches());
    }

    console.log(`Extracted ${matches.length} real matches`);
    return jsonResponse(matches);
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

async function firecrawlSearch(apiKey: string, query: string, limit: number): Promise<string[]> {
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (!res.ok) {
      console.error("Firecrawl search failed:", res.status);
      return [];
    }

    const data = await res.json();
    const results = data.data || data.results || [];
    return results
      .map((r: any) => (r.markdown || r.description || "").substring(0, 4000))
      .filter(Boolean);
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
            content: `Extract upcoming/today's CS2 match data from the scraped content. Return ONLY valid JSON array of matches.

Each match object:
{ "id": "unique-id", "team1": "Team Name", "team2": "Team Name", "event": "Tournament Name", "time": "HH:MM CET", "format": "Bo1|Bo3|Bo5", "rank1": number, "rank2": number }

Rules:
- Use real team names exactly as shown (e.g., "Natus Vincere" not "NAVI")
- Use real tournament names
- Rank should be approximate HLTV ranking (1-100)
- Return 4-12 matches
- If time is unknown, use "TBD"
- Only include CS2/CSGO matches, not other games
- Return ONLY the JSON array, no markdown, no explanation`,
          },
          {
            role: "user",
            content: `Extract CS2 matches from this scraped data:\n\n${scrapedContent.substring(0, 10000)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      return [];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const matches = JSON.parse(cleaned);

    if (!Array.isArray(matches)) return [];

    return matches.map((m: any, i: number) => ({
      id: m.id || `live-${i}`,
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
  return [
    { id: "1", team1: "Natus Vincere", team2: "Team Vitality", event: "PGL Major Copenhagen 2025", time: "15:00 CET", format: "Bo3", rank1: 1, rank2: 2 },
    { id: "2", team1: "G2 Esports", team2: "FaZe Clan", event: "IEM Katowice 2025", time: "17:30 CET", format: "Bo3", rank1: 3, rank2: 4 },
    { id: "3", team1: "Team Spirit", team2: "MOUZ", event: "BLAST Premier Spring Finals", time: "19:00 CET", format: "Bo3", rank1: 5, rank2: 6 },
    { id: "4", team1: "Heroic", team2: "Virtus.pro", event: "ESL Pro League S21", time: "12:00 CET", format: "Bo3", rank1: 7, rank2: 8 },
    { id: "5", team1: "Cloud9", team2: "Eternal Fire", event: "PGL Major Copenhagen 2025", time: "14:00 CET", format: "Bo3", rank1: 9, rank2: 10 },
    { id: "6", team1: "The MongolZ", team2: "paiN Gaming", event: "IEM Katowice 2025", time: "20:00 CET", format: "Bo1", rank1: 11, rank2: 12 },
    { id: "7", team1: "Complexity", team2: "BIG", event: "ESL Pro League S21", time: "16:00 CET", format: "Bo3", rank1: 13, rank2: 14 },
    { id: "8", team1: "3DMAX", team2: "SAW", event: "BLAST Premier Spring Groups", time: "18:30 CET", format: "Bo3", rank1: 15, rank2: 16 },
  ];
}
