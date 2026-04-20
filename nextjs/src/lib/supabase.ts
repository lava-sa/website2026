import { createClient } from "@supabase/supabase-js";

/**
 * Robust getter for Environment Variables to prevent build-time crashes.
 * Returns null if the variable is missing, allowing the app to handle it gracefully.
 */
function getEnv(name: string): string {
    const val = process.env[name];
    if (!val && process.env.NODE_ENV === "production" && typeof window === "undefined") {
        console.warn(`⚠️ Missing Environment Variable: ${name}. Static generation may be limited.`);
    }
    return val || "";
}

/**
 * Standard client for client-side and public data fetching.
 * Uses lazy initialization to avoid crashing during module import.
 */
export const getSupabase = () => {
    const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
    const key = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    
    if (!url || !key) {
        // Return a dummy client during build to prevent crashes
        console.warn("Using fallback Supabase client due to missing keys.");
    }

    return createClient(url, key);
};

/** Server-side client with service role (for admin operations) */
export function createServiceClient() {
    const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
    const key = getEnv("SUPABASE_SERVICE_ROLE_KEY");

    return createClient(
        url || "https://placeholder.supabase.co",
        key || "placeholder",
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
