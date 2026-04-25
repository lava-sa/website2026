import { cookies } from "next/headers";

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}
