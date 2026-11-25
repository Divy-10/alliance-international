/**
 * Alliance International — Product Catalogue API
 * ======================================================================
 * Google Apps Script Web App that serves the "Categories" and "Products"
 * sheets as public, READ-ONLY JSON for the website.
 *
 * Setup (full guide in google-apps-script/README.md):
 *   1. Open your Google Sheet → Extensions → Apps Script.
 *   2. Paste this file into Code.gs and save.
 *   3. Deploy → New deployment → Web app
 *        Execute as:      Me
 *        Who has access:  Anyone
 *   4. Copy the /exec URL into the website's .env:
 *        VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
 *
 * Security notes
 *   • Visitors never get edit access to the spreadsheet. The script only
 *     reads the two catalogue sheets and returns ACTIVE rows.
 *   • Do not share the spreadsheet itself publicly; only the Web App URL
 *     is public.
 *   • No secrets are needed in the frontend.
 *
 * Endpoints (GET)
 *   ?action=catalog                       → { categories, products }  (used by the website)
 *   ?action=categories                    → active categories
 *   ?action=products                      → active products
 *   ?action=products&category=<slug>      → active products in one category
 *   ?action=product&slug=<product-slug>   → one product (optional &category=<slug>)
 *   ?action=featured                      → featured products
 *   ?action=health                        → quick status check
 *
 * Optional (POST) — Contact form enquiries
 *   Appends a row to an "Enquiries" sheet. Only used when the website has
 *   VITE_ENABLE_ENQUIRY_SUBMISSION=true.
 */

// ── Configuration ──────────────────────────────────────────────────────
var CONFIG = {
  // Leave empty when the script is bound to the spreadsheet (Extensions → Apps Script).
  // For a standalone script, paste the spreadsheet ID here.
  SPREADSHEET_ID: '',
  CATEGORIES_SHEET: 'Categories',
  PRODUCTS_SHEET: 'Products',
  ENQUIRIES_SHEET: 'Enquiries',
  // Seconds to cache JSON on Google's side. 0 = always read fresh data.
  CACHE_SECONDS: 0,
  // Set false to disable the enquiry POST endpoint entirely.
  ENQUIRIES_ENABLED: true,
  // Notification email where new enquiries are sent
  NOTIFICATION_EMAIL: 'jayant@aiexim.com',
};

// ── Entry points ───────────────────────────────────────────────────────
function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var action = String(p.action || 'catalog').toLowerCase();

    if (action === 'health') return json_({ success: true, data: { status: 'ok', time: new Date().toISOString() } });

    var catalog = getCatalog_();
    var data;

    switch (action) {
      case 'catalog':
        data = catalog;
        break;
      case 'categories':
        data = catalog.categories;
        break;
      case 'products':
        data = p.category
          ? catalog.products.filter(function (x) { return x.category_slug === slugify_(p.category); })
          : catalog.products;
        break;
      case 'product':
        var slug = slugify_(p.slug);
        var cat = p.category ? slugify_(p.category) : '';
        data = catalog.products.filter(function (x) {
          return x.product_slug === slug && (!cat || x.category_slug === cat);
        })[0] || null;
        if (!data) return json_({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found.' } });
        break;
      case 'featured':
        data = catalog.products.filter(function (x) { return toBool_(x.featured); });
        break;
      default:
        return json_({ success: false, error: { code: 'BAD_REQUEST', message: 'Unknown action: ' + action } });
    }

    return json_({ success: true, data: data, meta: { generatedAt: new Date().toISOString() } });
  } catch (err) {
    console.error(err);
    return json_({ success: false, error: { code: 'SERVER_ERROR', message: 'Unable to read the catalogue.' } });
  }
}

