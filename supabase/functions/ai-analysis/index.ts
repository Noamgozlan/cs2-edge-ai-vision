import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function scrapeHLTVData(team1: string, team2: string): Promise<string> {
  const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
  if (!FIRECRAWL_API_KEY) {
    console.log("No FIRECRAWL_API_KEY, skipping HLTV scraping");
    return "";
  }

  const scrapeSearch = async (query: string, limit = 2) => {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          limit,
          scrapeOptions: { formats: ["markdown"] },
        }),
      });
      if (!res.ok) return "";
      const data = await res.json();
      const results = data.data || data.results || [];
      return results
        .map((r: any) => {
          const content = r.markdown || r.description || "";
          // Truncate each result to avoid token overflow
          return content.substring(0, 3000);
        })
        .filter(Boolean)
        .join("\n\n");
    } catch (err) {
      console.error(`Search failed for: ${query}`, err);
      return "";
    }
  };

  console.log(`Scraping real data for ${team1} vs ${team2}...`);

  const [team1Stats, team2Stats, h2h, team1Recent, team2Recent] = await Promise.all([
    scrapeSearch(`${team1} CS2 HLTV team stats players rating 2025`),
    scrapeSearch(`${team2} CS2 HLTV team stats players rating 2025`),
    scrapeSearch(`${team1} vs ${team2} CS2 head to head results 2025`),
    scrapeSearch(`${team1} CS2 recent match results 2025`, 1),
    scrapeSearch(`${team2} CS2 recent match results 2025`, 1),
  ]);

  const sections: string[] = [];
  if (team1Stats) sections.push(`=== ${team1} STATS ===\n${team1Stats}`);
  if (team2Stats) sections.push(`=== ${team2} STATS ===\n${team2Stats}`);
  if (h2h) sections.push(`=== HEAD TO HEAD ===\n${h2h}`);
  if (team1Recent) sections.push(`=== ${team1} RECENT RESULTS ===\n${team1Recent}`);
  if (team2Recent) sections.push(`=== ${team2} RECENT RESULTS ===\n${team2Recent}`);

  const combined = sections.join("\n\n");
  console.log(`Scraped ${combined.length} chars of real data`);
  
  // Cap at ~12k chars to not overflow context
  return combined.substring(0, 12000);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { team1, team2, event, format, language } = await req.json();
    const lang = language || "en";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Scrape real data from HLTV via Firecrawl
    const realData = await scrapeHLTVData(team1, team2);

    const languageMap: Record<string, string> = {
      en: "English", he: "Hebrew", ar: "Arabic", es: "Spanish", fr: "French",
      de: "German", pt: "Portuguese", ru: "Russian", zh: "Chinese", ja: "Japanese",
      ko: "Korean", tr: "Turkish",
    };
    const outputLanguage = languageMap[lang] || "English";

    const systemPrompt = `You are an elite CS2 esports betting analyst. You find the SMARTEST, highest-value bets across ALL available markets — not just match winner.

CRITICAL: ALL text output (analysis summaries, section titles, section content, recommended bet descriptions, alternative bet reasoning, betting edge explanations) MUST be written in ${outputLanguage}. Keep team names, player names, map names, and statistical values in their original form. Only translate descriptive text.

${realData ? `IMPORTANT: You have been given REAL, LIVE scraped data from HLTV and other sources below. Use this REAL data as the foundation of your analysis. Reference actual stats, actual recent results, actual player ratings from the data. Do NOT make up stats — if the data doesn't cover something, say so.

