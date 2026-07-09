import { createClient } from "@supabase/supabase-js";

/**
 * IMPORTANT: NEXT_PUBLIC_* vars must be referenced as STATIC LITERALS
 * (`process.env.NEXT_PUBLIC_FOO`) so Next.js can inline them into the client
 * bundle at build time. Dynamic access — `process.env[name]` — is NOT inlined
 * and evaluates to undefined in the browser. That previously left the search
 * page with an empty Supabase URL and crashed it ("supabaseUrl is required").
 * Never read a NEXT_PUBLIC_ var through a variable key.
 */
const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder";

/**
 * Standard client for client-side and public data fetching.
 * Falls back to a harmless placeholder (never throws) if the public keys are
 * somehow missing, so a misconfiguration degrades gracefully instead of taking
 * down the whole page.
 */
export const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.warn("Supabase public env vars missing — returning placeholder client.");
        return createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY);
    }

    return createClient(url, key);
};

/** Server-side client with service role (for admin operations). */
export function createServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    return createClient(url || PLACEHOLDER_URL, key || PLACEHOLDER_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

/** Anon client for auth emails (resetPasswordForEmail must use anon, not service role). */
export function createAuthAnonClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return createClient(url || PLACEHOLDER_URL, key || PLACEHOLDER_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
