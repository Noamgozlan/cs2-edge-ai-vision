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
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_KEY =
      Deno.env.get("SUPABASE_SECRET_KEY") ??
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const today = new Date().toISOString().slice(0, 10);
    log(`Scanning for CS2 matches on ${today} via OpenRouter...`);

    // Use OpenRouter's fallback routing across free models
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cs2-edge-ai-vision.lovable.app",
        "X-Title": "CS2 Edge AI",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: `You are a CS2 esports data specialist. Today is ${today}. Return ALL CS2 professional matches scheduled for today as a JSON array.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no explanation. Just the raw JSON array.

Each match object must have these fields:
- "team1": string (official team name)
- "team2": string (official team name)
- "team1_logo": string (URL to team 1 logo from HLTV or other esports CDN, e.g. "https://img-cdn.hltv.org/teamlogo/...")
- "team2_logo": string (URL to team 2 logo from HLTV or other esports CDN)
- "tournament": string (event/tournament name)
- "start_time_utc": string (HH:MM in UTC 24h format)
- "format": string (bo1, bo3, or bo5)
- "status": string (upcoming, live, or finished)
- "score": string (e.g. "2-1" if finished/live, "" if upcoming)
- "team1_rank": number (HLTV world ranking, 0 if unknown)
- "team2_rank": number (HLTV world ranking, 0 if unknown)

Include tier 1 and tier 2 matches from: BLAST, IEM, ESL Pro League, PGL Major, FACEIT League, CCT, Thunderpick, Perfect World, regional leagues, etc.

For team logos, use the HLTV CDN format: https://img-cdn.hltv.org/teamlogo/HASH.svg or .png - use actual known logo URLs for well-known teams.`,
          },
          {
            role: "user",
            content: `List ALL CS2 professional matches for today ${today}. Return ONLY a JSON array of match objects, nothing else.`,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      const body = await aiResponse.text();
      logError(`OpenRouter error ${status}: ${body}`);
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`OpenRouter error ${status}: ${body}`);
    }

    const aiData = await aiResponse.json();
    const usedModel = aiData.model || "unknown";
    log(`Response from model: ${usedModel}`);

    const content = aiData.choices?.[0]?.message?.content || "";
    log(`Raw content length: ${content.length}`);

    // Parse JSON from response
    let aiMatches: any[] = [];
    try {
      aiMatches = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          aiMatches = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          logError(`Failed to parse extracted JSON: ${e2}`);
          return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content.slice(0, 500) }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } else {
        logError("No JSON array found in AI response");
        return new Response(JSON.stringify({ error: "No match data in AI response", raw: content.slice(0, 500) }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (!Array.isArray(aiMatches)) aiMatches = [];
    log(`Found ${aiMatches.length} matches`);

    if (aiMatches.length === 0) {
      return new Response(JSON.stringify({
        success: true, source: "openrouter", model: usedModel,
        matchesFound: 0, matchesUpserted: 0, date: today,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Upsert matches
    let upserted = 0;
    for (const m of aiMatches) {
      if (!m.team1 || !m.team2) continue;

      let startTimeUtc: string | null = null;
      if (m.start_time_utc) {
        const timeParts = m.start_time_utc.match(/(\d{1,2}):(\d{2})/);
        if (timeParts) {
          const dt = new Date(`${today}T${timeParts[1].padStart(2, "0")}:${timeParts[2]}:00Z`);
          if (!isNaN(dt.getTime())) startTimeUtc = dt.toISOString();
        }
      }

      const sourceId = `ai-${m.team1}-${m.team2}-${today}`.replace(/\s+/g, "-").toLowerCase();

      const { error } = await supabase.from("cs2_matches").upsert({
        source: "openrouter-ai",
        source_match_id: sourceId,
        start_time_utc: startTimeUtc,
        team1_name: m.team1.trim(),
        team2_name: m.team2.trim(),
        team1_logo: m.team1_logo || null,
        team2_logo: m.team2_logo || null,
        team1_rank: m.team1_rank || 0,
        team2_rank: m.team2_rank || 0,
        tournament_name: m.tournament || "CS2 Match",
        match_format: m.format || "bo3",
        status: m.status || "upcoming",
        score: m.score || null,
        last_updated_utc: new Date().toISOString(),
        is_stale: false,
      }, { onConflict: "source,source_match_id" });

      if (error) {
        logError(`Upsert error for ${m.team1} vs ${m.team2}: ${error.message}`);
      } else {
        upserted++;
      }
    }

    const elapsed = Date.now() - startTime;
    log(`Done: ${upserted}/${aiMatches.length} matches upserted in ${elapsed}ms`);

    return new Response(JSON.stringify({
      success: true, source: "openrouter", model: usedModel,
      matchesFound: aiMatches.length, matchesUpserted: upserted,
      date: today, elapsedMs: elapsed,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    logError(`Fatal: ${error}`);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
