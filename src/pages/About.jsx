import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import SmartImage from '../components/SmartImage.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CoreValues from '../components/CoreValues.jsx';
import ContactCTA from '../components/ContactCTA.jsx';
import { ABOUT_DETAILED, FOOD_NETWORK, IMAGES, MISSION, VISION } from '../data/siteContent.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function About() {
  usePageTitle('About Us');
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Rooted in agronomy. Built for global trade."
        image={IMAGES.aboutHero}
        imageAlt="Cultivated agricultural fields"
      />

      {/* About Alliance International */}
      <section className="section-y bg-ivory">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-32">
              <p className="eyebrow">About Alliance International</p>
              <h2 className="display-2 mt-6">Bridging Agriculture and Global Markets.</h2>
              <SmartImage
                src={IMAGES.fields}
                alt="Agricultural produce in the field"
                label="Agricultural sourcing"
                className="mt-12 aspect-[5/4]"
              />
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:pt-4">
            <Reveal>
              <p className="font-serif text-[1.85rem] leading-[1.4] text-charcoal/80 italic">{ABOUT_DETAILED[0]}</p>
            </Reveal>
            <div className="mt-12 space-y-8 border-l border-gold/50 pl-8 md:pl-10">
              {ABOUT_DETAILED.slice(1).map((p, i) => (
                <Reveal key={`about-para-${i}`} delay={i * 80}>
                  <p className="lead">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission — pure black background replacing green */}
      <section className="bg-black">
        <div className="container-x grid lg:grid-cols-2">
          {[
            { label: 'Our Vision', text: VISION },
            { label: 'Our Mission', text: MISSION },
          ].map((b, i) => (
            <Reveal
              key={b.label}
              delay={i * 120}
              className={`py-20 md:py-28 ${i === 0 ? 'border-b border-white/10 lg:border-r lg:border-b-0 lg:pr-16' : 'lg:pl-16'}`}
            >
              <p className="eyebrow">{b.label}</p>
              <p className="mt-10 font-serif text-[1.75rem] leading-[1.4] text-white md:text-[2.1rem]">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CoreValues tone="white" />

      {/* Our Food Network */}
      <section className="section-y bg-ivory">
        <div className="container-x">
          <SectionHeading eyebrow="Our Food Network" title="A network built on shared expertise." />
          <div className="mt-16 grid gap-px border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
            {FOOD_NETWORK.map((org, i) => (
              <Reveal key={org.name} delay={i * 80} className="flex flex-col bg-ivory p-8 md:p-10">
                <LogoPlaceholder name={org.name} logo={org.logo} />
                <h3 className="mt-10 text-[1.6rem] leading-tight">{org.name}</h3>
                {org.intro ? (
                  <p className="mt-4 text-[14px] leading-7 text-charcoal/70">{org.intro}</p>
                ) : (
                  <p className="mt-4 text-[13px] leading-6 text-charcoal/40 italic">Company introduction to be provided.</p>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}

function LogoPlaceholder({ name, logo }) {
  if (logo) return <img src={logo} alt={`${name} logo`} className="h-16 w-auto object-contain" />;
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3);
  return (
    <div className="flex h-20 items-center justify-between border border-dashed border-charcoal/15 px-5">
      <span className="font-serif text-3xl tracking-wide text-charcoal/60">{initials}</span>
      <span className="text-[9px] font-semibold tracking-[0.22em] text-charcoal/35 uppercase">Logo</span>
    </div>
  );
}
