export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getEmailConfig, getResendClient } from "@/lib/email-config";

function getServiceSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    if (!supabaseKey) {
      console.error("janet-session: SUPABASE_SERVICE_ROLE_KEY is required (RLS blocks anon writes)");
    }
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
}

function buildActionTaken(row: {
  cartAdded?: boolean;
  machineAdded?: boolean;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  industry?: string;
  transcript?: string;
}): string {
  if (row.cartAdded && row.machineAdded) {
    return "Machine added to cart — bags/rolls upsell offered; checkout captures details";
  }
  if (row.cartAdded) return "Added to cart — checkout will capture full details";
  if (row.phone || row.email) return "Anneke callback requested — contact captured";
  if (row.firstName || row.lastName || row.industry) {
    const parts = [
      row.firstName || row.lastName ? "name captured" : null,
      row.industry ? row.industry : null,
    ].filter(Boolean);
    return `Lead captured — ${parts.join(" · ")} — Anneke follow-up`;
  }
  const hasTranscript = Boolean(row.transcript?.trim());
  if (hasTranscript) return "Voice session logged — review transcript for follow-up";
  return "Voice session — no cart, no contact captured";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      sessionId,
      pageUrl,
      transcript,
      durationSeconds,
      startedAt,
      firstName,
      lastName,
      phone,
      email,
      industry,
      cartAdded,
      machineAdded,
    } = body as {
      sessionId?: string;
      pageUrl?: string;
      transcript?: string;
      durationSeconds?: number;
      startedAt?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      industry?: string;
      cartAdded?: boolean;
      machineAdded?: boolean;
    };

    const supabase = getServiceSupabase();
    let dbSuccess = false;

    if (supabase && sessionId) {
      const row = {
        session_id: sessionId,
        page_url: pageUrl ?? null,
        source: "voice" as const,
        transcript: transcript ?? null,
        first_name: firstName?.trim() || null,
        last_name: lastName?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim().toLowerCase() || null,
        industry: industry?.trim() || null,
        updated_at: new Date().toISOString(),
        action_taken: buildActionTaken({
          cartAdded,
          machineAdded,
          phone,
          email,
          firstName,
          lastName,
          industry,
          transcript,
        }),
      };

      const { data: existing } = await supabase
        .from("janet_support_chats")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await supabase
          .from("janet_support_chats")
          .update(row)
          .eq("id", existing.id);
        if (!error) dbSuccess = true;
        else console.warn("janet_support_chats update:", error.message);
      } else {
        const { error } = await supabase.from("janet_support_chats").insert([row]);
        if (!error) dbSuccess = true;
        else console.warn("janet_support_chats insert:", error.message);
      }

    }

    const resend = getResendClient();
    let emailSuccess = false;
    if (resend) {
      const { fromEmail, adminEmails, replyToEmail } = getEmailConfig();
      const contactBlock =
        firstName || lastName || phone || email || industry
          ? `<p><strong>First name:</strong> ${firstName || "—"}</p>
             <p><strong>Surname:</strong> ${lastName || "—"}</p>
             <p><strong>Phone:</strong> ${phone || "—"}</p>
             <p><strong>Email:</strong> ${email || "—"}</p>
             <p><strong>Company / use:</strong> ${industry || "—"}</p>
             <p><strong>Machine in cart:</strong> ${machineAdded ? "Yes" : cartAdded ? "Other item" : "No"}</p>`
          : `<p><em>No structured contact captured — see transcript.</em></p>`;

      const emailRes = await resend.emails.send({
        from: fromEmail,
        to: adminEmails,
        ...(replyToEmail ? { replyTo: replyToEmail } : {}),
        subject: `Janet voice session — ${durationSeconds ?? 0}s${machineAdded ? " (machine)" : cartAdded ? " (cart)" : phone ? " (callback)" : ""}`,
        html: `
          <h3>Janet voice session</h3>
          <p><strong>Page:</strong> ${pageUrl ?? "—"}</p>
          <p><strong>Duration:</strong> ${durationSeconds ?? 0}s</p>
          <p><strong>Session:</strong> ${sessionId ?? "—"}</p>
          <hr />
          ${contactBlock}
          <hr />
          <h4>Transcript</h4>
          <pre style="white-space: pre-wrap; font-family: monospace;">${transcript ?? ""}</pre>
        `,
      });

      if (!emailRes.error) emailSuccess = true;
      else console.error("Resend email error:", emailRes.error);
    }

    return NextResponse.json({ success: true, dbSuccess, emailSuccess });
  } catch (error) {
    console.error("Janet session telemetry error:", error);
    return NextResponse.json({ error: "Telemetry processing failed" }, { status: 500 });
  }
}
