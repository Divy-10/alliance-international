import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SmartImage from './SmartImage.jsx';

export default function CategoryCard({ category, index }) {
  const to = `/products/${category.slug}`;
  return (
    <article className="group">
      <Link to={to} className="block" aria-label={`Explore ${category.name}`}>
        <SmartImage
          src={category.image}
          alt={category.name}
          label={category.name}
          className="aspect-[4/5]"
          imgClassName="transition-transform duration-[1400ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
        />
      </Link>
      <div className="mt-6 flex items-start justify-between gap-6 border-b border-charcoal/10 pb-6">
        <div className="min-w-0">
          {typeof index === 'number' && (
            <p className="font-serif text-sm text-gold italic">{String(index + 1).padStart(2, '0')}</p>
          )}
          <h3 className="mt-1 text-[1.85rem] leading-tight">
            <Link to={to} className="transition-colors hover:text-charcoal/70">
              {category.name}
            </Link>
          </h3>
          {category.description && <p className="mt-3 text-[14px] leading-7 text-charcoal/65">{category.description}</p>}
        </div>
      </div>
      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-3 text-[12px] font-semibold tracking-[0.18em] text-charcoal uppercase"
      >
        Explore Category
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/20 transition-all duration-300 group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-white">
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </span>
      </Link>
    </article>
  );
}
