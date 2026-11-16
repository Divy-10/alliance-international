import Button from '../components/Button.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';

const COPY = {
  page: { title: 'This page could not be found.', text: 'The page you are looking for may have moved or no longer exists.' },
  category: {
    title: 'This category is not available.',
    text: 'The product category you are looking for may have been renamed or is no longer listed.',
  },
  product: {
    title: 'This product is not available.',
    text: 'The product you are looking for may have been renamed or is no longer listed in our catalogue.',
  },
};

export default function NotFound({ kind = 'page' }) {
  usePageTitle('Not Found');
  const c = COPY[kind];
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ivory pt-32 pb-24">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[38vw] leading-none text-charcoal/[0.04] select-none"
      >
        404
      </span>
      <div className="container-x relative text-center">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="display-2 mx-auto mt-6 max-w-3xl">{c.title}</h1>
        <p className="lead mx-auto mt-6 max-w-xl">{c.text}</p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button to={kind === 'page' ? '/' : '/products'}>{kind === 'page' ? 'Return Home' : 'View All Products'}</Button>
          <Button to="/contact" variant="outline" arrow={false}>
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
