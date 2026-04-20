import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type OddsPayload = {
  team1: string;
  team2: string;
  event?: string;
};

type BettingCompareRow = {
  sportsbook: string;
  market: string;
  team1Odds?: number | null;
  team2Odds?: number | null;
  drawOdds?: number | null;
  bookmakerUrl?: string | null;
};

type BettingCompareResponse = {
  matchUrl?: string | null;
  markets: Array<{
    name: string;
    rows: BettingCompareRow[];
  }>;
  lastUpdated: string;
  source: "hltv" | "fallback";
};

type FirecrawlSearchResult = {
  url?: string;
  markdown?: string;
  description?: string;
  title?: string;
};

async function firecrawlSearch(query: string, limit = 5): Promise<FirecrawlSearchResult[]> {
  const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!firecrawlApiKey) {
    return [];
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (!response.ok) {
      console.warn(`Firecrawl search failed for "${query}" with ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.data || data.results || []) as FirecrawlSearchResult[];
  } catch (error) {
    console.error(`Firecrawl search error for "${query}":`, error);
    return [];
  }
}

async function firecrawlScrape(url: string): Promise<{ html: string; markdown: string }> {
  const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!firecrawlApiKey) {
    return { html: "", markdown: "" };
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["html", "markdown"],
      }),
    });

    if (!response.ok) {
      console.warn(`Firecrawl scrape failed for "${url}" with ${response.status}`);
      return { html: "", markdown: "" };
    }

    const data = await response.json();

    return {
      html: data?.data?.html || data?.html || "",
      markdown: data?.data?.markdown || data?.markdown || "",
    };
  } catch (error) {
    console.error(`Firecrawl scrape error for "${url}":`, error);
    return { html: "", markdown: "" };
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeBookmaker(name: string) {
  return name
    .replace(/\s+/g, " ")
    .replace(/\bbookmaker\b/i, "")
    .trim();
}

function cleanMarketName(name: string) {
  const normalized = name.replace(/\s+/g, " ").trim();
  if (!normalized) return "Match Winner";
  if (/winner/i.test(normalized) || /match/i.test(normalized)) return "Match Winner";
  return normalized;
}

function toDecimalOdds(raw: string) {
  const value = raw.replace(",", ".").trim();
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCandidateOdds(line: string, team1: string, team2: string): BettingCompareRow | null {
  const normalized = line.replace(/\s+/g, " ").trim();
  if (!normalized) return null;

  const oddsMatches = [...normalized.matchAll(/\b\d+(?:[.,]\d+)?\b/g)].map((match) => match[0]);
  if (oddsMatches.length < 2 || oddsMatches.length > 3) {
    return null;
  }

  if (!new RegExp(`\\b${escapeRegExp(team1)}\\b`, "i").test(normalized) && !new RegExp(`\\b${escapeRegExp(team2)}\\b`, "i").test(normalized)) {
    return null;
  }

  const leadingText = normalized.split(oddsMatches[0])[0] || "";
  const sportsbook = normalizeBookmaker(
    leadingText
      .replace(team1, "")
      .replace(team2, "")
      .replace(/match winner|winner|odds|betting/gi, "")
      .replace(/[-|:]+$/g, "")
      .trim(),
  );

  if (!sportsbook) {
    return null;
  }

  return {
    sportsbook,
    market: "Match Winner",
    team1Odds: toDecimalOdds(oddsMatches[0]),
    team2Odds: toDecimalOdds(oddsMatches[1]),
    drawOdds: oddsMatches[2] ? toDecimalOdds(oddsMatches[2]) : null,
  };
}

function parseMarkdownOdds(markdown: string, team1: string, team2: string) {
  const lines = markdown
    .split("\n")
    .map((line) => line.replace(/\*\*/g, "").replace(/\|/g, " ").trim())
    .filter(Boolean);

  const rows: BettingCompareRow[] = [];

  for (const line of lines) {
    const candidate = parseCandidateOdds(line, team1, team2);
    if (candidate) {
      rows.push(candidate);
    }
  }

  return dedupeRows(rows);
}

function parseHtmlOdds(html: string) {
  const blocks = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  const rows: BettingCompareRow[] = [];

  for (const block of blocks) {
    const text = block
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

    const oddsValues = [...text.matchAll(/\b\d+(?:\.\d+)?\b/g)].map((match) => match[0]);
    if (oddsValues.length < 2 || oddsValues.length > 3) {
      continue;
    }

    const anchorMatch = block.match(/href="([^"]+)"/i);
    const possibleBookmaker = text.split(oddsValues[0])[0]?.trim() || "";
    const sportsbook = normalizeBookmaker(possibleBookmaker);

    if (!sportsbook) {
      continue;
    }

    rows.push({
      sportsbook,
      market: "Match Winner",
      team1Odds: toDecimalOdds(oddsValues[0]),
      team2Odds: toDecimalOdds(oddsValues[1]),
      drawOdds: oddsValues[2] ? toDecimalOdds(oddsValues[2]) : null,
      bookmakerUrl: anchorMatch?.[1]
        ? anchorMatch[1].startsWith("http")
          ? anchorMatch[1]
          : `https://www.hltv.org${anchorMatch[1]}`
        : null,
    });
  }

  return dedupeRows(rows);
}

