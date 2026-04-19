import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const log = (m: string) => console.log(`[pandascore] ${m}`);
  const logError = (m: string) => console.error(`[pandascore] ${m}`);

  try {
    const PANDASCORE_API_KEY = Deno.env.get("PANDASCORE_API_KEY");
    if (!PANDASCORE_API_KEY) throw new Error("PANDASCORE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const rangeStr = `${todayStart.toISOString()},${todayEnd.toISOString()}`;

    // PandaScore CS endpoint - get upcoming + running matches today
    const endpoints = [
      `https://api.pandascore.co/csgo/matches/upcoming?range[begin_at]=${rangeStr}&per_page=50&sort=begin_at`,
      `https://api.pandascore.co/csgo/matches/running?per_page=50`,
    ];

    const allMatches: any[] = [];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${PANDASCORE_API_KEY}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          logError(`PandaScore ${url} -> ${res.status}: ${await res.text()}`);
          continue;
        }
        const data = await res.json();
        if (Array.isArray(data)) allMatches.push(...data);
      } catch (e) {
        logError(`Fetch error for ${url}: ${e}`);
      }
    }

    log(`Fetched ${allMatches.length} matches from PandaScore`);

    let upserted = 0;
    for (const m of allMatches) {
      const opps = m.opponents || [];
      const t1 = opps[0]?.opponent;
      const t2 = opps[1]?.opponent;
      if (!t1?.name || !t2?.name) continue;

      const status = m.status === "running" ? "live"
        : m.status === "finished" ? "finished"
        : "upcoming";

      const format = m.number_of_games === 1 ? "bo1"
        : m.number_of_games === 5 ? "bo5"
        : "bo3";

      const score = (m.results || []).map((r: any) => r.score).join("-") || null;

      const sourceId = `pandascore-${m.id}`;

      const { error } = await supabase.from("cs2_matches").upsert({
        source: "pandascore",
        source_match_id: sourceId,
        start_time_utc: m.begin_at || m.scheduled_at || null,
        team1_name: t1.name,
        team2_name: t2.name,
        team1_logo: t1.image_url || null,
        team2_logo: t2.image_url || null,
        team1_rank: 0,
        team2_rank: 0,
        tournament_name: m.league?.name
          ? `${m.league.name}${m.serie?.full_name ? " - " + m.serie.full_name : ""}`
          : "CS2 Match",
        match_format: format,
        status,
        score,
        url: m.live_url || m.official_stream_url || null,
        last_updated_utc: new Date().toISOString(),
        is_stale: false,
      }, { onConflict: "source,source_match_id" });

      if (error) {
        logError(`Upsert error: ${error.message}`);
      } else {
        upserted++;
      }
    }

    log(`Upserted ${upserted}/${allMatches.length}`);

    return new Response(JSON.stringify({
      success: true,
      source: "pandascore",
      matchesFound: allMatches.length,
      matchesUpserted: upserted,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    logError(`Fatal: ${error}`);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
