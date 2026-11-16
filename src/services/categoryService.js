import { getCatalog } from './apiClient.js';

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
