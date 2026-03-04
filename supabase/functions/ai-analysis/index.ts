import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { team1, team2, event, format } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an elite CS2 esports betting analyst with deep knowledge of the current competitive CS2 scene (2024-2025). You don't just predict match winners — you find the SMARTEST, highest-value bets across ALL available markets.

CRITICAL: Do NOT always recommend a match winner bet. Think like a sharp bettor. Consider ALL bet types and recommend whichever offers the BEST expected value:

BET TYPES TO CONSIDER:
- Match Winner (ML) — only when there's clear value
- Map Handicap (e.g. "+1.5 maps" or "-1.5 maps")
- Total Maps Over/Under (e.g. "Over 2.5 maps" in Bo3)
- Total Rounds Over/Under (e.g. "Over 26.5 rounds on Map 1")
- Round Handicap (e.g. "Team A -4.5 rounds on their map pick")
- Player Kills Over/Under (e.g. "Player X Over 22.5 kills on Map 1")
- Player to Top Frag (e.g. "donk to be top fragger")
- First Kill / Opening Duel winner
- Pistol Round winner
- Map-specific winner (e.g. "Team B to win Map 2")
- Exact Score (e.g. "2-1 correct score")
- Both Teams to Win a Map (Yes/No)

For each recommendation, explain WHY this specific bet type offers better value than just picking the match winner. Reference real stats, tendencies, and recent form.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, just pure JSON.

The JSON structure must be:
{
  "prediction": {
    "recommendedBet": "The single best bet with odds (e.g. 'donk Over 23.5 kills Map 1 @ 1.85' or 'NaVi -1.5 maps @ 2.40')",
    "betType": "kills_over | map_handicap | match_winner | total_maps | total_rounds | round_handicap | pistol_round | first_kill | map_winner | exact_score | both_win_map | top_fragger",
    "confidence": 72,
    "winProbability": { "team1": 55, "team2": 45 }
  },
  "alternativeBets": [
    {
      "bet": "Description with odds (e.g. 'Over 2.5 maps @ 1.90')",
      "betType": "total_maps",
      "confidence": 68,
      "reasoning": "One sentence why this is a good bet"
    },
    {
      "bet": "Another smart bet",
      "betType": "player_kills",
      "confidence": 65,
      "reasoning": "One sentence reasoning"
    }
  ],
  "veto": [
    { "action": "ban", "team": "Team1", "map": "MapName" },
    { "action": "ban", "team": "Team2", "map": "MapName" },
    { "action": "pick", "team": "Team1", "map": "MapName" },
    { "action": "pick", "team": "Team2", "map": "MapName" },
    { "action": "decider", "team": "Decider", "map": "MapName / MapName" }
  ],
  "analysis": {
    "summary": "2-3 sentence overview explaining why the recommended bet (not just match winner) is the smartest play. Reference specific stats.",
    "sections": [
      { "title": "Recent Form", "emoji": "🔥", "content": "Detailed analysis of recent performance..." },
      { "title": "Map Pool Analysis", "emoji": "🗺️", "content": "Map pool comparison..." },
      { "title": "Key Players", "emoji": "⭐", "content": "Star player matchup analysis with kill averages, opening duel rates..." },
      { "title": "Head-to-Head", "emoji": "⚔️", "content": "Historical matchup data..." },
      { "title": "Tournament Context", "emoji": "🏆", "content": "Stage/pressure analysis..." },
      { "title": "Betting Edge", "emoji": "💰", "content": "Why the recommended bet type is smarter than just picking the winner. What market inefficiency exists." }
    ]
  },
  "odds": {
    "team1": { "hltv": "2.10", "bet365": "2.15", "ggbet": "2.05", "pinnacle": "2.12" },
    "team2": { "hltv": "1.72", "bet365": "1.68", "ggbet": "1.75", "pinnacle": "1.70" }
  },
  "playerStats": [
    { "name": "PlayerName", "team": "Team1", "rating": "1.15", "kpr": "0.75", "dpr": "0.62", "impact": "1.20" }
  ]
}

Provide 2-4 alternative bets in "alternativeBets". Each should be a DIFFERENT bet type. Always include at least one player prop and one map/round based bet.

Use REAL player names for the actual teams. Use realistic odds values. Base confidence on actual team strength differentials and market value.`;

    const userPrompt = `Analyze this CS2 match and find the SMARTEST bet — not just who wins, but the highest-value bet across all markets (player kills, map handicaps, round totals, etc.):

Match: ${team1} vs ${team2}
Event: ${event || "Premier Tournament"}
Format: ${format || "Bo3"}

Think like a professional sharp bettor. What bet offers the best edge? Consider player props, totals, handicaps, and exotic markets. Use real player names, real map pools, and realistic statistics.`;

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
      console.error("Failed to parse AI response as JSON:", content);
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
