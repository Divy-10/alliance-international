import { useSearchParams } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Reveal from '../components/Reveal.jsx';
import { CONTACT_INFO, IMAGES } from '../data/siteContent.js';
import { getProducts, getCachedProducts } from '../services/productService.js';
import { useAsync } from '../hooks/useAsync.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function Contact() {
  usePageTitle('Contact Us');
  const [params] = useSearchParams();
  const initialProduct = params.get('product') || '';
  const { data: products } = useAsync(getProducts, [], getCachedProducts);
  const productOptions = (products || []).map((p) => p.name);

  const details = [
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: CONTACT_INFO.phone,
      href: `tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: CONTACT_INFO.address,
      href: 'https://www.google.com/maps/search/?api=1&query=New+Block+No.+503+Mahuvej+Road+Village+Mahuvej+Kosamba+Mangrol+Surat+Gujarat+394125',
    },
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
              {details.map(({ icon: Icon, label, value, href, isPlaceholder }) => (
                <li key={label} className="flex gap-5 border-b border-charcoal/10 py-6">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.25} />
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-charcoal/50 uppercase">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="mt-2 block whitespace-pre-line text-[15px] font-medium leading-relaxed text-charcoal transition-colors hover:text-gold hover:underline underline-offset-4"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className={`mt-2 whitespace-pre-line text-[15px] leading-relaxed ${isPlaceholder ? 'text-charcoal/50 italic' : 'font-medium text-charcoal'}`}>
                        {value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Embedded Location Map */}
            <div className="mt-10 overflow-hidden border border-charcoal/15 bg-white shadow-sm">
              <div className="relative aspect-[4/3] w-full">
                <iframe
                  title="Alliance International Location Map"
                  src="https://maps.google.com/maps?q=Mahuvej+Road,+Village+Mahuvej,+Kosamba,+Mangrol,+Surat,+Gujarat+394125&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex items-center justify-between border-t border-charcoal/10 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold" strokeWidth={1.5} />
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-charcoal/60 uppercase">Surat, Gujarat</span>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=New+Block+No.+503+Mahuvej+Road+Village+Mahuvej+Kosamba+Mangrol+Surat+Gujarat+394125"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-medium text-gold hover:underline"
                >
                  View on Google Maps →
                </a>
              </div>
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
