import { ChevronDown, ArrowRight, ShieldCheck, Globe, Clock, Award } from 'lucide-react';
import Button from './Button.jsx';
import SmartImage from './SmartImage.jsx';
import { IMAGES } from '../data/siteContent.js';

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-black">
      {/* Background Hero Image */}
      <SmartImage
        src={IMAGES.hero}
        alt="Premium red onions — freshly harvested"
        eager
        fetchPriority="high"
        dark
        className="absolute inset-0 -z-20 h-full w-full"
        imgClassName="object-cover object-center anim-slow-zoom"
      />

      {/* Cinematic Overlays — directional contrast preservation */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
      <div className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* Main Content Area — vertically balanced */}
      <div className="container-x relative z-10 flex flex-1 flex-col justify-center pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-4xl">
          {/* Eyebrow badge */}
          <div className="anim-fade-up inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-black/50 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
              International Agro-Commodity Export
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="anim-fade-up mt-7 font-serif text-[2.75rem] leading-[1.04] !text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            style={{ animationDelay: '120ms' }}
          >
            Connecting Global Markets Through{' '}
            <em className="font-normal italic text-[#d9c9a3]">Premium</em> Agro Commodities.
          </h1>

          {/* Subtitle & Value Proposition */}
          <p
            className="anim-fade-up mt-7 max-w-2xl border-l-2 border-gold/70 pl-6 text-[1.0625rem] leading-[1.8] text-white/80 md:text-[1.125rem]"
            style={{ animationDelay: '220ms' }}
          >
            Delivering export-grade agricultural commodities from fertile origins to global destinations through
            decades of agronomic excellence, trusted sourcing, and dependable supply chain logistics.
          </p>

          {/* CTA Actions */}
          <div
            className="anim-fade-up mt-10 flex flex-wrap items-center gap-4 sm:gap-5"
            style={{ animationDelay: '320ms' }}
          >
            <Button to="/products" variant="light">
              Explore Our Products
            </Button>
            <Button to="/contact" variant="ghostLight" arrow={false}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Trust & Credentials Bottom Strip */}
      <div className="container-x relative z-10 border-t border-white/15 pb-8 pt-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
            <div>
              <p className="font-serif text-lg text-white">25+ Years</p>
              <p className="text-[11px] tracking-wider text-white/50 uppercase">Agronomic Legacy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
            <div>
              <p className="font-serif text-lg text-white">Strict Quality</p>
              <p className="text-[11px] tracking-wider text-white/50 uppercase">Export Certified</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
            <div>
              <p className="font-serif text-lg text-white">Worldwide</p>
              <p className="text-[11px] tracking-wider text-white/50 uppercase">Port Logistics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
            <div>
              <p className="font-serif text-lg text-white">Direct Sourcing</p>
              <p className="text-[11px] tracking-wider text-white/50 uppercase">Farm to Shipment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#intro"
        aria-label="Scroll to introduction"
        className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-white/40 transition-colors hover:text-white md:block"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" strokeWidth={1.25} />
      </a>
    </section>
  );
}
