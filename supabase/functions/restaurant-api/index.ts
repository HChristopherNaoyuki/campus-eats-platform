// CORS proxy for the Fake Restaurant API (the upstream sends no CORS headers,
// so browsers cannot call it directly).
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const UPSTREAM = "https://fakerestaurantapi.runasp.net";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // Everything after /restaurant-api is forwarded verbatim.
    const path = url.pathname.replace(/^\/functions\/v1/, "").replace(/^\/restaurant-api/, "");
    if (!path.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "Only /api/* paths are proxied" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const target = `${UPSTREAM}${path}${url.search}`;
    const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

    const upstream = await fetch(target, {
      method: req.method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body || undefined,
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Proxy failure" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
