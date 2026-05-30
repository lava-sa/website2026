import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Site review",
  robots: { index: false, follow: false },
};

export default function SiteReviewIndexPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-black">LAVA site review</h1>
        <p className="text-sm text-gray-400">
          Open the secure link from your invite (<code className="text-secondary">?role=host</code> or{" "}
          <code className="text-secondary">?role=guest</code>).
        </p>
        <Link href="/admin/site-review" className="text-secondary text-sm hover:underline">
          Admin → Site review
        </Link>
      </div>
    </div>
  );
}
