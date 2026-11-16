import { ChevronDown, ShieldCheck, Globe, Clock, Award } from 'lucide-react';
import Button from './Button.jsx';
import { IMAGES } from '../data/siteContent.js';

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-black">
      {/* 1. HERO BACKGROUND IMAGE — Direct positive z-index stacking */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.hero}
          alt="Premium export red onions harvest"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          className="h-full w-full object-cover object-center"
        />
        {/* Transparent dark veil so text is crisp while image remains clearly visible */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      {/* 2. TEXT CONTENT — Positioned directly ON TOP of the image */}
      <div className="container-x relative z-10 flex flex-1 flex-col justify-center pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="anim-fade-up inline-flex items-center gap-2.5 rounded-full border border-gold/60 bg-black/60 px-4 py-1.5 shadow-xl backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_#b49a68]" />
            <span className="text-[11px] font-semibold tracking-[0.26em] text-gold uppercase">
              International Agro-Commodity Export
            </span>
          </div>

          {/* Main Headline directly over image */}
          <h1
            className="anim-fade-up mt-6 font-serif text-[2.85rem] leading-[1.05] !text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] sm:text-6xl md:text-7xl lg:text-[5.25rem]"
            style={{ animationDelay: '100ms' }}
          >
            Connecting Global Markets Through{' '}
            <em className="font-normal italic text-[#e5d8be]">Premium</em> Agro Commodities.
          </h1>

          {/* Subtitle & Value Proposition */}
          <p
            className="anim-fade-up mt-6 max-w-2xl border-l-2 border-gold pl-5 text-[1.0625rem] leading-[1.8] text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] md:text-[1.125rem]"
            style={{ animationDelay: '200ms' }}
          >
            Delivering export-grade agricultural commodities directly from fertile origins to global destinations through
            agronomic excellence, certified sourcing, and reliable international supply chain logistics.
          </p>

          {/* CTA Actions */}
          <div
            className="anim-fade-up mt-9 flex flex-wrap items-center gap-4 sm:gap-5"
            style={{ animationDelay: '300ms' }}
          >
            <Button to="/products" variant="light" className="shadow-2xl">
              Explore Our Products
            </Button>
            <Button to="/contact" variant="ghostLight" arrow={false} className="shadow-xl backdrop-blur-md">
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Trust & Credentials Bottom Strip */}
      <div className="relative z-10 border-t border-white/20 bg-black/60 py-6 backdrop-blur-md">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:gap-8">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 shrink-0 text-gold drop-shadow" strokeWidth={1.75} />
              <div>
                <p className="font-serif text-lg font-medium text-white drop-shadow">25+ Years</p>
                <p className="text-[11px] font-medium tracking-wider text-white/70 uppercase">Agronomic Legacy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-gold drop-shadow" strokeWidth={1.75} />
              <div>
                <p className="font-serif text-lg font-medium text-white drop-shadow">Strict Quality</p>
                <p className="text-[11px] font-medium tracking-wider text-white/70 uppercase">Export Certified</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 shrink-0 text-gold drop-shadow" strokeWidth={1.75} />
              <div>
                <p className="font-serif text-lg font-medium text-white drop-shadow">Worldwide</p>
                <p className="text-[11px] font-medium tracking-wider text-white/70 uppercase">Port Logistics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 shrink-0 text-gold drop-shadow" strokeWidth={1.75} />
              <div>
                <p className="font-serif text-lg font-medium text-white drop-shadow">Direct Sourcing</p>
                <p className="text-[11px] font-medium tracking-wider text-white/70 uppercase">Farm to Shipment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#intro"
        aria-label="Scroll to introduction"
        className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 text-white/60 transition-colors hover:text-white md:block"
      >
        <ChevronDown className="h-5 w-5 animate-bounce drop-shadow" strokeWidth={1.5} />
      </a>
    </section>
  );
}