=== REAL SCRAPED DATA ===
${realData}
=== END SCRAPED DATA ===` : "Use your knowledge of the current CS2 competitive scene."}

BET TYPES TO CONSIDER (pick the SMARTEST one, not always match winner):
- Match Winner (ML) — only when there's clear value
- Map Handicap (e.g. "+1.5 maps" or "-1.5 maps")
- Total Maps Over/Under (e.g. "Over 2.5 maps" in Bo3)
- Total Rounds Over/Under (e.g. "Over 26.5 rounds on Map 1")
- Round Handicap (e.g. "Team A -4.5 rounds on their map pick")
- Player Kills Over/Under (e.g. "Player X Over 22.5 kills on Map 1")
- Player to Top Frag
- First Kill / Opening Duel winner
- Pistol Round winner
- Map-specific winner
- Exact Score (e.g. "2-1 correct score")
- Both Teams to Win a Map (Yes/No)

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks.

JSON structure:
{
  "prediction": {
    "recommendedBet": "The single best bet with odds",
    "betType": "kills_over | map_handicap | match_winner | total_maps | total_rounds | round_handicap | pistol_round | first_kill | map_winner | exact_score | both_win_map | top_fragger",
    "confidence": 72,
    "winProbability": { "team1": 55, "team2": 45 },
    "expectedValue": "+12.5%"
  },
  "alternativeBets": [
    {
      "bet": "Description with odds",
      "betType": "total_maps",
      "confidence": 68,
      "reasoning": "One sentence why"
    }
  ],
  "veto": [
    { "action": "ban", "team": "Team1", "map": "MapName" },
    { "action": "ban", "team": "Team2", "map": "MapName" },
    { "action": "pick", "team": "Team1", "map": "MapName" },
    { "action": "pick", "team": "Team2", "map": "MapName" },
    { "action": "decider", "team": "Decider", "map": "MapName" }
  ],
  "mapBreakdown": [
    {
      "map": "Mirage",
      "team1WinRate": 62,
      "team2WinRate": 48,
      "team1CtWinPct": 58,
      "team1TWinPct": 42,
      "team2CtWinPct": 55,
      "team2TWinPct": 45,
      "team1PistolWinPct": 60,
      "team2PistolWinPct": 45,
      "totalRoundsAvg": 25.4,
      "edge": "Team1 favored - strong CT side"
    }
  ],
  "playerForm": [
    {
      "name": "PlayerName",
      "team": "Team1",
      "recentRatings": [1.15, 1.02, 0.98, 1.22, 1.08, 0.95, 1.18, 1.05, 1.12, 0.99],
      "trend": "stable | rising | declining",
      "avgKills": 21.5,
      "clutchRate": "12%",
      "openingDuelWinRate": "55%"
    }
  ],
  "analysis": {
    "summary": "2-3 sentences referencing REAL stats from the scraped data",
    "sections": [
      { "title": "Recent Form", "emoji": "🔥", "content": "Reference real recent results..." },
      { "title": "Map Pool Analysis", "emoji": "🗺️", "content": "Real map win rates..." },
      { "title": "Key Players", "emoji": "⭐", "content": "Real player ratings and kill averages..." },
      { "title": "Head-to-Head", "emoji": "⚔️", "content": "Real H2H data..." },
      { "title": "Tournament Context", "emoji": "🏆", "content": "Stage analysis..." },
      { "title": "Betting Edge", "emoji": "💰", "content": "Why this bet type beats match winner..." }
    ]
  },
  "odds": {
    "team1": { "pinnacle": "2.10", "bet365": "2.15", "ggbet": "2.05" },
    "team2": { "pinnacle": "1.72", "bet365": "1.68", "ggbet": "1.75" }
  },
  "playerStats": [
    { "name": "PlayerName", "team": "Team1", "rating": "1.15", "kpr": "0.75", "dpr": "0.62", "impact": "1.20" }
  ],
  "dataSource": "live" or "training"
}

Provide 2-4 alternative bets of DIFFERENT types. Include at least one player prop.
Use REAL player names. If you have scraped data, mark dataSource as "live", otherwise "training".
Include mapBreakdown with 3-5 maps showing CT/T side splits, pistol round rates, and total rounds averages.
Include playerForm with 3-5 key players per team showing their last 10 match ratings as an array, trend direction, avg kills, clutch rate, and opening duel win rate.`;

    const userPrompt = `Find the SMARTEST bet for this CS2 match:

Match: ${team1} vs ${team2}
Event: ${event || "Premier Tournament"}
Format: ${format || "Bo3"}

Use the real scraped data provided to ground your analysis. What bet offers the best edge?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits needed. Add funds in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in AI response");

    let analysisJson;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysisJson = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content.substring(0, 500));
      throw new Error("Invalid AI response format");
    }

    return new Response(JSON.stringify(analysisJson), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
