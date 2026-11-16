import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SmartImage from './SmartImage.jsx';

export function productPath(p) {
  return `/products/${p.categorySlug}/${p.slug}`;
}

export function enquiryPath(p) {
  return `/contact?product=${encodeURIComponent(p.name)}`;
}

export default function ProductCard({ product, showCategory = false }) {
  const to = productPath(product);
  return (
    <article className="group flex h-full flex-col bg-white border border-charcoal/[0.07] transition-shadow duration-300 hover:shadow-md">
      <Link to={to} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <SmartImage
          src={product.image}
          alt=""
          label={product.name}
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-[1400ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-7">
        {showCategory && (
          <p className="text-[10px] font-semibold tracking-[0.26em] text-gold uppercase">{product.categoryName}</p>
        )}
        <h3 className={`text-[1.6rem] leading-tight ${showCategory ? 'mt-3' : ''}`}>
          <Link to={to} className="transition-colors hover:text-charcoal/70">
            {product.name}
          </Link>
        </h3>
        {product.shortDescription && (
          <p className="mt-3 line-clamp-3 text-[14px] leading-7 text-charcoal/65">{product.shortDescription}</p>
        )}
        <div className="min-h-7 flex-1" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-charcoal/10 pt-6">
          <Link
            to={to}
            className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] text-charcoal uppercase transition-colors hover:text-charcoal/60"
          >
            View Details <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Link>
          <Link
            to={enquiryPath(product)}
            className="text-[12px] font-semibold tracking-[0.16em] text-charcoal/45 uppercase underline-offset-4 transition-colors hover:text-charcoal hover:underline"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </article>
  );
}
