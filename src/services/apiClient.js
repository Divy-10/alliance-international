/**
 * apiClient
 * ------------------------------------------------------------------
 * Single entry point for loading raw catalogue data, with instant
 * Stale-While-Revalidate caching and synchronous local fallback so
 * products and categories appear on Frame 1 (0ms delay) with zero
 * skeleton flashing.
 */
import { API_CONFIG } from '../config/api.js';
import { normalizeCategory, normalizeProduct, isActive, byDisplayOrder } from '../utils/normalize.js';
import demoCategories from '../data/demoCategories.json';
import demoProducts from '../data/demoProducts.json';

const STORAGE_KEY = 'ai_catalog_swr_v5';

export class ApiError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'ApiError';
    this.cause = cause;
  }
}

function prepare({ categories = [], products = [] }) {
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

// 1. Initialize synchronous seed from LocalStorage or static seed data
let cache = null;
let inflight = null;

function initCache() {
  try {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.data?.categories?.length && parsed?.data?.products?.length) {
        cache = parsed;
        return;
      }
    }
  } catch (err) {
    // ignore localStorage errors (e.g. private browsing)
  }

  // Fallback to static seed data (instant, 0ms latency)
  cache = {
    at: 0, // marked stale so background revalidation occurs immediately
    data: prepare({ categories: demoCategories, products: demoProducts }),
  };
}

initCache();

function persistCache(at, data) {
  cache = { at, data };
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
      window.dispatchEvent(new CustomEvent('catalog-refreshed', { detail: data }));
    }
  } catch {
    // ignore storage quota errors
  }
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

/** Synchronous accessor returning catalogue data immediately on Frame 1. */
export function getCatalogSync() {
  if (!cache?.data) {
    initCache();
  }
  return cache.data;
}

/**
 * Returns normalised { categories, products } instantly from cache/seed,
 * revalidating asynchronously in the background (stale-while-revalidate).
 */
export async function getCatalog({ force = false } = {}) {
  const isFresh = cache && !force && Date.now() - cache.at < API_CONFIG.cacheSeconds * 1000;

  // If we already have cached data and it's fresh, return immediately
  if (cache?.data && isFresh) {
    return cache.data;
  }

  // If we have cached/seed data but it is stale or needs revalidation,
  // kick off background revalidation and return current data immediately!
  if (cache?.data && !force) {
    if (!inflight && !API_CONFIG.useDemoData && API_CONFIG.appsScriptUrl) {
      inflight = (async () => {
        try {
          const raw = await loadFromAppsScript();
          const prepared = prepare(raw);
          persistCache(Date.now(), prepared);
          return prepared;
        } catch (err) {
          if (import.meta.env.DEV) {
            console.warn('[apiClient] Background revalidation error:', err);
          }
          return cache.data;
        } finally {
          inflight = null;
        }
      })();
    }
    return cache.data;
  }

  // When force = true or no cache exists, await the network response
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const raw = API_CONFIG.useDemoData || !API_CONFIG.appsScriptUrl ? { categories: demoCategories, products: demoProducts } : await loadFromAppsScript();
      const data = prepare(raw);
      persistCache(Date.now(), data);
      return data;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export function clearCatalogCache() {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
  cache = null;
  initCache();
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
