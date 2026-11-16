import { useSearchParams } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Reveal from '../components/Reveal.jsx';
import { CONTACT_PLACEHOLDERS, IMAGES } from '../data/siteContent.js';
import { getCategories } from '../services/categoryService.js';
import { useAsync } from '../hooks/useAsync.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function Contact() {
  usePageTitle('Contact Us');
  const [params] = useSearchParams();
  const initialProduct = params.get('product') || '';
  const { data: categories } = useAsync(getCategories, []);
  const productOptions = (categories || []).map((c) => c.name);

  const details = [
    { icon: Mail, label: 'Email', value: CONTACT_PLACEHOLDERS.email },
    { icon: Phone, label: 'Phone', value: CONTACT_PLACEHOLDERS.phone },
    { icon: MapPin, label: 'Location', value: CONTACT_PLACEHOLDERS.address },
    { icon: Clock, label: 'Business Hours', value: CONTACT_PLACEHOLDERS.hours },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let’s start a conversation."
        intro="Tell us about your commodity requirements and our team will get back to you."
        image={IMAGES.contactHero}
        imageAlt="Shipping containers at port"
      />

      <section className="section-y bg-ivory">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Our Contacts</p>
            <h2 className="mt-6 text-[2.4rem] leading-[1.1]">Get in touch with Alliance International.</h2>
            <ul className="mt-12 border-t border-charcoal/10">
              {details.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-5 border-b border-charcoal/10 py-6">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.25} />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-charcoal/50 uppercase">{label}</p>
                    <p className="mt-2 text-[15px] text-charcoal/55 italic">{value}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Map placeholder — replace with an embedded map once the address is confirmed. */}
            <div className="mt-10 flex aspect-[4/3] flex-col items-center justify-center border border-dashed border-charcoal/15 bg-white text-center">
              <MapPin className="h-6 w-6 text-gold" strokeWidth={1.25} />
              <p className="mt-4 text-[10px] font-semibold tracking-[0.24em] text-charcoal/40 uppercase">Location map</p>
              <p className="mt-1 text-[13px] text-charcoal/45 italic">To be added once the address is confirmed</p>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-8">
            <p className="eyebrow">Enquiry Form</p>
            <h2 className="mt-6 mb-12 text-[2.4rem] leading-[1.1]">Send us your requirement.</h2>
            <ContactForm key={initialProduct} productOptions={productOptions} initialProduct={initialProduct} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
