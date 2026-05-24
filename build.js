/* ============================================================
   GALEN FEED BUILDER
   Reads catalog.json -> writes public/feeds/{truck1,autoline,machineseeker}.xml
   No dependencies. Runs on Cloudflare Pages build step: `node build.js`
   ------------------------------------------------------------
   When a platform gives you its official XSD/spec, you only
   edit the relevant exporter function below. Nothing else changes.
============================================================ */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CATALOG = path.join(ROOT, 'catalog.json');
const OUT_DIR = path.join(ROOT, 'public', 'feeds');

function escapeXml(unsafe) {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/* ---- TRUCK1 XML ---- */
function exportTruck1(products) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<ads>\n';
  products.forEach(p => {
    xml += '  <ad>\n';
    xml += `    <id>${escapeXml(p.ref)}</id>\n`;
    xml += `    <category>${escapeXml(p.category)}</category>\n`;
    xml += `    <condition>${escapeXml(p.condition)}</condition>\n`;
    xml += `    <make>${escapeXml(p.make)}</make>\n`;
    xml += `    <model>${escapeXml(p.model)}</model>\n`;
    xml += `    <year>${escapeXml(p.year)}</year>\n`;
    xml += `    <price>${escapeXml(p.price)}</price>\n`;
    xml += `    <currency>${escapeXml(p.currency)}</currency>\n`;
    xml += `    <vat>${escapeXml(p.vat)}</vat>\n`;
    if (p.hours) xml += `    <working_hours>${escapeXml(p.hours)}</working_hours>\n`;
    if (p.weight) xml += `    <weight units="kg">${escapeXml(p.weight)}</weight>\n`;
    xml += `    <location>\n      <city>${escapeXml(p.city)}</city>\n      <country>${escapeXml(p.country)}</country>\n    </location>\n`;
    xml += `    <delivery_terms>${escapeXml(p.delivery)}</delivery_terms>\n`;
    if (p.title_en) xml += `    <title lang="en">${escapeXml(p.title_en)}</title>\n`;
    if (p.title_tr) xml += `    <title lang="tr">${escapeXml(p.title_tr)}</title>\n`;
    if (p.desc_en) xml += `    <description lang="en">${escapeXml(p.desc_en)}</description>\n`;
    if (p.desc_tr) xml += `    <description lang="tr">${escapeXml(p.desc_tr)}</description>\n`;
    xml += `    <specifications>\n`;
    if (p.carrier) xml += `      <carrier_class>${escapeXml(p.carrier)}</carrier_class>\n`;
    if (p.width) xml += `      <width_mm>${escapeXml(p.width)}</width_mm>\n`;
    if (p.capacity) xml += `      <capacity_m3>${escapeXml(p.capacity)}</capacity_m3>\n`;
    if (p.material) xml += `      <material>${escapeXml(p.material)}</material>\n`;
    xml += `    </specifications>\n`;
    if (p.images && p.images.length) {
      xml += `    <photos>\n`;
      p.images.forEach(img => { xml += `      <photo>${escapeXml(img)}</photo>\n`; });
      xml += `    </photos>\n`;
    }
    xml += `    <contact>\n      <name>${escapeXml(p.contact)}</name>\n      <phone>${escapeXml(p.phone)}</phone>\n      <email>${escapeXml(p.email)}</email>\n    </contact>\n`;
    xml += '  </ad>\n';
  });
  xml += '</ads>\n';
  return xml;
}

