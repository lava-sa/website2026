import { createServiceClient } from "@/lib/supabase";

export type LeadSource = "member" | "newsletter" | "janet";

export type AdminLead = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  sources: LeadSource[];
  member_status: "invited" | "confirmed" | "none";
  member_created_at: string | null;
  last_sign_in_at: string | null;
  newsletter_opted_in: boolean;
  newsletter_interest: string | null;
  janet_chat_count: number;
  janet_last_at: string | null;
  customer_id: string | null;
  is_customer: boolean;
  first_seen_at: string;
  last_activity_at: string;
};

type AuthUser = {
  email?: string;
  created_at: string;
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
  invited_at?: string | null;
};

function pickName(
  current: { first: string | null; last: string | null },
  first: string | null | undefined,
  last: string | null | undefined
) {
  return {
    first: current.first || first?.trim() || null,
    last: current.last || last?.trim() || null,
  };
}

function memberStatus(user: AuthUser): "invited" | "confirmed" {
  if (user.email_confirmed_at) return "confirmed";
  if (user.invited_at) return "invited";
  return "invited";
}

async function listAuthUsers(): Promise<AuthUser[]> {
  const supabase = createServiceClient();
  const all: AuthUser[] = [];
  let page = 1;

  while (page <= 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      console.error("[admin-leads] listUsers:", error.message);
      break;
    }
    all.push(...(data.users as AuthUser[]));
    if (data.users.length < 200) break;
    page += 1;
  }

  return all;
}

export async function fetchAdminLeads(): Promise<AdminLead[]> {
  const supabase = createServiceClient();

  const [authUsers, subscribersRes, janetRes, customersRes] = await Promise.all([
    listAuthUsers(),
    supabase
      .from("mailing_list_subscribers")
      .select("email, first_name, opted_in, interest_category, machine_industry, opted_in_at, created_at")
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase
      .from("janet_support_chats")
      .select("email, first_name, last_name, phone, created_at")
      .order("created_at", { ascending: false })
      .limit(2000),
    supabase.from("customers").select("id, email, first_name, last_name, phone"),
  ]);

  const map = new Map<string, AdminLead>();

  function upsert(emailRaw: string) {
    const email = emailRaw.trim().toLowerCase();
    if (!email || !email.includes("@")) return null;
    let row = map.get(email);
    if (!row) {
      row = {
        email,
        first_name: null,
        last_name: null,
        phone: null,
        sources: [],
        member_status: "none",
        member_created_at: null,
        last_sign_in_at: null,
        newsletter_opted_in: false,
        newsletter_interest: null,
        janet_chat_count: 0,
        janet_last_at: null,
        customer_id: null,
        is_customer: false,
        first_seen_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
      };
      map.set(email, row);
    }
    return row;
  }

  function touch(row: AdminLead, at: string) {
    if (at < row.first_seen_at) row.first_seen_at = at;
    if (at > row.last_activity_at) row.last_activity_at = at;
  }

  function addSource(row: AdminLead, source: LeadSource) {
    if (!row.sources.includes(source)) row.sources.push(source);
  }

  for (const user of authUsers) {
    if (!user.email) continue;
    const row = upsert(user.email);
    if (!row) continue;
    addSource(row, "member");
    row.member_status = memberStatus(user);
    row.member_created_at = user.created_at;
    row.last_sign_in_at = user.last_sign_in_at ?? null;
    touch(row, user.created_at);
    if (user.last_sign_in_at) touch(row, user.last_sign_in_at);
  }

  for (const sub of subscribersRes.data ?? []) {
    const row = upsert(sub.email);
    if (!row) continue;
    addSource(row, "newsletter");
    row.newsletter_opted_in = sub.opted_in !== false;
    const interest = [sub.interest_category, sub.machine_industry].filter(Boolean).join(" · ");
    row.newsletter_interest = interest || sub.interest_category || null;
    if (sub.first_name) row.first_name = row.first_name || sub.first_name;
    const at = sub.opted_in_at || sub.created_at;
    if (at) touch(row, at);
  }

  for (const chat of janetRes.data ?? []) {
    if (!chat.email) continue;
    const row = upsert(chat.email);
    if (!row) continue;
    addSource(row, "janet");
    row.janet_chat_count += 1;
    const names = pickName(
      { first: row.first_name, last: row.last_name },
      chat.first_name,
      chat.last_name
    );
    row.first_name = names.first;
    row.last_name = names.last;
    if (chat.phone) row.phone = row.phone || chat.phone;
    if (chat.created_at) {
      touch(row, chat.created_at);
      if (!row.janet_last_at || chat.created_at > row.janet_last_at) {
        row.janet_last_at = chat.created_at;
      }
    }
  }

  for (const c of customersRes.data ?? []) {
    const row = upsert(c.email);
    if (!row) continue;
    row.customer_id = c.id;
    row.is_customer = true;
    if (c.first_name) row.first_name = row.first_name || c.first_name;
    if (c.last_name) row.last_name = row.last_name || c.last_name;
    if (c.phone) row.phone = row.phone || c.phone;
  }

  return Array.from(map.values()).sort((a, b) =>
    b.last_activity_at.localeCompare(a.last_activity_at)
  );
}
