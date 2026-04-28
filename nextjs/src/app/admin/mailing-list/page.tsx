export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import MailingListClient from "./MailingListClient";

type Subscriber = {
  id: string;
  email: string;
  first_name: string | null;
  source: string | null;
  opted_in: boolean;
  opted_in_at: string;
  unsubscribed_at: string | null;
  created_at: string;
};

type Broadcast = {
  id: string;
  name: string;
  segment_type: "opted_in" | "purchasers" | "region";
  region: string | null;
  template_key: string;
  subject: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  scheduled_for: string | null;
  sent_at: string | null;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
};

type Template = {
  key: string;
  name: string;
  subject: string;
  html_body: string;
};

async function getSubscribers(): Promise<Subscriber[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("mailing_list_subscribers")
    .select("id, email, first_name, source, opted_in, opted_in_at, unsubscribed_at, created_at")
    .order("opted_in_at", { ascending: false })
    .limit(5000);

  if (error) {
    return [];
  }
  return (data ?? []) as Subscriber[];
}

async function getBroadcasts(): Promise<Broadcast[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("marketing_broadcasts")
    .select(`
      id, name, segment_type, region, template_key, subject, status, scheduled_for,
      sent_at, recipient_count, sent_count, failed_count, created_at
    `)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return [];
  return (data ?? []) as Broadcast[];
}

async function getTemplates(): Promise<Template[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("marketing_email_templates")
    .select("key, name, subject, html_body")
    .order("name", { ascending: true });
  if (error) return [];
  return (data ?? []) as Template[];
}

export default async function MailingListPage() {
  const [subscribers, broadcasts, templates] = await Promise.all([
    getSubscribers(),
    getBroadcasts(),
    getTemplates(),
  ]);

  return (
    <AdminShell>
      <MailingListClient subscribers={subscribers} broadcasts={broadcasts} templates={templates} />
    </AdminShell>
  );
}

