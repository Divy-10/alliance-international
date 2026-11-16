import { ChevronDown, ShieldCheck, Globe, Clock, Award } from 'lucide-react';
import Button from './Button.jsx';
import SmartImage from './SmartImage.jsx';
import { IMAGES } from '../data/siteContent.js';

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-black">
      {/* Background Hero Image — fully visible across the section */}
      <SmartImage
        src={IMAGES.hero}
        alt="Premium red onions — freshly harvested"
        eager
        fetchPriority="high"
        dark
        className="absolute inset-0 -z-20 h-full w-full"
        imgClassName="object-cover object-center scale-[1.02] transition-transform duration-1000"
      />

      {/* Lightweight, transparent cinematic overlays — allows photo to shine through clearly */}
      <div className="absolute inset-0 -z-10 bg-black/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-transparent to-black/50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

      {/* Main Content Area — Text directly positioned over the image */}
      <div className="container-x relative z-10 flex flex-1 flex-col justify-center pt-32 pb-10 md:pt-40 md:pb-14">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="anim-fade-up inline-flex items-center gap-2.5 rounded-full border border-gold/50 bg-black/60 px-4 py-1.5 shadow-lg backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_#b49a68]" />
            <span className="text-[11px] font-semibold tracking-[0.26em] text-gold uppercase">
              International Agro-Commodity Export
            </span>
          </div>

          {/* Main Headline directly over image */}
          <h1
            className="anim-fade-up mt-6 font-serif text-[2.75rem] leading-[1.05] !text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] sm:text-6xl md:text-7xl lg:text-[5.25rem]"
            style={{ animationDelay: '100ms' }}
          >
            Connecting Global Markets Through{' '}
            <em className="font-normal italic text-[#e5d8be]">Premium</em> Agro Commodities.
          </h1>

          {/* Subtitle & Value Proposition */}
          <p
            className="anim-fade-up mt-6 max-w-2xl border-l-2 border-gold pl-5 text-[1.0625rem] leading-[1.8] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] md:text-[1.125rem]"
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
            <Button to="/products" variant="light" className="shadow-xl">
              Explore Our Products
            </Button>
            <Button to="/contact" variant="ghostLight" arrow={false} className="shadow-lg backdrop-blur-sm">
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Trust & Credentials Bottom Strip with glassmorphism so image shows underneath */}
      <div className="relative z-10 border-t border-white/20 bg-black/45 py-6 backdrop-blur-md">
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
