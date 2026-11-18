import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reveal from '../components/Reveal.jsx';
import ContactCTA from '../components/ContactCTA.jsx';
import { CardGridSkeleton, EmptyState, ErrorState } from '../components/States.jsx';
import { getCategoryBySlug, getCachedCategoryBySlug } from '../services/categoryService.js';
import { getProductsByCategory, getCachedProductsByCategory } from '../services/productService.js';
import { useAsync } from '../hooks/useAsync.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import NotFound from './NotFound.jsx';

const SORTS = {
  default: { label: 'Featured order', fn: (a, b) => a.order - b.order },
  'name-asc': { label: 'Name: A – Z', fn: (a, b) => a.name.localeCompare(b.name) },
  'name-desc': { label: 'Name: Z – A', fn: (a, b) => b.name.localeCompare(a.name) },
};

export default function CategoryProducts() {
  const { categorySlug } = useParams();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');

  const { data, loading, error, reload } = useAsync(
    async () => {
      const [category, products] = await Promise.all([getCategoryBySlug(categorySlug), getProductsByCategory(categorySlug)]);
      return { category, products };
    },
    [categorySlug],
    () => ({
      category: getCachedCategoryBySlug(categorySlug),
      products: getCachedProductsByCategory(categorySlug),
    }),
  );

  usePageTitle(data?.category?.name || 'Products');

  const visible = useMemo(() => {
    if (!data?.products) return [];
    const q = query.trim().toLowerCase();
    const list = q
      ? data.products.filter((p) =>
          [p.name, p.shortDescription, p.fullDescription, p.grade, p.origin].join(' ').toLowerCase().includes(q),
        )
      : data.products;
    return [...list].sort(SORTS[sort].fn);
  }, [data, query, sort]);

  if (!loading && !error && data && !data.category) return <NotFound kind="category" />;

  const category = data?.category;
  const total = data?.products?.length ?? 0;

  return (
    <>
      <section className="bg-ivory pt-32 md:pt-40">
        <div className="container-x">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Products', to: '/products' },
              { label: category?.name || '…' },
            ]}
          />
          <div className="mt-10 grid gap-8 border-b border-charcoal/10 pb-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow">Product Category</p>
              {category ? (
                <h1 className="display-1 anim-fade-up mt-6">{category.name}</h1>
              ) : (
                <div className="skeleton mt-6 h-16 w-2/3 max-w-md" />
              )}
              {category?.description && <p className="lead mt-6 max-w-2xl">{category.description}</p>}
            </div>
            {category && (
              <p className="text-[12px] tracking-[0.18em] text-charcoal/50 uppercase lg:col-span-4 lg:text-right">
                {total} {total === 1 ? 'Product' : 'Products'}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-ivory pt-10 pb-24 md:pb-32">
        <div className="container-x">
          {total > 0 && (
            <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-charcoal/40" strokeWidth={1.5} />
                <label htmlFor="product-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="product-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${category?.name || 'products'}`}
                  className="field-input pr-8 pl-7 [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-0 -translate-y-1/2 p-1 text-charcoal/50 hover:text-charcoal"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="product-sort" className="text-[11px] font-semibold tracking-[0.2em] text-charcoal/50 uppercase">
                  Sort
                </label>
                <select
                  id="product-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="cursor-pointer border border-charcoal/15 bg-transparent px-4 py-2.5 text-[13px] text-charcoal focus:border-charcoal focus:outline-none"
                >
                  {Object.entries(SORTS).map(([k, s]) => (
                    <option key={k} value={k}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {loading && <CardGridSkeleton count={6} />}
          {error && <ErrorState error={error} onRetry={reload} />}

          {data && category && total === 0 && (
            <EmptyState
              title={`${category.name} — coming soon.`}
              message="Products in this category are being added to our catalogue. Send us your requirement and our team will respond with availability."
              actionLabel="Enquire Now"
              actionTo={`/contact?product=${encodeURIComponent(category.name)}`}
              secondaryLabel="All Categories"
              secondaryTo="/products"
            />
          )}

          {total > 0 && visible.length === 0 && (
            <div className="border border-dashed border-charcoal/15 px-8 py-16 text-center">
              <p className="font-serif text-2xl text-charcoal">No products match &ldquo;{query}&rdquo;.</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-6 text-[12px] font-semibold tracking-[0.18em] text-charcoal uppercase underline-offset-4 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {visible.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
