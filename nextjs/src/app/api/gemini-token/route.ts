export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  // Pass the key to the client so it can establish a direct WebSocket connection
  return NextResponse.json({ apiKey });
}
