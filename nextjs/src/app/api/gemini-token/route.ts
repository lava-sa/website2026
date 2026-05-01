export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";

const JANET_LIVE_MODEL = "gemini-2.5-flash-native-audio-preview-12-2025";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey, apiVersion: "v1alpha" });
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        liveConnectConstraints: {
          model: JANET_LIVE_MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
          },
        },
      },
    });

    // Return a short-lived token instead of exposing the long-lived key.
    return NextResponse.json({
      apiKey: token.name,
      model: JANET_LIVE_MODEL,
      apiVersion: "v1alpha",
    });
  } catch (error) {
    console.error("Failed to create Gemini ephemeral token:", error);
    return NextResponse.json({ error: "Could not start Janet session" }, { status: 500 });
  }
}
