export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import ImportHistoryClient from "./ImportHistoryClient";

export default function AdminImportPage() {
  return (
    <AdminShell>
      <ImportHistoryClient />
    </AdminShell>
  );
}
