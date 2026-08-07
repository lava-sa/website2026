import type { Metadata } from "next";
import CartRecoveryClient from "@/components/cart/CartRecoveryClient";

export const metadata: Metadata = { title: "Your saved basket", robots: { index: false } };

export default async function CartRecoverPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center py-20">
      <div className="section-container max-w-xl">
        <CartRecoveryClient token={token ?? ""} />
      </div>
    </main>
  );
}