function dedupeRows(rows: BettingCompareRow[]) {
  const deduped = new Map<string, BettingCompareRow>();

  for (const row of rows) {
    const key = `${row.market.toLowerCase()}::${row.sportsbook.toLowerCase()}`;
    if (!deduped.has(key)) {
      deduped.set(key, row);
      continue;
    }

    const existing = deduped.get(key)!;
    const currentScore = Number(Boolean(row.bookmakerUrl)) + Number(Boolean(row.drawOdds));
    const existingScore = Number(Boolean(existing.bookmakerUrl)) + Number(Boolean(existing.drawOdds));
    if (currentScore > existingScore) {
      deduped.set(key, row);
    }
  }

  return [...deduped.values()].filter(
    (row) => row.team1Odds !== null && row.team1Odds !== undefined && row.team2Odds !== null && row.team2Odds !== undefined,
  );
}

function chooseBestMatchUrl(results: FirecrawlSearchResult[], payload: OddsPayload) {
  const eventHint = payload.event?.toLowerCase() || "";
  return (
    results
      .filter((result) => result.url?.includes("hltv.org/matches/"))
      .sort((a, b) => {
        const aText = `${a.title || ""} ${a.description || ""}`.toLowerCase();
        const bText = `${b.title || ""} ${b.description || ""}`.toLowerCase();
        const aScore =
          Number(aText.includes(payload.team1.toLowerCase())) +
          Number(aText.includes(payload.team2.toLowerCase())) +
          Number(eventHint ? aText.includes(eventHint) : false);
        const bScore =
          Number(bText.includes(payload.team1.toLowerCase())) +
          Number(bText.includes(payload.team2.toLowerCase())) +
          Number(eventHint ? bText.includes(eventHint) : false);
        return bScore - aScore;
      })[0]?.url || null
  );
}

function buildResponse(rows: BettingCompareRow[], matchUrl: string | null): BettingCompareResponse {
  const sortedRows = [...rows].sort((a, b) => {
    const aBest = Math.max(a.team1Odds || 0, a.team2Odds || 0, a.drawOdds || 0);
    const bBest = Math.max(b.team1Odds || 0, b.team2Odds || 0, b.drawOdds || 0);
    return bBest - aBest;
  });

  return {
    matchUrl,
    markets: sortedRows.length
      ? [
          {
            name: "Match Winner",
            rows: sortedRows,
          },
        ]
      : [],
    lastUpdated: new Date().toISOString(),
    source: "hltv",
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as OddsPayload;
    if (!payload?.team1 || !payload?.team2) {
      throw new Error("team1 and team2 are required");
    }

    const matchResults = await firecrawlSearch(
      `site:hltv.org/matches "${payload.team1}" "${payload.team2}" HLTV ${payload.event || "CS2"}`,
      5,
    );
    const matchUrl = chooseBestMatchUrl(matchResults, payload);

    if (!matchUrl) {
      return new Response(
        JSON.stringify({
          matchUrl: null,
          markets: [],
          lastUpdated: new Date().toISOString(),
          source: "fallback",
        } satisfies BettingCompareResponse),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { html, markdown } = await firecrawlScrape(matchUrl);
    const htmlRows = parseHtmlOdds(html);
    const markdownRows = parseMarkdownOdds(markdown, payload.team1, payload.team2);
    const mergedRows = dedupeRows([...htmlRows, ...markdownRows]);

    return new Response(JSON.stringify(buildResponse(mergedRows, matchUrl)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("HLTV odds scrape error:", error);
    return new Response(
      JSON.stringify({
        matchUrl: null,
        markets: [],
        lastUpdated: new Date().toISOString(),
        source: "fallback",
      } satisfies BettingCompareResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
