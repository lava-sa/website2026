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

export default async function MailingListPage() {
  const subscribers = await getSubscribers();

  return (
    <AdminShell>
      <MailingListClient subscribers={subscribers} />
    </AdminShell>
  );
}

