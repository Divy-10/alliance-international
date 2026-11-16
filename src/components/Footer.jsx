import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import Logo from './Logo.jsx';
import { COMPANY, CONTACT_PLACEHOLDERS, NAV_LINKS } from '../data/siteContent.js';
import { getCategories } from '../services/categoryService.js';
import { useAsync } from '../hooks/useAsync.js';

export default function Footer() {
  const { data: categories } = useAsync(getCategories, []);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-black text-white">
      <div className="container-x pt-20 pb-10 md:pt-24">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo light height="h-10 sm:h-12" />
            <p className="mt-7 max-w-sm text-[14px] leading-7 text-white/50">{COMPANY.footerIntro}</p>
            <p className="mt-6 text-[12px] tracking-[0.18em] text-gold uppercase">{COMPANY.domain}</p>
          </div>

          <FooterCol title="Quick Links" className="lg:col-span-2">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-white/55 transition-colors duration-300 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Product Categories" className="lg:col-span-3">
            {(categories || []).map((c) => (
              <li key={c.id}>
                <Link to={`/products/${c.slug}`} className="text-white/55 transition-colors duration-300 hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Contact" className="lg:col-span-3">
            <li className="flex gap-3 text-white/40">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              {CONTACT_PLACEHOLDERS.email}
            </li>
            <li className="flex gap-3 text-white/40">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              {CONTACT_PLACEHOLDERS.phone}
            </li>
            <li className="flex gap-3 text-white/40">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              {CONTACT_PLACEHOLDERS.address}
            </li>
          </FooterCol>
        </div>

        <div className="mt-20 flex flex-col gap-5 border-t border-white/[0.08] pt-8 text-[12px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {COMPANY.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 self-start tracking-[0.18em] uppercase transition-colors hover:text-white sm:self-auto"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className = '' }) {
  return (
    <div className={className}>
      <h3 className="font-sans text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">{title}</h3>
      <ul className="mt-6 space-y-3.5 text-[14px] leading-6">{children}</ul>
    </div>
  );
}
