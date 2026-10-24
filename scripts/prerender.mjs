/* Build step: turns every route into its own static HTML file with the right <title>,
   meta tags, canonical link, JSON-LD and the page content, so search engines and link previews
   get real content straight away. Also writes sitemap.xml.

   Run after `vite build` and `vite build --ssr` (see the "build" script in package.json). */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');

const { render } = await import(pathToFileURL(join(root, '.ssr', 'entry-server.js')).href);
const { ROUTES, NOT_FOUND, SITE_URL, OG_IMAGE, SITE_NAME, canonicalFor } = await import(
  pathToFileURL(join(root, 'src', 'seo', 'routes.js')).href
);

const template = await readFile(join(dist, 'index.html'), 'utf8');

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeText = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const jsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

function headFor(path, seo) {
  const url = canonicalFor(path);
  const tags = [
    `<title>${escapeText(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`,
    ...(seo.noindex ? [] : [`<link rel="canonical" href="${url}" />`]),
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="${path === '/' ? 'profile' : 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    ...seo.schema.map((data) => `<script type="application/ld+json" data-seo-schema="true">${jsonLd(data)}</script>`),
  ];
  return tags.join('\n    ');
}

function buildHtml(path, seo) {
  const html = render(path);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('</head>', `    ${headFor(path, seo)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

async function write(file, content) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}

for (const [path, seo] of Object.entries(ROUTES)) {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html');
  await write(file, buildHtml(path, seo));
  console.log('prerendered', path);
}

// Shown (with a real 404 status) for any address that is not a page
await write(join(dist, '404.html'), buildHtml('/404', NOT_FOUND));

const today = new Date().toISOString().slice(0, 10);
const urls = Object.entries(ROUTES)
  .map(
    ([path, seo]) =>
      `  <url>\n    <loc>${canonicalFor(path)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${seo.priority}</priority>\n  </url>`
  )
  .join('\n');
await write(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
console.log(`sitemap.xml written for ${SITE_URL}`);
