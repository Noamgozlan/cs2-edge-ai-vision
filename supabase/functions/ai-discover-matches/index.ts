import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const log = (msg: string) => console.log(`[ai-matches] ${msg}`);
  const logError = (msg: string) => console.error(`[ai-matches] ${msg}`);
  const startTime = Date.now();

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const today = new Date().toISOString().slice(0, 10);
    log(`Scanning for CS2 matches on ${today}...`);

    // Ask AI for today's CS2 matches using tool calling for structured output
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a CS2 esports data specialist. Your job is to provide accurate information about today's Counter-Strike 2 professional matches. Today's date is ${today}. 

You must return ALL CS2 matches scheduled for today, including:
- Upcoming matches that haven't started yet
- Currently live matches
- Matches that already finished today

For each match provide: team names (official team names), tournament/event name, start time in UTC (24h format like "14:30"), match format (bo1/bo3/bo5), status (upcoming/live/finished), and score if finished or live.

Focus on tier 1 and tier 2 professional matches from events like: BLAST, IEM, ESL Pro League, PGL Major, FACEIT League, CCT, Thunderpick, Betway, Perfect World, and regional leagues.

Be as complete as possible. Include ALL matches you know about for today.`,
          },
          {
            role: "user",
            content: `What are all the CS2 professional matches scheduled for today, ${today}? Include upcoming, live, and finished matches. Return them using the provide_matches function.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_matches",
              description: "Provide the list of today's CS2 professional matches.",
              parameters: {
                type: "object",
                properties: {
                  matches: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        team1: { type: "string", description: "First team name" },
                        team2: { type: "string", description: "Second team name" },
                        tournament: { type: "string", description: "Tournament or event name" },
                        start_time_utc: { type: "string", description: "Start time in HH:MM UTC format (24h), e.g. '14:30'" },
                        format: { type: "string", enum: ["bo1", "bo3", "bo5"], description: "Match format" },
                        status: { type: "string", enum: ["upcoming", "live", "finished"], description: "Match status" },
                        score: { type: "string", description: "Score if live or finished, e.g. '2-1'. Empty string if upcoming." },
                      },
                      required: ["team1", "team2", "tournament", "start_time_utc", "format", "status"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["matches"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_matches" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const body = await aiResponse.text();
      if (status === 429) {
        logError("Rate limited by AI gateway");
        return new Response(JSON.stringify({ error: "Rate limited, please try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        logError("AI credits exhausted");
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error ${status}: ${body}`);
    }

    const aiData = await aiResponse.json();
    log(`AI response received`);

    // Extract matches from tool call response
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      logError("No tool call in AI response");
      return new Response(JSON.stringify({ error: "AI did not return structured data", raw: aiData }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: { matches: any[] };
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      logError(`Failed to parse tool call arguments: ${e}`);
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiMatches = parsed.matches || [];
    log(`AI found ${aiMatches.length} matches for ${today}`);

    if (aiMatches.length === 0) {
      log("No matches found by AI for today");
      return new Response(JSON.stringify({
        success: true,
        source: "lovable-ai",
        matchesFound: 0,
        matchesUpserted: 0,
        date: today,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Upsert matches into database
    let upserted = 0;
    for (const m of aiMatches) {
      if (!m.team1 || !m.team2) continue;

      // Build proper start time from HH:MM
      let startTimeUtc: string | null = null;
      if (m.start_time_utc) {
        const timeParts = m.start_time_utc.match(/(\d{1,2}):(\d{2})/);
        if (timeParts) {
          const dt = new Date(`${today}T${timeParts[1].padStart(2, "0")}:${timeParts[2]}:00Z`);
          if (!isNaN(dt.getTime())) {
            startTimeUtc = dt.toISOString();
          }
        }
      }

      const sourceId = `ai-${m.team1}-${m.team2}-${today}`.replace(/\s+/g, "-").toLowerCase();

      const { error } = await supabase
        .from("cs2_matches")
        .upsert({
          source: "lovable-ai",
          source_match_id: sourceId,
          start_time_utc: startTimeUtc,
          team1_name: m.team1.trim(),
          team2_name: m.team2.trim(),
          tournament_name: m.tournament || "CS2 Match",
          match_format: m.format || "bo3",
          status: m.status || "upcoming",
          score: m.score || null,
          last_updated_utc: new Date().toISOString(),
          is_stale: false,
        }, {
          onConflict: "source,source_match_id",
        });

      if (error) {
        logError(`Upsert error for ${m.team1} vs ${m.team2}: ${error.message}`);
      } else {
        upserted++;
      }
    }

    const elapsed = Date.now() - startTime;
    log(`Done: ${upserted}/${aiMatches.length} matches upserted in ${elapsed}ms`);

    return new Response(JSON.stringify({
      success: true,
      source: "lovable-ai",
      matchesFound: aiMatches.length,
      matchesUpserted: upserted,
      date: today,
      elapsedMs: elapsed,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    logError(`Fatal: ${error}`);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
