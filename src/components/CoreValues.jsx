import { Award, Handshake, Ship, Sprout } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import Reveal from './Reveal.jsx';
import { CORE_VALUES } from '../data/siteContent.js';

const ICONS = { quality: Award, trust: Handshake, supply: Ship, agronomy: Sprout };

export default function CoreValues({ tone = 'white' }) {
  return (
    <section className={`section-y ${tone === 'white' ? 'bg-white' : 'bg-ivory'}`}>
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow="Our Core Values" title="The principles behind every shipment." className="lg:col-span-7" />
        </div>

        <div className="mt-16 grid border-t border-l border-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_VALUES.map((v, i) => {
            const Icon = ICONS[v.key];
            return (
              <Reveal
                key={v.key}
                delay={i * 90}
                className="group relative border-r border-b border-charcoal/10 p-8 transition-colors duration-500 hover:bg-charcoal md:p-10"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-7 w-7 text-gold" strokeWidth={1.1} />
                  <span className="font-serif text-sm text-charcoal/30 italic transition-colors group-hover:text-white/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-14 text-[1.7rem] leading-tight transition-colors duration-500 group-hover:text-white">
                  {v.title}
                </h3>
                <p className="mt-5 text-[14px] leading-7 text-charcoal/65 transition-colors duration-500 group-hover:text-white/75">
                  {v.text}
                </p>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gold transition-all duration-700 group-hover:w-full" />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
