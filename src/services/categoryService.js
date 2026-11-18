import { getCatalog, getCatalogSync } from './apiClient.js';

/** Synchronous categories accessor for instant rendering on mount. */
export function getCachedCategories() {
  const { categories } = getCatalogSync();
  return categories;
}

/** Synchronous category lookup by slug. */
export function getCachedCategoryBySlug(categorySlug) {
  const { categories } = getCatalogSync();
  return categories.find((c) => c.slug === categorySlug) || null;
}

/** All active categories, sorted by display_order. Each includes productCount. */
export async function getCategories() {
  const { categories } = await getCatalog();
  return categories;
}

/** A single active category by its slug, or null. */
export async function getCategoryBySlug(categorySlug) {
  const { categories } = await getCatalog();
  return categories.find((c) => c.slug === categorySlug) || null;
}
