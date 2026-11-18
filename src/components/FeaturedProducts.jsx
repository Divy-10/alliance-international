import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import SectionHeading from './SectionHeading.jsx';
import Button from './Button.jsx';
import { CardGridSkeleton, ErrorState } from './States.jsx';
import { getFeaturedProducts, getCachedFeaturedProducts } from '../services/productService.js';
import { useAsync } from '../hooks/useAsync.js';

/** Homepage carousel of products marked "featured" in Google Sheets. */
export default function FeaturedProducts() {
  const { data: products, loading, error, reload } = useAsync(
    () => getFeaturedProducts(12),
    [],
    () => getCachedFeaturedProducts(12),
  );
  const track = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = () => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [products]);

  const scrollBy = (dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const step = card ? card.getBoundingClientRect().width + 32 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const hasItems = products && products.length > 0;

  return (
    <section className="section-y overflow-hidden bg-ivory">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Featured Products" title="Selected commodities for global buyers." />
          {hasItems && (
            <div className="flex gap-3">
              <ArrowBtn label="Previous products" disabled={edges.start} onClick={() => scrollBy(-1)}>
                <ChevronLeft className="h-5 w-5" strokeWidth={1.25} />
              </ArrowBtn>
              <ArrowBtn label="Next products" disabled={edges.end} onClick={() => scrollBy(1)}>
                <ChevronRight className="h-5 w-5" strokeWidth={1.25} />
              </ArrowBtn>
            </div>
          )}
        </div>

        <div className="mt-16">
          {loading && <CardGridSkeleton count={3} />}
          {error && <ErrorState error={error} onRetry={reload} />}
          {!loading && !error && !hasItems && (
            <p className="border border-dashed border-charcoal/15 px-8 py-14 text-center text-charcoal/60">
              Featured products will appear here once they are marked as featured in the catalogue.
            </p>
          )}
          {hasItems && (
            <div
              ref={track}
              onScroll={updateEdges}
              className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-6 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
              aria-label="Featured products"
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  data-card
                  className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-21.4px)]"
                >
                  <ProductCard product={p} showCategory />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-14 flex justify-center">
          <Button to="/products" variant="outline">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}

function ArrowBtn({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-all duration-300 hover:border-charcoal hover:bg-charcoal hover:text-white disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
