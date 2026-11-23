/**
 * Company content — taken verbatim from the "AI Website Brief" PDF.
 * Items marked PLACEHOLDER are awaiting content from Alliance International.
 */

export const COMPANY = {
  name: 'Alliance International',
  domain: 'www.aiexim.co',
  tagline: 'Premium Agro Commodities · Import & Export',
  footerIntro:
    'A joint venture between Alpha Food Ingredients and United Raw Material, connecting the world with the finest agro commodities.',
};

/** Official contact details for Alliance International */
export const CONTACT_INFO = {
  email: 'jayant@aiexim.com',
  phone: '+91 98344 57388',
  address: '[Office address — to be provided]',
};

/** Backwards-compatibility alias */
export const CONTACT_PLACEHOLDERS = CONTACT_INFO;

export const IMAGES = {
  // Hero — cinematic red onion harvest
  hero: '/images/hero.jpg',
  // About intro — harvested agricultural produce, warm tones
  about: '/images/about.jpg',
  // About page hero — wide fields
  aboutHero: '/images/about-hero.jpg',
  // Fields — produce at source
  fields: '/images/fields.jpg',
  // Global trade — shipping / port logistics
  trade: '/images/trade.jpg',
  // Containers / warehouse
  containers: '/images/containers.jpg',
  warehouse: '/images/warehouse.jpg',
  // Products hero — varied spices & produce overhead
  productsHero: '/images/products-hero.jpg',
  // Contact hero — shipping logistics
  contactHero: '/images/contact-hero.jpg',
};

export const ABOUT_SHORT = [
  'At Alliance International, our mission is simple: to connect the world with the finest agro commodities.',
  "Alliance International is a joint venture between Alpha Food Ingredients and United Raw Material, combining more than two decades of experience in agronomy, ingredient supply, and global exports. Drawing on our parent companies' deep field expertise and strong supply networks, we deliver reliable, premium agricultural products to markets worldwide.",
];

export const ABOUT_DETAILED = [
  ...ABOUT_SHORT,
  "We envision Alliance International becoming the world\u2019s benchmark for supply chain integrity and agricultural distribution. Guided by a legacy of trust, we build trade relationships rooted in transparency and shared success. We do more than export commodities; we foster lasting global partnerships that support industries and feed communities worldwide.",
  'Strict quality control, operational efficiency, and agronomic excellence are at the heart of our daily operations. We draw on 25+ years of experience to uphold rigorous international standards at every stage. From the initial harvest in the field to the final international destination, Alliance International is your trusted global partner for premium agricultural sourcing.',
];

export const VISION =
  "To become the world\u2019s most trusted partner in agro-commodity exports, setting the benchmark for agricultural quality, supply chain integrity, and sustainable global distribution.";

export const MISSION =
  'To fuel global markets by delivering the highest quality agro commodities, bridging the gap between exceptional agronomy and seamless international trade through a legacy of trust and reliability.';

export const CORE_VALUES = [
  {
    key: 'quality',
    title: 'Quality Without Compromise',
    text: 'Sourcing and delivering only premium-grade agro commodities that strictly meet international standards.',
  },
  {
    key: 'trust',
    title: 'Legacy of Trust',
    text: 'Honouring our two decades of inherited expertise from Alpha Food Ingredients and United Raw Material by building transparent, long-term relationships with global buyers.',
  },
  {
    key: 'supply',
    title: 'Supply Chain Excellence',
    text: 'Ensuring seamless, efficient, and highly dependable logistics from the field straight to the final international destination.',
  },
  {
    key: 'agronomy',
    title: 'Agronomic Integrity',
    text: 'Respecting the land and the crop, leveraging deep agricultural knowledge to support sustainable practices and optimal yield quality.',
  },
];

export const FOOD_NETWORK = [
  {
    name: 'Alpha Food Ingredients',
    intro:
      'Alpha Food Ingredients Private Limited is a BRC-certified manufacturer and global exporter of high-quality dehydrated onion and garlic products.',
    logo: '',
  },
  { name: 'United Raw Materials', intro: '', logo: '' }, // PLACEHOLDER — intro to be supplied by URMPL
  { name: 'Sankalp Industries', intro: '', logo: '' }, // PLACEHOLDER
  { name: 'Suryoday Cold Warehouse', intro: '', logo: '' }, // PLACEHOLDER
];

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/contact', label: 'Contact Us' },
];
