import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/** items: [{ label, to? }] — the last item is the current page. */
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[12px] tracking-[0.12em] text-charcoal/50 uppercase">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.to && !last ? (
                <Link to={item.to} className="transition-colors hover:text-charcoal">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-charcoal' : ''}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3 w-3 text-gold" strokeWidth={1.5} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
