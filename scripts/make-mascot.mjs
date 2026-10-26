/* Draws the site's mascot as SVG files. Run with: node scripts/make-mascot.mjs
   It is an original character: a friendly developer with curly hair, round teal glasses, coral
   headphones and an indigo hoodie, sitting with a laptop. Every size matches the old 275 x 464 artwork box,
   so the layouts around it do not need to change.

   Output (public/images/krish/):
     krish-light.svg, krish-dark.svg           the whole character
     krish-happy-light.svg, krish-happy-dark.svg   just the head, with a big laugh (laid over the first one on click) */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'krish');

const THEMES = {
  light: { hoodTop: '#6366f1', hoodBottom: '#4338ca', hoodDark: '#3730a3', pants: ['#cbd5e1', '#94a3b8'], shadow: 'rgba(15,23,42,.14)' },
  dark: { hoodTop: '#818cf8', hoodBottom: '#5b5bd6', hoodDark: '#4338ca', pants: ['#64748b', '#475569'], shadow: 'rgba(0,0,0,.35)' },
};

const defs = (t) => `
  <defs>
    <linearGradient id="hood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.hoodTop}"/><stop offset="1" stop-color="${t.hoodBottom}"/></linearGradient>
    <linearGradient id="pants" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.pants[0]}"/><stop offset="1" stop-color="${t.pants[1]}"/></linearGradient>
    <linearGradient id="lap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset="1" stop-color="#94a3b8"/></linearGradient>
    <radialGradient id="skin" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#eebb8c"/><stop offset="1" stop-color="#c88655"/></radialGradient>
    <linearGradient id="cup" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fb7185"/><stop offset="1" stop-color="#e11d48"/></linearGradient>
  </defs>`;

const HAIR = '#1f1b33';

/* hair behind the face */
const hairBack = `
  <g fill="${HAIR}">
    <circle cx="98" cy="96" r="21"/><circle cx="127" cy="80" r="24"/><circle cx="160" cy="82" r="24"/>
    <circle cx="185" cy="100" r="20"/><circle cx="80" cy="122" r="16"/><circle cx="196" cy="124" r="16"/>
  </g>`;

/* fringe over the forehead */
const fringe = `<path fill="${HAIR}" d="M80 132 C88 100 116 92 137 98 C160 92 188 104 196 132 C178 114 158 110 137 112 C116 110 98 114 80 132 Z"/>`;

/* the headphones: a band over the hair and a cup on each ear */
const headphones = `
  <path d="M68 142 C64 66 210 66 206 142" fill="none" stroke="url(#cup)" stroke-width="9" stroke-linecap="round"/>
  <rect x="56" y="126" width="24" height="44" rx="12" fill="url(#cup)"/><rect x="195" y="126" width="24" height="44" rx="12" fill="url(#cup)"/>
  <rect x="62" y="134" width="8" height="28" rx="4" fill="#fff" opacity=".28"/><rect x="205" y="134" width="8" height="28" rx="4" fill="#fff" opacity=".28"/>`;

const headBase = `
  <circle cx="75" cy="152" r="11" fill="url(#skin)"/><circle cx="200" cy="152" r="11" fill="url(#skin)"/>
  <ellipse cx="137.5" cy="148" rx="64" ry="62" fill="url(#skin)"/>`;

const cheeks = `<circle cx="92" cy="178" r="11" fill="#fb7185" opacity=".38"/><circle cx="183" cy="178" r="11" fill="#fb7185" opacity=".38"/>`;
const brows = `
  <path d="M97 126 Q112 117 127 124" stroke="${HAIR}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="M148 124 Q163 117 178 126" stroke="${HAIR}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
const glasses = `
  <circle cx="112" cy="152" r="19" fill="#fff" fill-opacity=".3" stroke="#14b8a6" stroke-width="4.5"/>
  <circle cx="163" cy="152" r="19" fill="#fff" fill-opacity=".3" stroke="#14b8a6" stroke-width="4.5"/>
  <path d="M130 150 Q137.5 143 145 150" stroke="#14b8a6" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
const nose = `<path d="M137.5 160 Q132 171 140 172" stroke="#a8683a" stroke-width="3" fill="none" stroke-linecap="round"/>`;

const eyesOpen = `
  <ellipse cx="113" cy="153" rx="5.5" ry="7.5" fill="${HAIR}"/><ellipse cx="164" cy="153" rx="5.5" ry="7.5" fill="${HAIR}"/>
  <circle cx="115" cy="150" r="2" fill="#fff"/><circle cx="166" cy="150" r="2" fill="#fff"/>`;
