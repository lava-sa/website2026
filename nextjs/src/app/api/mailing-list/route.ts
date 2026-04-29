import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const ALLOWED_INTEREST_CATEGORIES = new Set([
  "vacuum_machines",
  "vacuum_bags_rolls",
  "containers_lids",
  "butchery_accessories",
  "sous_vide",
]);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const firstName = String(body?.first_name ?? "").trim() || null;
    const source = String(body?.source ?? "site").trim() || "site";
    const interestCategory = String(body?.interest_category ?? "").trim();
    const machineIndustryRaw = String(body?.machine_industry ?? "").trim();
    const machineIndustry = machineIndustryRaw || null;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!interestCategory || !ALLOWED_INTEREST_CATEGORIES.has(interestCategory)) {
      return NextResponse.json({ error: "Please select a valid interest category" }, { status: 400 });
    }
    if (interestCategory === "vacuum_machines" && !machineIndustry) {
      return NextResponse.json({ error: "Industry is required for vacuum machine interest" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error: upsertErr } = await supabase
      .from("mailing_list_subscribers")
      .upsert(
        {
          email,
          first_name: firstName,
          source,
          interest_category: interestCategory,
          machine_industry: interestCategory === "vacuum_machines" ? machineIndustry : null,
          opted_in: true,
          opted_in_at: new Date().toISOString(),
          unsubscribed_at: null,
        },
        { onConflict: "email" }
      );

    if (upsertErr) {
      console.error("Mailing list upsert failed:", upsertErr.message);
      return NextResponse.json({ error: "Failed to subscribe email" }, { status: 500 });
    }

    // Keep customer record in sync for CRM/newsletter exports.
    await supabase
      .from("customers")
      .update({ marketing_opt_in: true, updated_at: new Date().toISOString() })
      .eq("email", email);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mailing list subscribe failed:", err);
    return NextResponse.json({ error: "Failed to subscribe email" }, { status: 500 });
  }
}