/* ---- AUTOLINE XML ---- */
function exportAutoline(products) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<autoline_export version="2.0">\n  <vehicles>\n';
  products.forEach(p => {
    xml += '    <vehicle>\n';
    xml += `      <ad_id>${escapeXml(p.ref)}</ad_id>\n`;
    xml += `      <type>${escapeXml(p.category)}</type>\n`;
    xml += `      <state>${escapeXml(p.condition)}</state>\n`;
    xml += `      <brand>${escapeXml(p.make)}</brand>\n`;
    xml += `      <model>${escapeXml(p.model)}</model>\n`;
    xml += `      <year_built>${escapeXml(p.year)}</year_built>\n`;
    xml += `      <price>\n        <amount>${escapeXml(p.price)}</amount>\n        <currency>${escapeXml(p.currency)}</currency>\n        <vat>${escapeXml(p.vat)}</vat>\n      </price>\n`;
    if (p.hours) xml += `      <hours_used>${escapeXml(p.hours)}</hours_used>\n`;
    if (p.weight) xml += `      <weight_kg>${escapeXml(p.weight)}</weight_kg>\n`;
    xml += `      <location_city>${escapeXml(p.city)}</location_city>\n`;
    xml += `      <location_country>${escapeXml(p.country)}</location_country>\n`;
    xml += `      <incoterms>${escapeXml((p.delivery || '').toUpperCase())}</incoterms>\n`;
    xml += `      <descriptions>\n`;
    if (p.title_en) xml += `        <text lang="en" type="title">${escapeXml(p.title_en)}</text>\n`;
    if (p.title_tr) xml += `        <text lang="tr" type="title">${escapeXml(p.title_tr)}</text>\n`;
    if (p.desc_en) xml += `        <text lang="en" type="body">${escapeXml(p.desc_en)}</text>\n`;
    if (p.desc_tr) xml += `        <text lang="tr" type="body">${escapeXml(p.desc_tr)}</text>\n`;
    xml += `      </descriptions>\n`;
    xml += `      <tech_params>\n`;
    if (p.carrier) xml += `        <param name="carrier_class">${escapeXml(p.carrier)}</param>\n`;
    if (p.width) xml += `        <param name="width_mm">${escapeXml(p.width)}</param>\n`;
    if (p.capacity) xml += `        <param name="capacity_m3">${escapeXml(p.capacity)}</param>\n`;
    if (p.material) xml += `        <param name="material">${escapeXml(p.material)}</param>\n`;
    xml += `      </tech_params>\n`;
    if (p.images && p.images.length) {
      xml += `      <images>\n`;
      p.images.forEach((img, i) => { xml += `        <image position="${i + 1}">${escapeXml(img)}</image>\n`; });
      xml += `      </images>\n`;
    }
    xml += `      <seller>\n        <name>${escapeXml(p.contact)}</name>\n        <phone>${escapeXml(p.phone)}</phone>\n        <email>${escapeXml(p.email)}</email>\n      </seller>\n`;
    xml += '    </vehicle>\n';
  });
  xml += '  </vehicles>\n</autoline_export>\n';
  return xml;
}

