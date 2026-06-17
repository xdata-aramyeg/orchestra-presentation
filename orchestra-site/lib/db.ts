import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase (Postgres) backed waitlist store.
 *
 * - Serverless-safe: the client is created lazily on first request, NOT at
 *   module load, so `next build` succeeds with no Supabase env vars present.
 * - Uses the SERVICE ROLE key (server-only) — never expose it to the client.
 * - Dedupe is enforced by a UNIQUE index on `lower(email)` in Postgres; a
 *   unique violation (SQLSTATE 23505) surfaces as Error('DUP'), preserving the
 *   route's 409 behavior.
 * - All access goes through the supabase-js query builder (parameterized by
 *   construction) — user input is never interpolated into SQL.
 */

const TABLE = "waitlist";
const UNIQUE_VIOLATION = "23505";

type WaitlistRow = { readonly id: number };

const globalForSupabase = globalThis as unknown as {
  __supabaseAdmin?: SupabaseClient;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    // Request-time only — never thrown at build/import. Message names the
    // missing var without leaking any value.
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Memoized service-role client. Created on first request, never at import. */
function getClient(): SupabaseClient {
  if (!globalForSupabase.__supabaseAdmin) {
    const url = readRequiredEnv("SUPABASE_URL");
    const serviceRoleKey = readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

    globalForSupabase.__supabaseAdmin = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return globalForSupabase.__supabaseAdmin;
}

function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === UNIQUE_VIOLATION;
}

/**
 * Insert a new email and return its place in line.
 *
 * The email arrives already normalized (trim + lowercase) from the zod schema.
 * `position` is the new row's identity `id` — the Nth-signup ordinal driving
 * the "You're #N" UX. `count` is the exact current total on the list, fetched
 * after the insert so it always reflects the row just added.
 *
 * @throws Error('DUP') when the (normalized) email is already on the list.
 */
export async function addEmail(
  email: string,
): Promise<{ position: number; count: number }> {
  const client = getClient();

  const { data, error } = await client
    .from(TABLE)
    .insert({ email })
    .select("id")
    .single<WaitlistRow>();

  if (error) {
    if (isUniqueViolation(error)) {
      throw new Error("DUP");
    }
    throw new Error(`Failed to add email: ${error.message}`);
  }

  const count = await getCount();
  return { position: data.id, count };
}

/** Current total number of emails on the waitlist. */
export async function getCount(): Promise<number> {
  const client = getClient();

  const { count, error } = await client
    .from(TABLE)
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`Failed to read waitlist count: ${error.message}`);
  }

  return count ?? 0;
}
