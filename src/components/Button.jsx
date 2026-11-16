import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const VARIANTS = {
  primary:    'border-charcoal bg-charcoal text-white hover:bg-black hover:border-black',
  outline:    'border-charcoal/30 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-white',
  light:      'border-white bg-white text-charcoal hover:bg-transparent hover:text-white',
  ghostLight: 'border-white/45 text-white hover:border-white hover:bg-white hover:text-charcoal',
  gold:       'border-gold bg-gold text-charcoal hover:bg-transparent hover:text-gold',
};

/**
 * Button — renders a router Link when `to` is set, otherwise a <button>.
 */
export default function Button({ to, variant = 'primary', arrow = true, className = '', children, ...rest }) {
  const cls = `group inline-flex items-center justify-center gap-3 border px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />}
    </>
  );
  return to ? (
    <Link to={to} className={cls} {...rest}>
      {content}
    </Link>
  ) : (
    <button className={cls} {...rest}>
      {content}
    </button>
  );
}