/* ---- MACHINESEEKER XML ---- */
function exportMachineseeker(products) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<machines xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n';
  products.forEach(p => {
    xml += '  <machine>\n';
    xml += `    <vendor_id>${escapeXml(p.ref)}</vendor_id>\n`;
    xml += `    <category>${escapeXml(p.category)}</category>\n`;
    xml += `    <condition>${escapeXml(p.condition)}</condition>\n`;
    xml += `    <manufacturer>${escapeXml(p.make)}</manufacturer>\n`;
    xml += `    <model>${escapeXml(p.model)}</model>\n`;
    xml += `    <year>${escapeXml(p.year)}</year>\n`;
    xml += `    <price>${escapeXml(p.price)}</price>\n`;
    xml += `    <currency>${escapeXml(p.currency)}</currency>\n`;
    xml += `    <price_includes_vat>${p.vat === 'incl' ? 'true' : 'false'}</price_includes_vat>\n`;
    if (p.hours) xml += `    <operating_hours>${escapeXml(p.hours)}</operating_hours>\n`;
    if (p.weight) xml += `    <weight_kg>${escapeXml(p.weight)}</weight_kg>\n`;
    xml += `    <location_city>${escapeXml(p.city)}</location_city>\n`;
    xml += `    <location_country>${escapeXml(p.country)}</location_country>\n`;
    xml += `    <title><![CDATA[${p.title_en || (p.make + ' ' + p.model)}]]></title>\n`;
    let desc = p.desc_en || '';
    const tech = [];
    if (p.carrier) tech.push(`Carrier class: ${p.carrier}`);
    if (p.width) tech.push(`Width: ${p.width} mm`);
    if (p.capacity) tech.push(`Capacity: ${p.capacity} m3`);
    if (p.material) tech.push(`Material: ${p.material}`);
    if (p.delivery) tech.push(`Delivery: ${(p.delivery || '').toUpperCase()}`);
    if (tech.length) desc += '\n\nTechnical:\n' + tech.join('\n');
    xml += `    <description><![CDATA[${desc}]]></description>\n`;
    if (p.images && p.images.length) {
      xml += `    <images>\n`;
      p.images.forEach(img => { xml += `      <image>${escapeXml(img)}</image>\n`; });
      xml += `    </images>\n`;
    }
    xml += `    <seller_contact>${escapeXml(p.contact)}</seller_contact>\n`;
    xml += `    <seller_phone>${escapeXml(p.phone)}</seller_phone>\n`;
    xml += `    <seller_email>${escapeXml(p.email)}</seller_email>\n`;
    xml += '  </machine>\n';
  });
  xml += '</machines>\n';
  return xml;
}

/* ---- RUN ---- */
function main() {
  if (!fs.existsSync(CATALOG)) {
    console.error('ERROR: catalog.json not found at', CATALOG);
    process.exit(1);
  }
  let catalog;
  try {
    catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  } catch (e) {
    console.error('ERROR: catalog.json is not valid JSON:', e.message);
    process.exit(1);
  }
  if (!Array.isArray(catalog)) {
    console.error('ERROR: catalog.json must be a JSON array.');
    process.exit(1);
  }

  // Only publish products explicitly marked active (default: active)
  const live = catalog.filter(p => p.status !== 'draft' && p.status !== 'sold');

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Cloudflare Pages headers: correct MIME + caching + CORS for the feeds
  const headersFile = '/feeds/*\n  Content-Type: application/xml; charset=utf-8\n  Cache-Control: public, max-age=300\n  Access-Control-Allow-Origin: *\n';
  fs.writeFileSync(path.join(ROOT, 'public', '_headers'), headersFile);

  fs.writeFileSync(path.join(OUT_DIR, 'truck1.xml'), exportTruck1(live));
  fs.writeFileSync(path.join(OUT_DIR, 'autoline.xml'), exportAutoline(live));
  fs.writeFileSync(path.join(OUT_DIR, 'machineseeker.xml'), exportMachineseeker(live));

  // Simple index page so the root URL isn't blank
  const indexHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Galen Feeds</title>
<style>body{font-family:system-ui;background:#0A0A0B;color:#EAEAEA;padding:40px;max-width:600px;margin:auto}
a{color:#FF6B00;display:block;margin:8px 0;font-family:monospace}h1{font-weight:600}small{color:#888}</style></head>
<body><h1>Galen Grup Â· Listing Feeds</h1>
<small>Generated ${new Date().toISOString()} Â· ${live.length} active listings</small>
<p>Point each platform's data-import interface to the matching URL:</p>
<a href="/feeds/truck1.xml">/feeds/truck1.xml</a>
<a href="/feeds/autoline.xml">/feeds/autoline.xml</a>
<a href="/feeds/machineseeker.xml">/feeds/machineseeker.xml</a>
</body></html>`;
  fs.writeFileSync(path.join(ROOT, 'public', 'index.html'), indexHtml);

  console.log(`Built feeds for ${live.length} active listings (of ${catalog.length} total).`);
  console.log(' -> public/feeds/truck1.xml');
  console.log(' -> public/feeds/autoline.xml');
  console.log(' -> public/feeds/machineseeker.xml');
}

main();
