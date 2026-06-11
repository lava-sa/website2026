import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return createClient("https://placeholder.supabase.co", "placeholder");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Follow redirect chain (max 5 hops) — returns canonical slug or null */
export async function resolveProductSlugRedirect(slug: string): Promise<string | null> {
  const supabase = getClient();
  let current = slug;

  for (let hop = 0; hop < 5; hop++) {
    const { data, error } = await supabase
      .from("product_slug_redirects")
      .select("new_slug")
      .eq("old_slug", current)
      .maybeSingle();

    if (error || !data?.new_slug) break;
    if (data.new_slug === current) break;
    current = data.new_slug;
  }

  return current !== slug ? current : null;
}
