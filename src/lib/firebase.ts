/**
 * Firebase bootstrap (browser side only).
 *
 * Design notes
 * ------------
 * - The Firebase web configuration is fetched once from the `firebase-config`
 *   backend function, so the API key never lives in source control. The key
 *   itself is public client configuration; the real security boundary is
 *   Firebase Authentication plus the Realtime Database rules.
 * - Initialization is memoised in a module-level promise, which guarantees
 *   Firebase is initialised exactly once per page/tab even when several
 *   components request it concurrently.
 * - Every failure is surfaced as a rejected promise. Callers must handle it;
 *   nothing here swallows an error.
 */
import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

const CONFIG_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/firebase-config`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let appPromise: Promise<FirebaseApp> | null = null;

/** Fetches the public web configuration from the backend function. */
async function loadConfig(): Promise<FirebaseOptions & { measurementId?: string }>
{
  const res = await fetch(CONFIG_URL, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });

  if (!res.ok)
  {
    throw new Error(`Firebase configuration unavailable (HTTP ${res.status})`);
  }

  return (await res.json()) as FirebaseOptions;
}

/** Returns the single FirebaseApp instance, creating it on first use. */
export function getFirebaseApp(): Promise<FirebaseApp>
{
  if (appPromise)
  {
    return appPromise;
  }

  appPromise = (async () =>
  {
    // Guard against a double initialise caused by HMR or duplicate imports.
    const existing = getApps();

    if (existing.length > 0)
    {
      return existing[0];
    }

    const config = await loadConfig();
    const app = initializeApp(config);

    // Analytics is optional: it is unsupported in some browsers/contexts and
    // must never block authentication or database access.
    if (config.measurementId)
    {
      isSupported()
        .then((ok) =>
        {
          if (ok)
          {
            getAnalytics(app);
          }
        })
        .catch((err) => console.warn("[firebase] analytics unavailable:", err));
    }

    return app;
  })();

  // Do not cache a failed bootstrap — allow a later retry.
  appPromise.catch(() =>
  {
    appPromise = null;
  });

  return appPromise;
}

export async function getFirebaseAuth(): Promise<Auth>
{
  return getAuth(await getFirebaseApp());
}

export async function getFirebaseDb(): Promise<Database>
{
  return getDatabase(await getFirebaseApp());
}
