/**
 * Gemini Live voice model for Janet.
 * Override with JANET_LIVE_MODEL in .env when upgrading.
 * Google retires Live preview models without notice (gemini-2.5-flash-live-preview died
 * ~July 2026 — sessions opened then closed with code 1008 "model not found"). If Janet
 * starts dropping calls immediately, list models supporting bidiGenerateContent and update.
 * @see https://ai.google.dev/gemini-api/docs/live-api
 */
/** Native-audio models speak well but under-call tools; live-preview is better for cart/nav. */
export const JANET_LIVE_MODEL =
  process.env.JANET_LIVE_MODEL?.trim() ||
  "gemini-3.1-flash-live-preview";
