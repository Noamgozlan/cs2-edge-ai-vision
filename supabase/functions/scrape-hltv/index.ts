import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { team1, team2 } = await req.json();
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY is not configured");

    // Scrape team pages from HLTV for real stats
    const scrapeTeam = async (teamName: string) => {
      const searchQuery = `${teamName} site:hltv.org`;
      
      try {
        // Use Firecrawl search to find the team's HLTV page
        const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `${teamName} CS2 team stats players roster 2025`,
            limit: 3,
            scrapeOptions: { formats: ["markdown"] },
          }),
        });

        if (!searchRes.ok) {
          console.error(`Firecrawl search failed for ${teamName}:`, searchRes.status);
          return null;
        }

        const searchData = await searchRes.json();
        const results = searchData.data || searchData.results || [];
        
        // Combine all markdown content
        const combinedContent = results
          .map((r: any) => r.markdown || r.description || "")
          .filter(Boolean)
          .join("\n\n---\n\n");

        return combinedContent || null;
      } catch (err) {
        console.error(`Error scraping ${teamName}:`, err);
        return null;
      }
    };

    // Scrape head-to-head data
    const scrapeH2H = async (t1: string, t2: string) => {
      try {
        const res = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `${t1} vs ${t2} CS2 head to head results 2025`,
            limit: 3,
            scrapeOptions: { formats: ["markdown"] },
          }),
        });

        if (!res.ok) return null;
        const data = await res.json();
        const results = data.data || data.results || [];
        return results
          .map((r: any) => r.markdown || r.description || "")
          .filter(Boolean)
          .join("\n\n---\n\n") || null;
      } catch {
        return null;
      }
    };

    // Scrape recent match results
    const scrapeRecentResults = async (teamName: string) => {
      try {
        const res = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `${teamName} CS2 recent match results 2025`,
            limit: 2,
            tbs: "qdr:m",
            scrapeOptions: { formats: ["markdown"] },
          }),
        });

        if (!res.ok) return null;
        const data = await res.json();
        const results = data.data || data.results || [];
        return results
          .map((r: any) => r.markdown || r.description || "")
          .filter(Boolean)
          .join("\n\n") || null;
      } catch {
        return null;
      }
    };

    console.log(`Scraping HLTV data for: ${team1} vs ${team2}`);

    // Run all scrapes in parallel
    const [team1Data, team2Data, h2hData, team1Recent, team2Recent] = await Promise.all([
      scrapeTeam(team1),
      scrapeTeam(team2),
      scrapeH2H(team1, team2),
      scrapeRecentResults(team1),
      scrapeRecentResults(team2),
    ]);

    const scrapedData = {
      team1: {
        name: team1,
        stats: team1Data,
        recentResults: team1Recent,
      },
      team2: {
        name: team2,
        stats: team2Data,
        recentResults: team2Recent,
      },
      headToHead: h2hData,
      scrapedAt: new Date().toISOString(),
    };

    console.log(`Scraping complete. Data lengths - T1: ${team1Data?.length || 0}, T2: ${team2Data?.length || 0}, H2H: ${h2hData?.length || 0}`);

    return new Response(JSON.stringify(scrapedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("HLTV scraping error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Scraping failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
