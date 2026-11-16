/**
 * apiClient
 * ------------------------------------------------------------------
 * Single entry point for loading raw catalogue data, from either the
 * local demo JSON or the Google Apps Script endpoint. Everything is
 * normalised here so UI components never deal with spreadsheet quirks
 * (text booleans, comma-separated lists, blank cells, etc.).
 */
import { API_CONFIG } from '../config/api.js';
import { normalizeCategory, normalizeProduct, isActive, byDisplayOrder } from '../utils/normalize.js';

let cache = null; // { at: number, data: { categories, products } }
let inflight = null;

export class ApiError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'ApiError';
    this.cause = cause;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function loadDemo() {
  // Dynamic import keeps sample data out of the bundle once Sheets is configured.
  const [{ default: categories }, { default: products }] = await Promise.all([
    import('../data/demoCategories.json'),
    import('../data/demoProducts.json'),
  ]);
  await sleep(API_CONFIG.demoLatencyMs);
  return { categories, products };
}

async function loadFromAppsScript() {
  const url = new URL(API_CONFIG.appsScriptUrl);
  url.searchParams.set('action', 'catalog');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

  let response;
  try {
    // A plain GET with no custom headers avoids a CORS preflight,
    // which Apps Script Web Apps do not support.
    response = await fetch(url.toString(), { method: 'GET', signal: controller.signal, redirect: 'follow' });
  } catch (err) {
    throw new ApiError(
      err.name === 'AbortError' ? 'The product catalogue took too long to respond.' : 'Unable to reach the product catalogue.',
      err,
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) throw new ApiError(`Catalogue request failed (HTTP ${response.status}).`);

  let json;
  try {
    json = await response.json();
  } catch (err) {
    throw new ApiError('The catalogue returned an unexpected response. Check the Apps Script deployment access is set to "Anyone".', err);
  }

  if (!json || json.success === false) {
    throw new ApiError(json?.error?.message || 'The catalogue returned an error.');
  }

  const data = json.data || {};
  return { categories: data.categories || [], products: data.products || [] };
}

function prepare({ categories, products }) {
  const cats = categories.map(normalizeCategory).filter((c) => c && isActive(c.status)).sort(byDisplayOrder);

  const catById = new Map(cats.map((c) => [c.id, c]));
  const catByName = new Map(cats.map((c) => [c.name.toLowerCase(), c]));

  const prods = products
    .map(normalizeProduct)
    .filter((p) => p && isActive(p.status))
    .map((p) => {
      // Link by category_id first; fall back to category_name for convenience.
      const category = catById.get(p.categoryId) || catByName.get((p.categoryName || '').toLowerCase());
      return category ? { ...p, categoryId: category.id, categoryName: category.name, categorySlug: category.slug } : null;
    })
    .filter(Boolean) // products in inactive / unknown categories are hidden
    .sort(byDisplayOrder);

  // Guarantee unique product slugs within a category.
  const seen = new Set();
  for (const p of prods) {
    let key = `${p.categorySlug}/${p.slug}`;
    let n = 2;
    while (seen.has(key)) {
      p.slug = `${p.slug}-${n++}`;
      key = `${p.categorySlug}/${p.slug}`;
    }
    seen.add(key);
  }

  const counts = prods.reduce((acc, p) => acc.set(p.categoryId, (acc.get(p.categoryId) || 0) + 1), new Map());
  return {
    categories: cats.map((c) => ({ ...c, productCount: counts.get(c.id) || 0 })),
    products: prods,
  };
}

/** Returns normalised { categories, products }, using a short-lived cache. */
export async function getCatalog({ force = false } = {}) {
  const fresh = cache && Date.now() - cache.at < API_CONFIG.cacheSeconds * 1000;
  if (!force && fresh) return cache.data;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const raw = API_CONFIG.useDemoData ? await loadDemo() : await loadFromAppsScript();
      const data = prepare(raw);
      cache = { at: Date.now(), data };
      return data;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function clearCatalogCache() {
  cache = null;
}

/** Sends a contact enquiry to the Apps Script doPost handler. */
export async function postEnquiry(payload) {
  if (!API_CONFIG.enquirySubmissionEnabled) {
    throw new ApiError('Enquiry submission is not enabled.');
  }
  // text/plain keeps this a "simple" request (no CORS preflight).
  const response = await fetch(API_CONFIG.appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'enquiry', ...payload }),
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || !json || json.success === false) {
    throw new ApiError(json?.error?.message || 'Your enquiry could not be sent.');
  }
  return json;
}
