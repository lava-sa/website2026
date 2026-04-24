export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getEmailConfig, getResendClient } from "@/lib/email-config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, pageUrl, transcript, durationSeconds, startedAt } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let dbSuccess = false;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { error } = await supabase
        .from("voice_sessions")
        .insert([{
          session_id: sessionId,
          page_url: pageUrl,
          transcript,
          duration_seconds: durationSeconds,
          started_at: startedAt
        }]);

      if (error) {
        console.warn("Could not write to Supabase. Make sure table 'voice_sessions' exists:", error);
      } else {
        dbSuccess = true;
      }
    }

    // Attempt Resend Email
    let emailSuccess = false;
    const resend = getResendClient();
    if (resend) {
      const { fromEmail, adminEmails, replyToEmail } = getEmailConfig();
      const emailRes = await resend.emails.send({
        from: fromEmail,
        to: adminEmails,
        ...(replyToEmail ? { replyTo: replyToEmail } : {}),
        subject: `New Lead from Janet Voice Agent - ${durationSeconds}s`,
        html: `
          <h3>New Janet Voice Session</h3>
          <p><strong>Page:</strong> ${pageUrl}</p>
          <p><strong>Duration:</strong> ${durationSeconds}s</p>
          <hr />
          <h4>Transcript:</h4>
          <pre style="white-space: pre-wrap; font-family: monospace;">${transcript}</pre>
        `
      });

      if (!emailRes.error) {
         emailSuccess = true;
      } else {
         console.error("Resend Email error: ", emailRes.error);
      }
    } else {
      console.warn("RESEND_API_KEY missing - skipping email dispatch.");
    }

    return NextResponse.json({ success: true, dbSuccess, emailSuccess });

  } catch (error) {
    console.error("Janet Session Telemetry Error:", error);
    return NextResponse.json({ error: "Telemetry processing failed" }, { status: 500 });
  }
}
