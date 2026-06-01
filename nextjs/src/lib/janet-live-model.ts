/**
 * Gemini Live voice model for Janet.
 * Override with JANET_LIVE_MODEL in .env when upgrading (e.g. gemini-3.1-flash-live-preview).
 * @see https://ai.google.dev/gemini-api/docs/live-api
 */
export const JANET_LIVE_MODEL =
  process.env.JANET_LIVE_MODEL?.trim() ||
  "gemini-2.5-flash-native-audio-preview-12-2025";