function doPost(e) {
  try {
    if (!CONFIG.ENQUIRIES_ENABLED) {
      return json_({ success: false, error: { code: 'DISABLED', message: 'Enquiries are not enabled.' } });
    }
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action !== 'enquiry') {
      return json_({ success: false, error: { code: 'BAD_REQUEST', message: 'Unknown action.' } });
    }

    var clean = function (v, max) { return String(v || '').replace(/^[=+\-@]/, "'$&").slice(0, max || 500).trim(); };
    var row = {
      name: clean(body.name, 120),
      company: clean(body.company, 160),
      email: clean(body.email, 160),
      phone: clean(body.phone, 40),
      country: clean(body.country, 80),
      product: clean(body.product, 160),
      message: clean(body.message, 4000),
    };
    if (!row.name || !row.company || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(row.email) || !row.country || !row.product || row.message.length < 10) {
      return json_({ success: false, error: { code: 'VALIDATION', message: 'Please complete all required fields.' } });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = getSpreadsheet_().getSheetByName(CONFIG.ENQUIRIES_SHEET);
      if (!sheet) {
        sheet = getSpreadsheet_().insertSheet(CONFIG.ENQUIRIES_SHEET);
        sheet.appendRow(['timestamp', 'name', 'company', 'email', 'phone', 'country', 'product', 'message', 'status']);
      }
      sheet.appendRow([new Date(), row.name, row.company, row.email, row.phone, row.country, row.product, row.message, 'New']);
    } finally {
      lock.releaseLock();
    }

    // Send email notification to jayant@aiexim.com (or sheet owner)
    try {
      var recipient = CONFIG.NOTIFICATION_EMAIL || Session.getEffectiveUser().getEmail();
      var subject = 'New Website Enquiry: ' + row.product + ' (' + row.company + ')';
      var htmlBody =
        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px; background-color: #ffffff;">' +
        '<div style="border-bottom: 2px solid #B49A68; padding-bottom: 12px; margin-bottom: 20px;">' +
        '<h2 style="color: #171717; margin: 0; font-size: 20px;">Alliance International</h2>' +
        '<p style="color: #B49A68; margin: 4px 0 0 0; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">New Website Enquiry Received</p>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 14px;">' +
        '<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 10px 0; font-weight: bold; width: 30%; color: #555;">Product:</td><td style="padding: 10px 0; color: #171717; font-weight: bold; color: #B49A68;">' + row.product + '</td></tr>' +
        '<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 10px 0; font-weight: bold; color: #555;">Name:</td><td style="padding: 10px 0; color: #171717;">' + row.name + '</td></tr>' +
        '<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 10px 0; font-weight: bold; color: #555;">Company:</td><td style="padding: 10px 0; color: #171717;">' + row.company + '</td></tr>' +
        '<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 10px 0; font-weight: bold; color: #555;">Country:</td><td style="padding: 10px 0; color: #171717;">' + row.country + '</td></tr>' +
        '<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td><td style="padding: 10px 0;"><a href="mailto:' + row.email + '" style="color: #B49A68; text-decoration: none;">' + row.email + '</a></td></tr>' +
        '<tr style="border-bottom: 1px solid #f0f0f0;"><td style="padding: 10px 0; font-weight: bold; color: #555;">Phone:</td><td style="padding: 10px 0; color: #171717;">' + (row.phone ? '<a href="tel:' + row.phone + '" style="color: #171717; text-decoration: none;">' + row.phone + '</a>' : 'N/A') + '</td></tr>' +
        '<tr><td style="padding: 12px 0 6px 0; font-weight: bold; color: #555; vertical-align: top;">Requirement:</td><td style="padding: 12px 0 6px 0; color: #333; line-height: 1.5; white-space: pre-wrap;">' + row.message + '</td></tr>' +
        '</table>' +
        '<div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #eaeaea; font-size: 12px; color: #888; display: flex; justify-content: space-between;">' +
        '<span>Submitted via Alliance International Website</span>' +
        '</div></div>';

      var plainTextBody =
        'New Website Enquiry Received\n\n' +
        'Product: ' + row.product + '\n' +
        'Name: ' + row.name + '\n' +
        'Company: ' + row.company + '\n' +
        'Country: ' + row.country + '\n' +
        'Email: ' + row.email + '\n' +
        'Phone: ' + (row.phone || 'N/A') + '\n\n' +
        'Requirement:\n' + row.message + '\n\n' +
        '---\nSubmitted via Alliance International Website';

      MailApp.sendEmail({
        to: recipient,
        subject: subject,
        body: plainTextBody,
        htmlBody: htmlBody,
        replyTo: row.email,
      });
    } catch (mailErr) {
      console.error('Mail notification failed: ' + mailErr);
      // Row is still saved in sheet even if email dispatch encounters an issue
    }

    return json_({ success: true, data: { received: true } });
  } catch (err) {
    console.error(err);
    return json_({ success: false, error: { code: 'SERVER_ERROR', message: 'Your enquiry could not be saved.' } });
  }
}

