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

    const systemPrompt = `You are an elite CS2 esports analyst with deep knowledge of the current competitive CS2 scene (2024-2025). You analyze matches using real team data, player statistics, map pools, recent form, and historical performance.

When given two teams, provide a comprehensive analysis in JSON format. Use your knowledge of the actual CS2 competitive scene - real player names, real map pools, real team tendencies, real recent results.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, just pure JSON.

The JSON structure must be:
{
  "prediction": {
    "recommendedBet": "Team Name ML @ odds",
    "confidence": 72,
    "winProbability": { "team1": 55, "team2": 45 }
  },
  "veto": [
    { "action": "ban", "team": "Team1", "map": "MapName" },
    { "action": "ban", "team": "Team2", "map": "MapName" },
    { "action": "pick", "team": "Team1", "map": "MapName" },
    { "action": "pick", "team": "Team2", "map": "MapName" },
    { "action": "decider", "team": "Decider", "map": "MapName / MapName" }
  ],
  "analysis": {
    "summary": "2-3 sentence overview of why this bet is recommended",
    "sections": [
      { "title": "Recent Form", "emoji": "🔥", "content": "Detailed analysis of recent performance..." },
      { "title": "Map Pool Analysis", "emoji": "🗺️", "content": "Map pool comparison..." },
      { "title": "Key Players", "emoji": "⭐", "content": "Star player matchup analysis..." },
      { "title": "Head-to-Head", "emoji": "⚔️", "content": "Historical matchup data..." },
      { "title": "Tournament Context", "emoji": "🏆", "content": "Stage/pressure analysis..." }
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

Use REAL player names for the actual teams. Use realistic odds values. Base confidence on actual team strength differentials.`;

    const userPrompt = `Analyze this CS2 match and provide a detailed betting analysis:

Match: ${team1} vs ${team2}
Event: ${event || "Premier Tournament"}
Format: ${format || "Bo3"}

Provide your analysis based on the current CS2 competitive landscape. Use real player names, real map pools, and realistic statistics for these teams.`;

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

    // Parse JSON from response (handle possible markdown wrapping)
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
