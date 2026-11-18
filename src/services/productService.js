import { getCatalog, getCatalogSync } from './apiClient.js';

/** Synchronous accessors for instant Frame 1 rendering */
export function getCachedProducts() {
  const { products } = getCatalogSync();
  return products;
}

export function getCachedProductsByCategory(categorySlug) {
  const { products } = getCatalogSync();
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getCachedFeaturedProducts(limit) {
  const { products } = getCatalogSync();
  const featured = products.filter((p) => p.featured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export function getCachedProductBySlug(productSlug, categorySlug) {
  const { products } = getCatalogSync();
  return (
    products.find((p) => p.slug === productSlug && (!categorySlug || p.categorySlug === categorySlug)) || null
  );
}

export function getCachedRelatedProducts(product, limit = 3) {
  const { products } = getCatalogSync();
  return products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, limit);
}

/** All active products (in active categories), sorted by display_order. */
export async function getProducts() {
  const { products } = await getCatalog();
  return products;
}

/** Active products in one category. */
export async function getProductsByCategory(categorySlug) {
  const { products } = await getCatalog();
  return products.filter((p) => p.categorySlug === categorySlug);
}

/**
 * One product by slug. Pass categorySlug when known, since slugs are
 * only guaranteed unique inside a category.
 */
export async function getProductBySlug(productSlug, categorySlug) {
  const { products } = await getCatalog();
  return (
    products.find((p) => p.slug === productSlug && (!categorySlug || p.categorySlug === categorySlug)) || null
  );
}

/** Products marked featured = Yes / TRUE. */
export async function getFeaturedProducts(limit) {
  const { products } = await getCatalog();
  const featured = products.filter((p) => p.featured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

/** Other products in the same category (for the details page). */
export async function getRelatedProducts(product, limit = 3) {
  const { products } = await getCatalog();
  return products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, limit);
}
