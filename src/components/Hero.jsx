import { ChevronDown } from 'lucide-react';
import Button from './Button.jsx';
import SmartImage from './SmartImage.jsx';
import { IMAGES } from '../data/siteContent.js';

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-black">
      <SmartImage
        src={IMAGES.hero}
        alt="Premium red onions — freshly harvested"
        eager
        fetchPriority="high"
        dark
        className="absolute inset-0 -z-10"
        imgClassName="anim-slow-zoom"
      />
      {/* Dark cinematic overlay — left-weighted for text legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/88 via-black/55 to-black/20" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />

      <div className="container-x pt-40 pb-20 md:pb-28">
        <p className="anim-fade-up text-[11px] font-semibold tracking-[0.5em] text-gold uppercase sm:text-[12px]">
          Alliance International
        </p>
        <h1
          className="anim-fade-up mt-8 max-w-5xl font-serif text-[2.9rem] leading-[1.02] !text-white sm:text-6xl lg:text-[5.75rem]"
          style={{ animationDelay: '150ms' }}
        >
          Connecting Global Markets Through <em className="font-normal text-[#d9c9a3]">Premium</em> Agro Commodities.
        </h1>
        <div
          className="anim-fade-up mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
          style={{ animationDelay: '300ms' }}
        >
          <p className="max-w-xl border-l border-gold/60 pl-6 text-[1.0625rem] leading-8 text-white/75">
            Delivering quality agricultural commodities through trusted sourcing, strong partnerships and reliable global
            trade.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button to="/products" variant="light">
              Explore Our Products
            </Button>
            <Button to="/contact" variant="ghostLight" arrow={false}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      <a
        href="#intro"
        aria-label="Scroll to introduction"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/50 transition-colors hover:text-white md:block"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" strokeWidth={1} />
      </a>
    </section>
  );
}
