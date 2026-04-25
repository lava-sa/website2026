import type { ReactNode } from "react";

export default function AdminDisplayLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#0a1210] text-white antialiased">{children}</div>;
}
