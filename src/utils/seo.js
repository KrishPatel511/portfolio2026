import { useEffect } from 'react';
import { OG_IMAGE, SITE_NAME, SITE_URL, canonicalFor, getSeo } from '../seo/routes';

/* Keeps <title>, meta tags, canonical and JSON-LD in sync while the visitor navigates.
   (At build time the same data is written into each page's HTML by scripts/prerender.mjs.) */

const upsert = (selector, create, apply) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
};

const meta = (attr, name, content) =>
  upsert(
    `meta[${attr}="${name}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute(attr, name);
      return el;
    },
    (el) => el.setAttribute('content', content)
  );

export const applySeo = (path) => {
  const seo = getSeo(path);
  const url = canonicalFor(path);

  document.title = seo.title;
  meta('name', 'description', seo.description);
  meta('name', 'robots', seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
  meta('property', 'og:title', seo.title);
  meta('property', 'og:description', seo.description);
  meta('property', 'og:url', url);
  meta('property', 'og:type', path === '/' ? 'profile' : 'website');
  meta('property', 'og:site_name', SITE_NAME);
  meta('property', 'og:image', OG_IMAGE);
  meta('name', 'twitter:card', 'summary_large_image');
  meta('name', 'twitter:title', seo.title);
  meta('name', 'twitter:description', seo.description);
  meta('name', 'twitter:image', OG_IMAGE);

  if (seo.noindex) {
    document.head.querySelector('link[rel="canonical"]')?.remove();
  } else {
    upsert(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        return el;
      },
      (el) => el.setAttribute('href', url)
    );
  }

  document.head.querySelectorAll('script[data-seo-schema]').forEach((el) => el.remove());
  seo.schema.forEach((data) => {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.dataset.seoSchema = 'true';
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
  });
};

export const useSeo = (path) => {
  useEffect(() => {
    applySeo(path);
  }, [path]);
};

export { SITE_URL };
