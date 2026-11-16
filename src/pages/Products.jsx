import PageHero from '../components/PageHero.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import Reveal from '../components/Reveal.jsx';
import ContactCTA from '../components/ContactCTA.jsx';
import { CardGridSkeleton, EmptyState, ErrorState } from '../components/States.jsx';
import { getCategories } from '../services/categoryService.js';
import { useAsync } from '../hooks/useAsync.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { IMAGES } from '../data/siteContent.js';

export default function Products() {
  usePageTitle('Products');
  const { data: categories, loading, error, reload } = useAsync(getCategories, []);

  return (
    <>
      <PageHero
        eyebrow="Our Products"
        title="A curated portfolio of agro commodities."
        intro="Explore our commodity categories and send an enquiry for the products that match your requirements."
        image={IMAGES.productsHero}
        imageAlt="Agricultural commodities"
      />

      <section className="section-y bg-ivory">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 border-b border-charcoal/10 pb-10 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Product Categories</p>
              <h2 className="display-2 mt-6">Explore by category.</h2>
            </div>
            {categories && (
              <p className="text-[12px] tracking-[0.18em] text-charcoal/50 uppercase">
                {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
              </p>
            )}
          </div>

          <div className="mt-16">
            {loading && <CardGridSkeleton count={6} aspect="aspect-[4/5]" />}
            {error && <ErrorState error={error} onRetry={reload} />}
            {categories && categories.length === 0 && (
              <EmptyState
                title="Our catalogue is being prepared."
                message="Product categories will be published here shortly. In the meantime, our team is happy to help with your requirements."
                actionLabel="Contact Us"
                actionTo="/contact"
              />
            )}
            {categories && categories.length > 0 && (
              <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((c, i) => (
                  <Reveal key={c.id} delay={(i % 3) * 90}>
                    <CategoryCard category={c} index={i} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