// ── Catalogue ──────────────────────────────────────────────────────────
function getCatalog_() {
  var cache = CacheService.getScriptCache();
  if (CONFIG.CACHE_SECONDS > 0) {
    var hit = cache.get('catalog_v1');
    if (hit) return JSON.parse(hit);
  }

  var categories = readSheet_(CONFIG.CATEGORIES_SHEET)
    .filter(function (c) { return c.category_name && isActive_(c.status); })
    .map(function (c) {
      c.category_id = String(c.category_id || slugify_(c.category_name));
      c.category_slug = slugify_(c.category_slug || c.category_name);
      return c;
    })
    .sort(byOrder_);

  var byId = {}, byName = {};
  categories.forEach(function (c) {
    byId[c.category_id] = c;
    byName[String(c.category_name).toLowerCase()] = c;
  });

  var products = readSheet_(CONFIG.PRODUCTS_SHEET)
    .filter(function (p) { return p.product_name && isActive_(p.status); })
    .map(function (p) {
      var cat = byId[String(p.category_id)] || byName[String(p.category_name || '').toLowerCase()];
      if (!cat) return null; // hide products whose category is missing or inactive
      p.category_id = cat.category_id;
      p.category_name = cat.category_name;
      p.category_slug = cat.category_slug;
      p.product_id = String(p.product_id || slugify_(p.product_name));
      p.product_slug = slugify_(p.product_slug || p.product_name);
      return p;
    })
    .filter(Boolean)
    .sort(byOrder_);

  var result = { categories: categories, products: products };
  if (CONFIG.CACHE_SECONDS > 0) {
    try { cache.put('catalog_v1', JSON.stringify(result), CONFIG.CACHE_SECONDS); } catch (e) { /* >100KB: skip cache */ }
  }
  return result;
}

/** Reads a sheet into an array of objects keyed by the (lower-cased) header row. */
function readSheet_(name) {
  var sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error('Sheet "' + name + '" not found.');
  var values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  var headers = values[0].map(function (h) { return String(h).trim().toLowerCase().replace(/\s+/g, '_'); });
  return values.slice(1)
    .filter(function (r) { return r.some(function (v) { return String(v).trim() !== ''; }); })
    .map(function (r) {
      var o = {};
      headers.forEach(function (h, i) { if (h) o[h] = String(r[i]).trim(); });
      return o;
    });
}

// ── Helpers ────────────────────────────────────────────────────────────
function getSpreadsheet_() {
  return CONFIG.SPREADSHEET_ID ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function isActive_(s) {
  s = String(s || '').trim().toLowerCase();
  return s === '' || s === 'active' || s === 'published' || s === 'yes';
}

function toBool_(v) {
  return ['true', 'yes', 'y', '1', 'featured'].indexOf(String(v || '').trim().toLowerCase()) !== -1;
}

function slugify_(v) {
  return String(v || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function byOrder_(a, b) {
  var x = Number(a.display_order), y = Number(b.display_order);
  x = isNaN(x) || a.display_order === '' ? 9999 : x;
  y = isNaN(y) || b.display_order === '' ? 9999 : y;
  return x - y || String(a.category_name || a.product_name).localeCompare(String(b.category_name || b.product_name));
}

/** Run once from the editor to create the three sheets with the correct headers. */
function setupSheets() {
  var ss = getSpreadsheet_();
  var defs = {};
  defs[CONFIG.CATEGORIES_SHEET] = ['category_id', 'category_name', 'category_slug', 'category_description', 'category_image', 'display_order', 'status'];
  defs[CONFIG.PRODUCTS_SHEET] = ['product_id', 'category_id', 'category_name', 'product_name', 'product_slug', 'short_description', 'full_description', 'product_image', 'gallery_images', 'specifications', 'grade', 'origin', 'packaging', 'availability', 'featured', 'display_order', 'status'];
  defs[CONFIG.ENQUIRIES_SHEET] = ['timestamp', 'name', 'company', 'email', 'phone', 'country', 'product', 'message', 'status'];
  Object.keys(defs).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.appendRow(defs[name]);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, defs[name].length).setFontWeight('bold').setBackground('#171717').setFontColor('#F8F7F2');
    }
  });
  var statusRule = SpreadsheetApp.newDataValidation().requireValueInList(['Active', 'Inactive'], true).build();
  var featuredRule = SpreadsheetApp.newDataValidation().requireValueInList(['Yes', 'No'], true).build();
  ss.getSheetByName(CONFIG.CATEGORIES_SHEET).getRange('G2:G1000').setDataValidation(statusRule);
  ss.getSheetByName(CONFIG.PRODUCTS_SHEET).getRange('Q2:Q1000').setDataValidation(statusRule);
  ss.getSheetByName(CONFIG.PRODUCTS_SHEET).getRange('O2:O1000').setDataValidation(featuredRule);
}

/** Run from the editor to preview the JSON the website will receive. */
function testCatalog() {
  var c = getCatalog_();
  console.log('Categories: ' + c.categories.length + ', Products: ' + c.products.length);
  console.log(JSON.stringify(c, null, 2).slice(0, 3000));
}
