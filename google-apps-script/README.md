# Google Sheets + Apps Script setup

Google Sheets is the product database. A Google Apps Script Web App reads it and serves read-only JSON to the website. Once this is set up, you add, edit, hide or feature products in the sheet, and the website updates on the next page load. You don't need to change any code.

---

## 1. Create the spreadsheet

1. Create a new Google Sheet, for example **"Alliance International — Product Catalogue"**.
2. Add the sheets, using either method:
   - **Import the templates.** Go to **File → Import → Upload**, choose `sheet-templates/Categories.csv`, then pick **"Insert new sheet(s)"**. Rename the new tab to exactly `Categories`. Do the same with `Products.csv` and name that tab `Products`.
   - **Start from empty sheets.** Paste `Code.gs` first (step 2), then run the `setupSheets` function once. It creates `Categories`, `Products` and `Enquiries` with the correct headers, Active/Inactive dropdowns and a Yes/No dropdown for featured.

> Got an Excel file? Import it into Google Sheets first (File → Import). Apps Script reads Google Sheets only. It can't read a local `.xlsx` file.

### Sheet: `Categories`

| Column | Required | Notes |
|---|---|---|
| `category_id` | ✔ | Unique ID, e.g. `CAT-008`. Products link to categories through this ID. |
| `category_name` | ✔ | Shown on the website. |
| `category_slug` | | URL part, e.g. `red-onion` → `/products/red-onion`. Leave blank to generate it from the name. |
| `category_description` | | Short text. The card shows it only when you fill it in. |
| `category_image` | | Public image URL (see "Images" below). |
| `display_order` | | 1, 2, 3… Lower numbers show first. |
| `status` | | `Active` or `Inactive`. A blank status counts as Active. |

### Sheet: `Products`

| Column | Required | Notes |
|---|---|---|
| `product_id` | ✔ | Unique ID, e.g. `PRD-020`. |
| `category_id` | ✔ | Must match a `category_id` in **Categories**. |
| `category_name` | | Used only if `category_id` is blank, so it's handy for quick entry. |
| `product_name` | ✔ | |
| `product_slug` | | Leave blank to generate it from the name. |
| `short_description` | | Shown on product cards. |
| `full_description` | | Shown on the details page. A blank line starts a new paragraph. |
| `product_image` | | Main image URL. |
| `gallery_images` | | Extra image URLs, separated by commas or one per line. |
| `specifications` | | One spec per line (or separated by `;`), written as `Label: Value`, e.g. `Moisture: 6% max`. |
| `grade` / `origin` / `packaging` / `availability` | | Shown only when filled in. |
| `featured` | | `Yes` (or TRUE / a ticked checkbox) shows the product on the homepage. |
| `display_order` | | Order within the category. |
| `status` | | `Active` or `Inactive`. Inactive products disappear from the website. |

The website hides any field you leave blank, so nothing is ever made up.

## 2. Add the Apps Script

1. In the spreadsheet, go to **Extensions → Apps Script**.
2. Delete the sample code and paste the full contents of `Code.gs`. Save.
3. Optional: run `testCatalog` from the toolbar to preview the JSON. Approve the permission prompt the first time.

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**. Under "Select type", choose **Web app**.
2. Set **Execute as: Me** and **Who has access: Anyone**.
3. Click **Deploy** and copy the **Web app URL**. It ends in `/exec`.
4. Test it in a browser: `https://script.google.com/macros/s/…/exec?action=health`

> After editing `Code.gs`, go to **Deploy → Manage deployments → Edit (✎) → Version: New version → Deploy**. This keeps the same URL. Edits to the **sheet data** don't need a redeploy.

## 4. Connect the website

In the website folder, copy `.env.example` to `.env` and set:

```
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXXXXX/exec
```

Then restart `npm run dev`, or rebuild with `npm run build`. The site now reads from Google Sheets instead of the demo JSON.

On hosts like Vercel or Netlify, add the same variable in the project's **Environment Variables** settings and redeploy.

## 5. Optional: save Contact form enquiries to the sheet

`Code.gs` includes a `doPost` handler that adds each enquiry to an **Enquiries** sheet. To turn it on:

```
VITE_ENABLE_ENQUIRY_SUBMISSION=true
```

To also get an email for each enquiry, uncomment the `MailApp.sendEmail` line in `doPost` and redeploy a new version.

Until you turn this on, the website shows the form as **demo-only**. It validates entries but doesn't send or store anything.

---

## API reference (GET)

| Request | Returns |
|---|---|
| `?action=catalog` | `{ categories: [...], products: [...] }`. The website uses this one call. |
| `?action=categories` | Active categories |
| `?action=products` | Active products |
| `?action=products&category=red-onion` | Active products in one category |
| `?action=product&slug=fresh-red-onion` | One product |
| `?action=featured` | Featured products |
| `?action=health` | Status check |

Response shape:

```json
{ "success": true, "data": { … }, "meta": { "generatedAt": "2026-11-05T08:00:00.000Z" } }
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Product not found." } }
```

## Images

`product_image`, `gallery_images` and `category_image` must be **public, direct image URLs**, meaning a link that opens the image itself. Good options:

- Images hosted on the website, e.g. put files in `public/images/` and use `/images/red-onion.jpg`
- An image CDN or a hosting service such as Cloudinary or ImageKit
- Google Drive *can* work if the file is shared as "Anyone with the link", using `https://drive.google.com/thumbnail?id=FILE_ID&sz=w1600`. A CDN is more reliable.

If an image URL is missing or broken, the website shows a styled "Image to be provided" panel instead of a broken image.

## Security

- The Web App only **reads** active catalogue rows. Visitors can't edit the spreadsheet.
- Keep the spreadsheet itself private. Only the Web App URL is public.
- The frontend has no API keys or credentials.
