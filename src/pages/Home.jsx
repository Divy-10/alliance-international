import Hero from '../components/Hero.jsx';
import Button from '../components/Button.jsx';
import Reveal from '../components/Reveal.jsx';
import SmartImage from '../components/SmartImage.jsx';
import CoreValues from '../components/CoreValues.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';
import ContactCTA from '../components/ContactCTA.jsx';
import { ABOUT_SHORT, IMAGES } from '../data/siteContent.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function Home() {
  usePageTitle();
  return (
    <>
      <Hero />

      {/* Introduction */}
      <section id="intro" className="section-y scroll-mt-20 bg-ivory">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-20">
          <Reveal className="relative isolate lg:col-span-5">
            <SmartImage src={IMAGES.about} alt="Agricultural fields at harvest" label="Agricultural sourcing" className="aspect-[4/5]" />
            <div className="absolute -right-4 -bottom-4 -z-0 hidden h-full w-full border border-gold/40 lg:block" aria-hidden="true" style={{ zIndex: -1 }} />
          </Reveal>
          <div className="flex flex-col justify-center lg:col-span-7 lg:pl-6">
            <Reveal>
              <p className="eyebrow">About Alliance International</p>
              <h2 className="display-2 mt-6">Bridging Agriculture and Global Markets.</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-10 font-serif text-[1.65rem] leading-[1.45] text-charcoal/80 italic">{ABOUT_SHORT[0]}</p>
              <p className="lead mt-7">{ABOUT_SHORT[1]}</p>
              <div className="mt-12">
                <Button to="/about" variant="outline">
                  About Us
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CoreValues />

      <FeaturedProducts />

      {/* Global trade statement */}
      <section className="relative isolate overflow-hidden bg-black">
        <SmartImage src={IMAGES.trade} alt="Container vessel at an international port" dark className="absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 bg-black/70" />
        <div className="container-x grid min-h-[78vh] items-center py-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <p className="eyebrow">Global Trade</p>
            <h2 className="mt-8 font-serif text-[2.6rem] leading-[1.05] !text-white sm:text-6xl lg:text-[4.75rem]">
              From Agricultural Origins to Global Destinations.
            </h2>
            <p className="mt-8 max-w-2xl text-[1.0625rem] leading-8 text-white/70">
              From the initial harvest in the field to the final international destination, Alliance International is your
              trusted global partner for premium agricultural sourcing.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-16 lg:col-span-4 lg:mt-0">
            <ol className="space-y-px">
              {['Field', 'Quality', 'Logistics', 'Destination'].map((s, i) => (
                <li key={s} className="flex items-center gap-6 border-t border-white/15 py-5 last:border-b">
                  <span className="font-serif text-sm text-gold italic">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-serif text-2xl text-white">{s}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
