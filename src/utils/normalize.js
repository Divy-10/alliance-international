/**
 * Helpers that turn spreadsheet rows (strings, blanks, "TRUE"/"Yes")
 * into clean, predictable objects for the UI.
 */

export const str = (v) => (v === null || v === undefined ? '' : String(v).trim());

export function slugify(value) {
  return str(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toBool(v) {
  return ['true', 'yes', 'y', '1', 'featured'].includes(str(v).toLowerCase());
}

/** Blank status counts as active so a quickly-added row still appears. */
export function isActive(status) {
  const s = str(status).toLowerCase();
  return s === '' || s === 'active' || s === 'published' || s === 'yes';
}

export function toNumber(v, fallback = 9999) {
  const n = Number(str(v));
  return Number.isFinite(n) && str(v) !== '' ? n : fallback;
}

/** "url1, url2" or one URL per line → ['url1', 'url2'] */
export function toList(v) {
  if (Array.isArray(v)) return v.map(str).filter(Boolean);
  return str(v)
    .split(/[\n,|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Specifications cell → [{ label, value }]
 * Accepts one spec per line (or separated by ";"), each as "Label: Value".
 * Lines without a colon are kept as value-only notes.
 */
export function toSpecs(v) {
  if (Array.isArray(v)) return v;
  return str(v)
    .split(/[\n;]+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf(':');
      return i > 0 ? { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() } : { label: '', value: line };
    });
}

export const byDisplayOrder = (a, b) => a.order - b.order || a.name.localeCompare(b.name);

export function normalizeCategory(row) {
  const name = str(row.category_name);
  if (!name) return null;
  return {
    id: str(row.category_id) || slugify(name),
    name,
    slug: slugify(row.category_slug) || slugify(name),
    description: str(row.category_description),
    image: str(row.category_image),
    order: toNumber(row.display_order),
    status: row.status,
  };
}

// Dedicated product image mappings
const PRODUCT_IMAGE_OVERRIDES = {
  'small-red-onion': '/images/small-red-onion.jpg',
  'dehydrated-white-onion-flakes': '/images/dehydrated-white-onion-flakes.jpg',
  'dehydrated-onion-powder': '/images/dehydrated-onion-powder.jpg',
  'dehydrated-onion-granules': '/images/dehydrated-onion-granules.jpg',
  'dehydrated-minced-onion': '/images/dehydrated-minced-onion.jpg',
  'dehydrated-garlic-flakes': '/images/dehydrated-garlic-flakes.jpg',
};

export function normalizeProduct(row) {
  const name = str(row.product_name);
  if (!name) return null;
  const slug = slugify(row.product_slug) || slugify(name);
  let image = PRODUCT_IMAGE_OVERRIDES[slug] || str(row.product_image);
  const gallery = toList(row.gallery_images);
  return {
    id: str(row.product_id) || slugify(name),
    categoryId: str(row.category_id),
    categoryName: str(row.category_name),
    name,
    slug,
    shortDescription: str(row.short_description),
    fullDescription: str(row.full_description),
    image,
    images: [image, ...gallery.filter((g) => g !== '/images/cat-dehydrated-onions.jpg')].filter((u, i, all) => u && all.indexOf(u) === i),
    specifications: toSpecs(row.specifications),
    grade: str(row.grade),
    origin: str(row.origin),
    packaging: str(row.packaging),
    availability: str(row.availability),
    featured: toBool(row.featured),
    order: toNumber(row.display_order),
    status: row.status,
  };
}
