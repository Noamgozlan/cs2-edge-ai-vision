import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace(/^\/cs2-matches-api/, "");
    const tz = url.searchParams.get("tz") || "UTC";

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_PUBLISHABLE_KEY =
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

    // Route: /today
    if (pathname === "/today" || pathname === "/" || pathname === "") {
      const todayStart = getTodayBounds(tz);
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from("cs2_matches")
        .select("*")
        .gte("start_time_utc", todayStart.toISOString())
        .lt("start_time_utc", todayEnd.toISOString())
        .order("start_time_utc", { ascending: true });

      // Also get matches with null start_time (unknown time, today's matches)
      const { data: unknownTime } = await supabase
        .from("cs2_matches")
        .select("*")
        .is("start_time_utc", null)
        .in("status", ["upcoming", "live"])
        .order("created_at", { ascending: false })
        .limit(20);

      const allMatches = [...(data || []), ...(unknownTime || [])];

      if (error) throw error;
      return jsonResponse({ matches: allMatches, staleCount: allMatches.filter((m: any) => m.is_stale).length });
    }

    // Route: /live
    if (pathname === "/live") {
      const { data, error } = await supabase
        .from("cs2_matches")
        .select("*")
        .eq("status", "live")
        .order("start_time_utc", { ascending: true });

      if (error) throw error;
      return jsonResponse({ matches: data || [] });
    }

    // Route: /upcoming
    if (pathname === "/upcoming") {
      const { data, error } = await supabase
        .from("cs2_matches")
        .select("*")
        .eq("status", "upcoming")
        .order("start_time_utc", { ascending: true })
        .limit(50);

      if (error) throw error;
      return jsonResponse({ matches: data || [] });
    }

    // Route: /{id}
    const idMatch = pathname.match(/^\/([a-f0-9-]+)$/);
    if (idMatch) {
      const { data, error } = await supabase
        .from("cs2_matches")
        .select("*")
        .eq("id", idMatch[1])
        .single();

      if (error) throw error;
      if (!data) return jsonResponse({ error: "Match not found" }, 404);
      return jsonResponse({ match: data });
    }

    return jsonResponse({ error: "Unknown route", routes: ["/today", "/live", "/upcoming", "/{id}"] }, 400);

  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getTodayBounds(tz: string): Date {
  // Simple timezone offset handling for common zones
  const now = new Date();
  const offsets: Record<string, number> = {
    "UTC": 0, "GMT": 0,
    "CET": 1, "CEST": 2,
    "EST": -5, "EDT": -4,
    "CST": -6, "CDT": -5,
    "MST": -7, "MDT": -6,
    "PST": -8, "PDT": -7,
    "JST": 9, "KST": 9,
    "AEST": 10, "AEDT": 11,
  };

  const offset = offsets[tz.toUpperCase()] || 0;
  const localTime = new Date(now.getTime() + offset * 60 * 60 * 1000);
  localTime.setUTCHours(0, 0, 0, 0);
  return new Date(localTime.getTime() - offset * 60 * 60 * 1000);
}
