import { GoogleGenAI } from "@google/genai";
import type { SiteReviewActionItem, SiteReviewMessage, SiteReviewTask } from "./types";

export async function summarizeSiteReviewSession(args: {
  title: string;
  hostLabel: string;
  guestLabel: string;
  messages: SiteReviewMessage[];
  tasks: SiteReviewTask[];
  transcript?: string | null;
}): Promise<{ summary: string; actionItems: SiteReviewActionItem[] }> {
  const chatLog = args.messages.map((m) => `[${m.sender_name}]: ${m.body}`).join("\n");
  const taskLog = args.tasks
    .map((t) => `- [${t.done ? "x" : " "}] ${t.text}`)
    .join("\n");

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      summary: `## ${args.title}\n\n(Set GOOGLE_API_KEY for AI summary.)\n\n${taskLog}`,
      actionItems: args.tasks
        .filter((t) => !t.done)
        .map((t) => ({ text: t.text, priority: "medium" as const })),
    };
  }

  const prompt = `Document this LAVA South Africa website review.

Meeting: ${args.title}
Host: ${args.hostLabel}, Guest: ${args.guestLabel}

Chat:
${chatLog || "(none)"}

Tasks:
${taskLog || "(none)"}

${args.transcript ? `Notes:\n${args.transcript}` : ""}

Respond with JSON only: {"summary":"markdown","actionItems":[{"text":"","assignee":"","priority":"low|medium|high","page_path":null}]}`;

  const ai = new GoogleGenAI({ apiKey });
  const res = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });
  const text = res.text?.trim() ?? "";
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch?.[0] ?? text) as {
      summary?: string;
      actionItems?: SiteReviewActionItem[];
    };
    return {
      summary: parsed.summary ?? text,
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
    };
  } catch {
    return { summary: text, actionItems: [] };
  }
}
