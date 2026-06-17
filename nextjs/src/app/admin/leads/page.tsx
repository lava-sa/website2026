export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import { fetchAdminLeads } from "@/lib/admin-leads";
import LeadsClient from "./LeadsClient";

export default async function AdminLeadsPage() {
  const leads = await fetchAdminLeads();

  return (
    <AdminShell>
      <LeadsClient leads={leads} />
    </AdminShell>
  );
}