const eyesJoy = `
  <path d="M103 156 Q113 143 123 156" stroke="${HAIR}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M154 156 Q164 143 174 156" stroke="${HAIR}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
const smile = `<path d="M118 182 Q137.5 206 157 182 Z" fill="#9f1239"/><path d="M123 183 Q137.5 194 152 183 Z" fill="#fff"/>`;
const laugh = `<path d="M112 180 Q137.5 218 163 180 Z" fill="#9f1239"/><path d="M118 181 Q137.5 197 157 181 Z" fill="#fff"/><path d="M127 202 Q137.5 195 148 202 Q137.5 212 127 202 Z" fill="#fb7185"/>`;

const head = (happy) =>
  `${hairBack}${headBase}${cheeks}${nose}${glasses}${happy ? eyesJoy : eyesOpen}${brows}${happy ? laugh : smile}${fringe}${headphones}`;

const body = (t) => `
  <ellipse cx="137.5" cy="436" rx="100" ry="10" fill="${t.shadow}"/>
  <!-- legs, crossed -->
  <path d="M60 376 C58 340 102 320 138 326 L138 404 C108 412 66 408 60 376Z" fill="url(#pants)"/>
  <path d="M215 376 C217 340 173 320 137 326 L137 404 C167 412 209 408 215 376Z" fill="url(#pants)"/>
  <path d="M64 372 C90 392 112 396 138 392" stroke="#64748b" stroke-opacity=".35" stroke-width="3" fill="none"/>
  <path d="M211 372 C185 392 163 396 137 392" stroke="#64748b" stroke-opacity=".35" stroke-width="3" fill="none"/>
  <!-- shoes -->
  <ellipse cx="82" cy="410" rx="30" ry="16" fill="#fff"/><path d="M52 414 Q82 432 112 414 L112 420 Q82 440 52 420Z" fill="#14b8a6"/>
  <ellipse cx="193" cy="410" rx="30" ry="16" fill="#fff"/><path d="M163 414 Q193 432 223 414 L223 420 Q193 440 163 420Z" fill="#14b8a6"/>
  <path d="M66 404 Q82 396 98 404" stroke="#cbd5e1" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M177 404 Q193 396 209 404" stroke="#cbd5e1" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- hoodie -->
  <path d="M70 236 C70 212 100 204 137.5 204 C175 204 205 212 205 236 L214 332 C214 346 196 356 137.5 356 C79 356 61 346 61 332 Z" fill="url(#hood)"/>
  <ellipse cx="137.5" cy="214" rx="54" ry="22" fill="${t.hoodDark}"/>
  <rect x="100" y="292" width="75" height="36" rx="12" fill="${t.hoodDark}" opacity=".35"/>
  <path d="M123 224 L121 266" stroke="#f8fafc" stroke-width="4.5" stroke-linecap="round"/><path d="M152 224 L154 266" stroke="#f8fafc" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="121" cy="268" r="4" fill="#f8fafc"/><circle cx="154" cy="268" r="4" fill="#f8fafc"/>
  <!-- neck -->
  <rect x="121" y="188" width="33" height="32" rx="12" fill="#c07d4d"/>
  <!-- laptop on the lap -->
  <rect x="86" y="296" width="103" height="62" rx="9" fill="url(#lap)" stroke="#64748b" stroke-width="2.5"/>
  <path d="M121 316 l-10 10 10 10 M154 316 l10 10 -10 10 M143 313 l-7 26" stroke="#4f46e5" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="82" y="356" width="111" height="7" rx="3.5" fill="#94a3b8"/>
  <!-- arms and hands resting on the laptop -->
  <path d="M72 238 C46 268 50 312 80 330 L102 316 C88 298 88 272 98 252 Z" fill="${t.hoodBottom}"/>
  <path d="M203 238 C229 268 225 312 195 330 L173 316 C187 298 187 272 177 252 Z" fill="${t.hoodBottom}"/>
  <circle cx="93" cy="326" r="13" fill="url(#skin)"/><circle cx="182" cy="326" r="13" fill="url(#skin)"/>`;

const sparkle = `<path d="M232 84 L236 96 L248 100 L236 104 L232 116 L228 104 L216 100 L228 96Z" fill="#fbbf24"/><path d="M40 118 L43 126 L51 129 L43 132 L40 140 L37 132 L29 129 L37 126Z" fill="#38bdf8"/>`;

const svg = (inner, t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 275 464" width="275" height="464" fill="none">${defs(t)}${inner}</svg>\n`;

await mkdir(out, { recursive: true });
for (const [name, t] of Object.entries(THEMES)) {
  await writeFile(join(out, `krish-${name}.svg`), svg(`${body(t)}${head(false)}${sparkle}`, t));
  await writeFile(join(out, `krish-happy-${name}.svg`), svg(head(true), t));
}
console.log('wrote mascot files to', out);
