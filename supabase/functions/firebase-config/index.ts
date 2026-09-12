// Serves the Firebase *web* (client-side) configuration to the browser.
//
// Why this function exists:
// The Firebase web API key is public by design, but in this project the value
// is stored in the backend secret store (GOOGLE_API_KEY) rather than in a
// source-controlled file. This endpoint is therefore the single place where
// the public configuration is assembled. It deliberately exposes ONLY the
// web config — never a service account, private key, or any other
// server-side credential.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve((req) =>
{
  if (req.method === "OPTIONS")
  {
    return new Response("ok", { headers: corsHeaders });
  }

  const apiKey = Deno.env.get("GOOGLE_API_KEY");

  if (!apiKey)
  {
    // Fail loudly: a missing key must never look like a successful init.
    return new Response(
      JSON.stringify({ error: "GOOGLE_API_KEY is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const config = {
    apiKey,
    authDomain: "campus-eats-db.firebaseapp.com",
    databaseURL: "https://campus-eats-db-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "campus-eats-db",
    storageBucket: "campus-eats-db.firebasestorage.app",
    messagingSenderId: "64265928399",
    appId: "1:64265928399:web:1ed0d7f032fbdad34b01ba",
    measurementId: "G-8MSCNGN1XD",
  };

  return new Response(JSON.stringify(config), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
