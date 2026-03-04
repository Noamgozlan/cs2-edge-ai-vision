import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
];

function randomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const startTime = Date.now();
  const log = (msg: string) => console.log(`[scrape-cs2] ${msg}`);
  const logError = (msg: string) => console.error(`[scrape-cs2] ${msg}`);

  try {
    const FIRECRAWL_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!FIRECRAWL_KEY) {
      logError("FIRECRAWL_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Firecrawl not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Try sources in order: HLTV → Liquipedia → bo3.gg
    let matches: ParsedMatch[] = [];
    let source = "";

    // Source 1: HLTV
    log("Attempting HLTV scrape...");
    try {
      const hltvData = await scrapeWithFirecrawl(FIRECRAWL_KEY, "https://www.hltv.org/matches", "hltv");
      if (hltvData && hltvData.length > 0) {
        matches = hltvData;
        source = "hltv";
        log(`HLTV returned ${matches.length} matches`);
      }
    } catch (e) {
      logError(`HLTV scrape failed: ${e}`);
    }

    // Source 2: Liquipedia fallback
    if (matches.length === 0) {
      log("Trying Liquipedia fallback...");
      await sleep(3000); // Polite delay between sources
      try {
        const liqData = await scrapeWithFirecrawl(FIRECRAWL_KEY, "https://liquipedia.net/counterstrike/Liquipedia:Matches", "liquipedia");
        if (liqData && liqData.length > 0) {
          matches = liqData;
          source = "liquipedia";
          log(`Liquipedia returned ${matches.length} matches`);
        }
      } catch (e) {
        logError(`Liquipedia scrape failed: ${e}`);
      }
    }

    // Source 3: bo3.gg fallback
    if (matches.length === 0) {
      log("Trying bo3.gg fallback...");
      await sleep(3000);
      try {
        const bo3Data = await scrapeWithFirecrawl(FIRECRAWL_KEY, "https://bo3.gg/matches", "bo3gg");
        if (bo3Data && bo3Data.length > 0) {
          matches = bo3Data;
          source = "bo3gg";
          log(`bo3.gg returned ${matches.length} matches`);
        }
      } catch (e) {
        logError(`bo3.gg scrape failed: ${e}`);
      }
    }

    // If all sources fail, mark existing data as stale
    if (matches.length === 0) {
      log("All sources failed, marking existing data as stale");
      await supabase
        .from("cs2_matches")
        .update({ is_stale: true })
        .neq("status", "finished");

      return new Response(JSON.stringify({
        success: false,
        error: "All scraping sources failed",
        stale: true,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Upsert matches into database
    let upserted = 0;
    for (const match of matches) {
      const { error } = await supabase
        .from("cs2_matches")
        .upsert({
          source,
          source_match_id: match.sourceId,
          start_time_utc: match.startTime,
          team1_name: match.team1,
          team2_name: match.team2,
          team1_logo: match.team1Logo,
          team2_logo: match.team2Logo,
          team1_rank: match.team1Rank || 0,
          team2_rank: match.team2Rank || 0,
          tournament_name: match.tournament,
          match_format: match.format,
          status: match.status,
          score: match.score,
          map: match.map,
          url: match.url,
          last_updated_utc: new Date().toISOString(),
          is_stale: false,
        }, {
          onConflict: "source,source_match_id",
        });

      if (error) {
        logError(`Upsert error for ${match.team1} vs ${match.team2}: ${error.message}`);
      } else {
        upserted++;
      }
    }

    // Optional: Enrich with BallDontLie teams data
    try {
      const BDL_KEY = Deno.env.get("BALLDONTLIE_API_KEY");
      if (BDL_KEY) {
        await enrichWithBDL(supabase, BDL_KEY);
      }
    } catch (e) {
      log(`BDL enrichment skipped: ${e}`);
    }

    const elapsed = Date.now() - startTime;
    log(`Done: ${upserted}/${matches.length} matches upserted from ${source} in ${elapsed}ms`);

    return new Response(JSON.stringify({
      success: true,
      source,
      matchesFound: matches.length,
      matchesUpserted: upserted,
      elapsedMs: elapsed,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    logError(`Fatal error: ${error}`);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

interface ParsedMatch {
  sourceId: string;
  team1: string;
  team2: string;
  team1Logo?: string;
  team2Logo?: string;
  team1Rank?: number;
  team2Rank?: number;
  tournament: string;
  startTime: string | null;
  format: string;
  status: string;
  score?: string;
  map?: string;
  url?: string;
}

async function scrapeWithFirecrawl(apiKey: string, url: string, source: string): Promise<ParsedMatch[]> {
  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
      waitFor: 3000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Firecrawl error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const markdown = data?.data?.markdown || data?.markdown || "";

  if (!markdown || markdown.length < 100) {
    console.log(`[scrape-cs2] ${source}: insufficient content (${markdown.length} chars)`);
    return [];
  }

  return parseMatchesFromMarkdown(markdown, source, url);
}

function parseMatchesFromMarkdown(md: string, source: string, baseUrl: string): ParsedMatch[] {
  const matches: ParsedMatch[] = [];
  const lines = md.split("\n").map((l) => l.trim()).filter(Boolean);

  // Common patterns across sources:
  // "Team1 vs Team2" or "Team1 vs. Team2"
  // Look for lines with "vs" that indicate match pairings
  const vsRegex = /^(.+?)\s+(?:vs\.?|versus)\s+(.+?)$/i;
  const scoreRegex = /(\d+)\s*[-:]\s*(\d+)/;
  const timeRegex = /(\d{1,2}:\d{2})/;
  const formatRegex = /\b(bo[135]|best of [135])\b/i;
  const liveRegex = /\b(live|playing|ongoing)\b/i;
  const finishedRegex = /\b(finished|final|completed|ended)\b/i;

  let currentTournament = "";
  let currentTime = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect tournament headers (lines with tournament-like names)
    if (
      (line.startsWith("#") || line.startsWith("**")) &&
      !vsRegex.test(line) &&
      (line.includes("Major") || line.includes("Pro League") || line.includes("BLAST") ||
       line.includes("IEM") || line.includes("ESL") || line.includes("PGL") ||
       line.includes("Tournament") || line.includes("League") || line.includes("Cup") ||
       line.includes("Championship") || line.includes("Open") || line.includes("Qualifier"))
    ) {
      currentTournament = line.replace(/^[#*\s]+/, "").replace(/[*]+$/, "").trim();
      continue;
    }

    // Detect time
    const timeMatch = line.match(timeRegex);
    if (timeMatch && !vsRegex.test(line)) {
      currentTime = timeMatch[1];
      continue;
    }

    // Detect match lines
    const vsMatch = line.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").match(vsRegex);
    if (vsMatch) {
      const team1 = vsMatch[1].replace(/^[\s#*|]+/, "").replace(/[\s|]+$/, "").trim();
      const team2 = vsMatch[2].replace(/^[\s#*|]+/, "").replace(/[\s|]+$/, "").trim();

      if (!team1 || !team2 || team1.length > 40 || team2.length > 40) continue;
      if (team1.toLowerCase() === "tbd" || team2.toLowerCase() === "tbd") continue;

      // Look at surrounding context for metadata
      const context = lines.slice(Math.max(0, i - 3), Math.min(lines.length, i + 4)).join(" ");

      let status = "upcoming";
      if (liveRegex.test(context)) status = "live";
      else if (finishedRegex.test(context)) status = "finished";

      let score: string | undefined;
      const scoreMatch = context.match(scoreRegex);
      if (scoreMatch && status !== "upcoming") {
        score = `${scoreMatch[1]}-${scoreMatch[2]}`;
      }

      let format = "bo3";
      const fmtMatch = context.match(formatRegex);
      if (fmtMatch) {
        const f = fmtMatch[1].toLowerCase().replace(/\s+/g, "");
        if (f.includes("1")) format = "bo1";
        else if (f.includes("5")) format = "bo5";
      }

      // Build start time
      let startTime: string | null = null;
      const lineTime = line.match(timeRegex);
      const t = lineTime?.[1] || currentTime;
      if (t) {
        const today = new Date();
        const [h, m] = t.split(":").map(Number);
        if (!isNaN(h) && !isNaN(m)) {
          today.setUTCHours(h, m, 0, 0);
          startTime = today.toISOString();
        }
      }

      // Find tournament from context if not set
      if (!currentTournament) {
        // Try to extract from nearby lines
        for (let j = Math.max(0, i - 5); j < i; j++) {
          const l = lines[j];
          if (l.includes("Major") || l.includes("Pro League") || l.includes("BLAST") ||
              l.includes("IEM") || l.includes("ESL") || l.includes("PGL")) {
            currentTournament = l.replace(/^[#*\s]+/, "").replace(/[*]+$/, "").trim();
            break;
          }
        }
      }

      const sourceId = `${source}-${team1}-${team2}-${startTime || Date.now()}`.replace(/\s+/g, "-").toLowerCase();

      matches.push({
        sourceId,
        team1,
        team2,
        tournament: currentTournament || "CS2 Match",
        startTime,
        format,
        status,
        score,
        url: baseUrl,
      });
    }
  }

  return matches;
}

async function enrichWithBDL(supabase: any, apiKey: string) {
  try {
    const res = await fetch("https://api.balldontlie.io/cs/v1/teams?per_page=100", {
      headers: { Authorization: apiKey },
    });
    if (!res.ok) return;

    const data = await res.json();
    if (!data?.data) return;

    for (const team of data.data) {
      if (!team.name) continue;
      await supabase
        .from("cs2_teams")
        .upsert({
          name: team.name,
          short_name: team.short_name || null,
          logo_url: team.logo_url || team.image_url || null,
        }, { onConflict: "name" });
    }
    console.log(`[scrape-cs2] Enriched ${data.data.length} teams from BDL`);
  } catch (e) {
    console.log(`[scrape-cs2] BDL enrichment error: ${e}`);
  }
}
