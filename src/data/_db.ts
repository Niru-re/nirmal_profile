import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Returns a Supabase client for server-side data fetching.
 * Uses the plain supabase-js client and supports optional server-only
 * service role key fallback for server-side operations.
 * Returns null when env vars are missing so every data function
 * can fall back to static data gracefully.
 */
export async function loadSupabaseServerClientOrNull(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const key = anonKey || serviceRoleKey;

  if (
    !url ||
    !key ||
    url.includes("your-project-ref") ||
    key.includes("your_supabase_anon_public_key") ||
    key.includes("YOUR_SERVICE_ROLE_KEY")
  ) {
    return null;
  }

  if (!_client) {
    _client = createSupabaseClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return _client;
}
