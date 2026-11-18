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

      {/* Global trade statement — Cinematic Cargo Ship Background */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-black py-28 md:py-36">
        {/* 1. Cinematic Background Image — Positive z-stacking */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.trade}
            alt="International container cargo ship at golden hour"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center md:object-[center_35%]"
          />
          {/* Subtle directional gradient: darker on left for readability, translucent on right to showcase the ship and sunset */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
        </div>

        {/* 2. Content directly over background */}
        <div className="container-x relative z-10 w-full">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/50 bg-black/60 px-4 py-1.5 shadow-lg backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_#b49a68]" />
                <span className="text-[11px] font-semibold tracking-[0.26em] text-gold uppercase">
                  Global Trade &amp; Logistics
                </span>
              </div>
              <h2 className="mt-6 font-serif text-[2.75rem] leading-[1.05] !text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-6xl lg:text-[4.75rem]">
                From Agricultural Origins to <em className="font-normal italic text-[#e5d8be]">Global</em> Destinations.
              </h2>
              <p className="mt-6 max-w-2xl text-[1.0625rem] leading-8 text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                From the initial harvest in certified fields to the final international port, Alliance International delivers
                end-to-end supply chain reliability, temperature-controlled logistics, and seamless export compliance worldwide.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button to="/about" variant="light">
                  Our Supply Chain
                </Button>
                <Button to="/contact" variant="ghostLight" arrow={false} className="border-white/30 backdrop-blur-sm">
                  Inquire For Shipments
                </Button>
              </div>
            </Reveal>

            <Reveal delay={150} className="lg:col-span-5">
              <div className="rounded-2xl border border-white/20 bg-black/60 p-8 shadow-2xl backdrop-blur-md">
                <p className="text-[11px] font-semibold tracking-[0.24em] text-gold uppercase">
                  End-to-End Trade Architecture
                </p>
                <ol className="mt-6 divide-y divide-white/15">
                  {[
                    { step: '01', title: 'Farm & Harvest', desc: 'Direct sourcing from certified agronomic origins' },
                    { step: '02', title: 'Quality Verification', desc: 'BRC, FSSAI & rigorous batch laboratory testing' },
                    { step: '03', title: 'Maritime Logistics', desc: 'Reefer & containerized global port dispatch' },
                    { step: '04', title: 'Destination Delivery', desc: 'Seamless customs clearance & buyer receipt' },
                  ].map((s) => (
                    <li key={s.step} className="flex items-start gap-5 py-4 first:pt-0 last:pb-0">
                      <span className="font-serif text-lg font-medium text-gold italic">{s.step}</span>
                      <div>
                        <p className="font-serif text-xl font-medium text-white">{s.title}</p>
                        <p className="mt-0.5 text-[13px] text-white/65">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
