import { useEffect } from 'react';

const BASE = 'Alliance International';

const PAGE_META = {
  default: {
    title: `${BASE} | Premium Agro Commodities`,
    description:
      'Alliance International is a premium agro-commodity import and export company connecting global markets through trusted sourcing of red onions, dehydrated onions, garlic, sesame seeds, pulses, spices and cotton yarn.',
  },
  'About Us': {
    title: `About Us | ${BASE}`,
    description:
      'Learn about Alliance International — a joint venture between Alpha Food Ingredients and United Raw Material with 25+ years of expertise in agronomy, ingredient supply, and global commodity exports.',
  },
  Products: {
    title: `Products | ${BASE}`,
    description:
      'Explore our premium agro-commodity portfolio — red onions, dehydrated onions, dehydrated garlic, sesame seeds, cotton yarn, pulses and spices. Quality sourced for global buyers.',
  },
  'Contact Us': {
    title: `Contact Us | ${BASE}`,
    description:
      'Get in touch with Alliance International. Share your commodity requirements and our team will respond with availability, grades, packaging and pricing.',
  },
};

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOgMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (el) el.setAttribute('content', content);
}

export function usePageTitle(title) {
  useEffect(() => {
    const knownMeta = PAGE_META[title];
    const pageTitle = title ? `${title} | ${BASE}` : PAGE_META.default.title;

    // For dynamic pages (product names, category names) not in PAGE_META,
    // generate a sensible description automatically.
    const description = knownMeta
      ? knownMeta.description
      : title
      ? `${title} — premium agro commodity available for global export through Alliance International. Enquire for grades, packaging and pricing.`
      : PAGE_META.default.description;

    document.title = pageTitle;
    setMeta('description', description);
    setOgMeta('og:title', pageTitle);
    setOgMeta('og:description', description);
    setOgMeta('twitter:title', pageTitle);
    setOgMeta('twitter:description', description);
  }, [title]);
}
