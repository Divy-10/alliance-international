import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Logo from './Logo.jsx';
import { NAV_LINKS } from '../data/siteContent.js';

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Pages with a full-bleed dark hero start with a transparent header.
  const overHero = ['/', '/about', '/products', '/contact'].includes(pathname);
  const solid = scrolled || !overHero || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const linkBase = 'relative py-2 text-[13px] font-medium tracking-[0.08em] uppercase transition-colors duration-300';

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'border-b border-charcoal/[0.08] bg-white/97 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className={`container-x flex items-center justify-between transition-all duration-500 ${solid ? 'h-20' : 'h-24'}`}>
        <Link to="/" className="relative z-10" aria-label="Alliance International — Home">
          <Logo light={!solid} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `${linkBase} ${solid ? 'text-charcoal/70 hover:text-charcoal' : 'text-white/85 hover:text-white'} ${
                  isActive ? (solid ? '!text-charcoal' : '!text-white') : ''
                } group`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-500 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 border px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
              solid
                ? 'border-charcoal bg-charcoal text-white hover:bg-transparent hover:text-charcoal'
                : 'border-white/50 text-white hover:border-white hover:bg-white hover:text-charcoal'
            }`}
          >
            Enquire <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Link>
        </div>

        <button
          type="button"
          className={`relative z-10 -mr-2 p-2 lg:hidden ${solid ? 'text-charcoal' : 'text-white'}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
        </button>
      </div>
    </header>

      {/* Mobile menu — rendered outside <header> because backdrop-filter would trap position:fixed */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-white transition-all duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Mobile" className="container-x flex h-full flex-col pt-10 pb-12">
          {NAV_LINKS.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : '0ms' }}
              className={({ isActive }) =>
                `border-b border-charcoal/10 py-5 font-serif text-[2rem] transition-all duration-500 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                } ${isActive ? 'text-charcoal' : 'text-charcoal/60'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="mt-auto inline-flex items-center justify-center gap-2 bg-charcoal px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
          >
            Send an Enquiry <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </nav>
      </div>
    </>
  );
}
