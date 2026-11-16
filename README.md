# Alliance International — Website (Demo)

The premium B2B website for **Alliance International** (www.aiexim.co). The company trades agro commodities, imports and exports.

Built with **React, Vite, Tailwind CSS, React Router and Lucide icons**. **Google Sheets** manages the product catalogue through a **Google Apps Script** API.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
```

Requires Node.js 18 or later.

## Pages

| Route | Page |
|---|---|
| `/` | Home: hero, introduction, core values, featured products carousel, global trade statement, contact CTA |
| `/about` | About Us: company story, vision, mission, core values, food network |
| `/products` | Product categories |
| `/products/:categorySlug` | Product list for one category, with search, sorting and an empty state |
| `/products/:categorySlug/:productSlug` | Product details: gallery, description, specifications, enquiry |
| `/contact` | Contact Us: enquiry form with validation (demo-only until connected) |
| `*` | Custom 404 |

"Enquire Now" buttons open `/contact?product=<name>`, which pre-selects the product in the form.

## Product data: demo vs Google Sheets

The catalogue has one data layer and two sources:

| `VITE_GOOGLE_APPS_SCRIPT_URL` | Source |
|---|---|
| empty (default) | Local demo data in `src/data/demoCategories.json` and `src/data/demoProducts.json` |
| set to your Apps Script `/exec` URL | Live data from Google Sheets |

To switch, copy `.env.example` to `.env`, paste the URL, then restart or rebuild. You don't need to change any code. **See `google-apps-script/README.md` for the full Sheets setup.**

Once connected:
- A new row in **Products** appears in its category automatically.
- A new row in **Categories** appears on the Products page.
- Setting `status` to `Inactive` hides the row from the website.
- Setting `featured` to `Yes` adds the product to the homepage carousel.
- Edits to names, images or descriptions show on the next page load. The browser reuses data for `VITE_CACHE_SECONDS`, which defaults to 60.

### Architecture

```
src/
  config/api.js            ← reads VITE_* env vars, picks demo vs Sheets
  services/
    apiClient.js           ← fetches + normalises catalogue data (one cached request)
    categoryService.js     ← getCategories(), getCategoryBySlug()
    productService.js      ← getProducts(), getProductsByCategory(), getProductBySlug(),
                             getFeaturedProducts(), getRelatedProducts()
  utils/normalize.js       ← turns sheet rows into clean objects (slugs, booleans, lists, specs)
  hooks/useAsync.js        ← loading / error / reload state for pages
  data/
    demoCategories.json    ← sample data, same columns as the Google Sheet
    demoProducts.json
    siteContent.js         ← company copy from the brief, image URLs, contact placeholders
  components/              ← Header, Footer, Hero, ProductCard, CategoryCard, ContactForm, …
  pages/                   ← Home, About, Products, CategoryProducts, ProductDetails, Contact, NotFound
google-apps-script/
  Code.gs                  ← Apps Script Web App (read-only GET API + optional enquiry POST)
  README.md                ← step-by-step Sheets + deployment guide
  sheet-templates/*.csv    ← import these into Google Sheets
```

UI components never import the demo JSON directly. They call the service functions only.

## Content notes

All company copy comes from the *AI Website Brief*. The following are placeholders until Alliance International provides the details:

- **Contact details**: email, phone, address and business hours are marked `[… to be provided]` in `src/data/siteContent.js`.
- **Food Network**: intros for United Raw Materials, Sankalp Industries and Suryoday Cold Warehouse read "Company introduction to be provided". Logos are monogram placeholders. To add a real logo, set its `logo` URL in `siteContent.js`.
- **Company logo**: the monogram in `src/components/Logo.jsx` is a placeholder.
- **Demo products**: the sample rows are generic commodity types. Their specifications, grade, origin, packaging and availability fields are left blank on purpose, so the details page shows "shared on enquiry" in their place. Fill in those columns in Google Sheets and they will appear.
- **Spices** has no demo products, which shows the empty-category state.
- **Photography**: the demo uses Unsplash stock image URLs. Replace them with the company's own photography, either through the sheet's image columns or in `IMAGES` in `siteContent.js`. Missing images fall back to a styled placeholder.

## Contact form

Until you connect it, the form validates input and shows a confirmation clearly labelled **demo**. Nothing is sent. To save enquiries to an **Enquiries** sheet, set `VITE_ENABLE_ENQUIRY_SUBMISSION=true` after you deploy the Apps Script (see the Sheets guide).

## Deployment

This is a single-page app, so the host must send every route to `index.html`:
- **Netlify**: `public/_redirects` is included.
- **Vercel**: `vercel.json` is included.
- **Apache or cPanel hosting**: add an `.htaccess` file with a rewrite to `index.html`.

Set `VITE_GOOGLE_APPS_SCRIPT_URL` in the host's environment settings before building.
