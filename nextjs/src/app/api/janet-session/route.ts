export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getEmailConfig, getResendClient } from "@/lib/email-config";

function getServiceSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
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
      cartAdded,
    } = body as {
      sessionId?: string;
      pageUrl?: string;
      transcript?: string;
      durationSeconds?: number;
      startedAt?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      cartAdded?: boolean;
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
        updated_at: new Date().toISOString(),
        action_taken:
          cartAdded === true
            ? "Added to cart — checkout will capture full details"
            : phone
              ? "Anneke callback requested (voice fallback)"
              : "Voice session — no cart, no contact captured",
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

      // Legacy table (optional)
      await supabase.from("voice_sessions").insert([
        {
          session_id: sessionId,
          page_url: pageUrl,
          transcript,
          duration_seconds: durationSeconds,
          started_at: startedAt,
        },
      ]);
    }

    const resend = getResendClient();
    let emailSuccess = false;
    if (resend) {
      const { fromEmail, adminEmails, replyToEmail } = getEmailConfig();
      const contactBlock =
        firstName || lastName || phone
          ? `<p><strong>First name:</strong> ${firstName || "—"}</p>
             <p><strong>Surname:</strong> ${lastName || "—"}</p>
             <p><strong>Phone:</strong> ${phone || "—"}</p>
             <p><strong>Added to cart:</strong> ${cartAdded ? "Yes" : "No"}</p>`
          : `<p><em>No structured contact captured — see transcript.</em></p>`;

      const emailRes = await resend.emails.send({
        from: fromEmail,
        to: adminEmails,
        ...(replyToEmail ? { replyTo: replyToEmail } : {}),
        subject: `Janet voice session — ${durationSeconds ?? 0}s${cartAdded ? " (cart)" : phone ? " (callback)" : ""}`,
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
