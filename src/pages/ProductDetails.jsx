import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Button from '../components/Button.jsx';
import SmartImage from '../components/SmartImage.jsx';
import ProductCard, { enquiryPath } from '../components/ProductCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { ErrorState } from '../components/States.jsx';
import {
  getProductBySlug,
  getRelatedProducts,
  getCachedProductBySlug,
  getCachedRelatedProducts,
} from '../services/productService.js';
import { useAsync } from '../hooks/useAsync.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import NotFound from './NotFound.jsx';

export default function ProductDetails() {
  const { categorySlug, productSlug } = useParams();
  const { data, loading, error, reload } = useAsync(
    async () => {
      const product = await getProductBySlug(productSlug, categorySlug);
      const related = product ? await getRelatedProducts(product, 3) : [];
      return { product, related };
    },
    [categorySlug, productSlug],
    () => {
      const product = getCachedProductBySlug(productSlug, categorySlug);
      const related = product ? getCachedRelatedProducts(product, 3) : [];
      return product ? { product, related } : null;
    },
  );

  const product = data?.product;
  usePageTitle(product?.name || 'Product');

  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [productSlug]);

  if (loading) return <DetailsSkeleton />;
  if (error)
    return (
      <div className="bg-ivory pt-40 pb-32">
        <div className="container-x">
          <ErrorState error={error} onRetry={reload} title="We couldn't load this product" />
        </div>
      </div>
    );
  if (!product) return <NotFound kind="product" />;

  const images = product.images.length ? product.images : [''];
  const facts = [
    { label: 'Grade', value: product.grade },
    { label: 'Origin', value: product.origin },
    { label: 'Packaging', value: product.packaging },
    { label: 'Availability', value: product.availability },
  ].filter((f) => f.value);
  const hasSpecs = product.specifications.length > 0;
  const hasDetails = facts.length > 0 || hasSpecs;

  return (
    <>
      <section className="bg-ivory pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container-x">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Products', to: '/products' },
              { label: product.categoryName, to: `/products/${product.categorySlug}` },
              { label: product.name },
            ]}
          />

          <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-20">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <SmartImage
                key={images[active]}
                src={images[active]}
                alt={product.name}
                label={product.name}
                eager
                className="aspect-[4/3] w-full"
              />
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-4 sm:grid-cols-5" role="tablist" aria-label="Product images">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-label={`Show image ${i + 1}`}
                      onClick={() => setActive(i)}
                      className={`overflow-hidden border transition-all duration-300 ${
                        i === active ? 'border-charcoal' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <SmartImage src={src} alt="" className="aspect-square" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Link
                  to={`/products/${product.categorySlug}`}
                  className="text-[11px] font-semibold tracking-[0.26em] text-gold uppercase hover:text-charcoal/70"
                >
                  {product.categoryName}
                </Link>
                <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-[3.5rem]">{product.name}</h1>
                {product.shortDescription && <p className="lead mt-6">{product.shortDescription}</p>}

                {facts.length > 0 && (
                  <dl className="mt-10 border-t border-charcoal/10">
                    {facts.map((f) => (
                      <div key={f.label} className="grid grid-cols-3 gap-4 border-b border-charcoal/10 py-4">
                        <dt className="text-[11px] font-semibold tracking-[0.2em] text-charcoal/50 uppercase">{f.label}</dt>
                        <dd className="col-span-2 text-[15px] text-charcoal">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Button to={enquiryPath(product)}>Enquire Now</Button>
                  <Button to={`/products/${product.categorySlug}`} variant="outline" arrow={false}>
                    <span className="inline-flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back
                    </span>
                  </Button>
                </div>

                {!hasDetails && (
                  <p className="mt-10 flex gap-3 border-l-2 border-gold/60 pl-5 text-[14px] leading-7 text-charcoal/65">
                    <Mail className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                    Detailed specifications, grades and packaging options are shared on enquiry.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description & specifications */}
          {(product.fullDescription || hasSpecs) && (
            <div className="mt-24 grid gap-14 border-t border-charcoal/10 pt-16 lg:grid-cols-12 lg:gap-20">
              {product.fullDescription && (
                <Reveal className={hasSpecs ? 'lg:col-span-7' : 'lg:col-span-8'}>
                  <p className="eyebrow">Product Description</p>
                  <div className="mt-8 space-y-5">
                    {product.fullDescription.split(/\n{2,}|\r?\n/).map((para, i) => (
                      <p key={`desc-${i}`} className="lead">
                        {para}
                      </p>
                    ))}
                  </div>
                </Reveal>
              )}
              {hasSpecs && (
                <Reveal delay={100} className={product.fullDescription ? 'lg:col-span-5' : 'lg:col-span-8'}>
                  <p className="eyebrow">Specifications</p>
                  <table className="mt-8 w-full text-left text-[14px]">
                    <tbody>
                      {product.specifications.map((s, i) => (
                        <tr key={`spec-${s.label || i}`} className="border-b border-charcoal/10">
                          {s.label ? (
                            <>
                              <th scope="row" className="w-2/5 py-4 pr-4 align-top font-medium text-charcoal/60">
                                {s.label}
                              </th>
                              <td className="py-4 text-charcoal">{s.value}</td>
                            </>
                          ) : (
                            <td colSpan={2} className="py-4 text-charcoal">
                              {s.value}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Reveal>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Enquiry band — pure black replacing green */}
      <section className="bg-black">
        <div className="container-x flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <p className="eyebrow">Product Enquiry</p>
            <h2 className="mt-5 text-[2rem] leading-tight !text-white md:text-[2.6rem]">Interested in {product.name}?</h2>
          </div>
          <Button to={enquiryPath(product)} variant="gold">
            Send an Enquiry
          </Button>
        </div>
      </section>

      {data.related.length > 0 && (
        <section className="section-y bg-ivory">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">More in {product.categoryName}</p>
                <h2 className="display-2 mt-6">Related products.</h2>
              </div>
              <Link
                to={`/products/${product.categorySlug}`}
                className="text-[12px] font-semibold tracking-[0.18em] text-charcoal uppercase underline-offset-4 hover:underline"
              >
                View all {product.categoryName}
              </Link>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function DetailsSkeleton() {
  return (
    <div className="bg-ivory pt-32 pb-32 md:pt-40" role="status" aria-label="Loading product">
      <div className="container-x">
        <div className="skeleton h-3 w-64" />
        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="skeleton aspect-[4/3] lg:col-span-7" />
          <div className="space-y-5 lg:col-span-5">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-14 w-4/5" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton mt-10 h-14 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
