import { Inbox, RefreshCw, CircleAlert } from 'lucide-react';
import Button from './Button.jsx';

export function CardGridSkeleton({ count = 6, aspect = 'aspect-[4/3]', cols = 'sm:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <div className={`grid gap-8 ${cols}`} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`skeleton-${i}`} className="bg-white">
          <div className={`skeleton ${aspect}`} />
          <div className="space-y-3 p-7">
            <div className="skeleton h-6 w-2/3" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-4/5" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function ErrorState({ error, onRetry, title = "We couldn't load the catalogue" }) {
  return (
    <div role="alert" className="mx-auto flex max-w-xl flex-col items-center border border-charcoal/10 bg-white px-8 py-16 text-center">
      <CircleAlert className="h-8 w-8 text-gold" strokeWidth={1.25} />
      <h3 className="mt-6 text-3xl">{title}</h3>
      <p className="mt-4 text-[14px] leading-7 text-charcoal/65">
        {error?.message || 'Something went wrong while loading this page.'} Please try again in a moment.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-8 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] text-charcoal uppercase hover:text-charcoal/70"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={1.5} /> Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message, actionLabel, actionTo, secondaryLabel, secondaryTo }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center border border-dashed border-charcoal/15 px-8 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50">
        <Inbox className="h-6 w-6 text-gold" strokeWidth={1.25} />
      </span>
      <h3 className="mt-8 text-[2rem] leading-tight">{title}</h3>
      {message && <p className="mt-4 max-w-md text-[15px] leading-7 text-charcoal/65">{message}</p>}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {actionTo && <Button to={actionTo}>{actionLabel}</Button>}
        {secondaryTo && (
          <Button to={secondaryTo} variant="outline" arrow={false}>
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
