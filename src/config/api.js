/**
 * API configuration
 * ------------------------------------------------------------------
 * The catalogue has two interchangeable data sources:
 *
 *   1. DEMO   – local JSON files in src/data/ (used when no URL is set)
 *   2. SHEETS – Google Sheets, served through a Google Apps Script Web App
 *
 * To switch to Google Sheets, set VITE_GOOGLE_APPS_SCRIPT_URL in `.env`
 * (see .env.example) and restart / rebuild. No component code changes.
 */

const rawUrl = (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '').trim();

export const API_CONFIG = {
  /** Deployed Apps Script Web App URL (ends with /exec). */
  appsScriptUrl: rawUrl,

  /** True when no Apps Script URL is configured → local demo data is used. */
  useDemoData: rawUrl === '',

  /** Seconds to reuse fetched catalogue data in the browser. */
  cacheSeconds: Number(import.meta.env.VITE_CACHE_SECONDS ?? 60) || 0,

  /** Network timeout for the Apps Script request (ms). */
  timeoutMs: 15000,

  /** Whether the Contact form should POST enquiries to the Apps Script. */
  enquirySubmissionEnabled:
    rawUrl !== '' && String(import.meta.env.VITE_ENABLE_ENQUIRY_SUBMISSION).toLowerCase() === 'true',

  /** Simulated latency for demo data so loading states can be reviewed (ms). */
  demoLatencyMs: 350,
};

export const DATA_SOURCE_LABEL = API_CONFIG.useDemoData ? 'Demo data' : 'Google Sheets';
