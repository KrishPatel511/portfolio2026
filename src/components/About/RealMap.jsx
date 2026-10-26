import React, { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

/* Real, tile-based map (MapLibre GL + CARTO basemap, no API key needed).
   Montréal -> the visitor's location (looked up from their IP address). */

const ORIGIN = [72.5714, 23.0225]; // Ahmedabad, Gujarat, India  [lng, lat]
const NEARBY_KM = 30; // closer than this: no line, just "you're right here"

const STYLE_URL = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
};

const COLORS = {
  dark: { sea: '#10161f', land: '#222c3d', border: '#3a4760', fill: '#27344a', road: '#33415a', line: '#ff1a4f', pin: '#c9ced6' },
  light: { sea: '#b8d9ee', land: '#e6f1f9', border: '#c2d6e6', fill: '#dbe9f4', road: '#cfdeea', line: '#3b3bf0', pin: '#232731' },
};

const distanceKm = ([lng1, lat1], [lng2, lat2]) => {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
};

// Preview helper: open the page with ?visitor=canada (or lat,lng) to see the map as if
// a visitor from there had opened it, e.g. http://localhost:5173/?visitor=canada#about
const PREVIEW_PLACES = {
  canada: [-73.5673, 45.5017],
  montreal: [-73.5673, 45.5017],
  newyork: [-74.006, 40.7128],
  london: [-0.1276, 51.5072],
  dubai: [55.2708, 25.2048],
  mumbai: [72.8777, 19.076],
  delhi: [77.209, 28.6139],
  tokyo: [139.6917, 35.6895],
  sydney: [151.2093, -33.8688],
};

const getPreviewLocation = () => {
  try {
    const raw = new URLSearchParams(window.location.search).get('visitor');
    if (!raw) return undefined;
    const named = PREVIEW_PLACES[raw.toLowerCase().replace(/\s+/g, '')];
    if (named) return named;
    const [lat, lng] = raw.split(',').map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lng, lat];
  } catch { /* ignore */ }
  return undefined;
};

/** Visitor location from their IP address (cached for the session). */
const getVisitorLocation = async () => {
  const preview = getPreviewLocation();
  if (preview) return preview;

  try {
    const cached = sessionStorage.getItem('visitor-location');
    if (cached) return JSON.parse(cached);
  } catch { /* storage unavailable */ }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timer);
    const data = await res.json();
    if (data && data.success && typeof data.longitude === 'number') {
      const loc = [data.longitude, data.latitude];
      try { sessionStorage.setItem('visitor-location', JSON.stringify(loc)); } catch { /* ignore */ }
      return loc;
    }
  } catch { /* offline / blocked */ }
  return null; // lookup failed: we simply don't show the visitor
};

// the line grows from the visitor's pin towards Montréal
const routeData = (from, to, t) => ({
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [from, [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]],
  },
});

const PIN_SVG = (fill) => `
  <svg viewBox="0 0 27 41" width="27" height="41" aria-hidden="true">
    <ellipse cx="13.5" cy="34.8" rx="10.5" ry="5.25" fill="#000" opacity="0.18"/>
    <path fill="${fill}" d="M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z"/>
    <circle fill="#fff" cx="13.5" cy="13.5" r="5.5"/>
  </svg>`;

export const RealMap = ({ isDark, onLocation, onReady }) => {
  const boxRef = useRef(null);
  const live = useRef({ map: null, me: null, meEl: null, pin: null, theme: isDark ? 'dark' : 'light' });

  // create the map once
  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let readyTimer = 0;
    let observer;
    const timers = [];
    let resizeObserver;
    const state = live.current;

    (async () => {
      const [mod, dest] = await Promise.all([import('maplibre-gl'), getVisitorLocation()]);
      const maplibregl = mod.Map ? mod : mod.default;
      if (maplibregl.getWorkerUrl && !maplibregl.getWorkerUrl()) maplibregl.setWorkerUrl(workerUrl);
      else if (maplibregl.setWorkerUrl) maplibregl.setWorkerUrl(workerUrl);
      if (cancelled || !boxRef.current) return;
      const distance = dest ? distanceKm(ORIGIN, dest) : null;
      const hasRoute = !!dest && distance >= NEARBY_KM;
      if (onLocation) onLocation(dest, distance);

      let map;
      try {
        map = new maplibregl.Map({
          container: boxRef.current,
          style: STYLE_URL[state.theme],
          interactive: false,
          attributionControl: { compact: true },
          fadeDuration: 0,
          center: hasRoute ? dest : ORIGIN,
          zoom: hasRoute ? 9 : 5,
        });
      } catch {
        return; // WebGL unavailable: the drawn fallback map stays visible
      }
      state.map = map;

      // markers
      const meEl = document.createElement('div');
      meEl.className = 'ab-mk-me';
      const meImg = document.createElement('img');
      meImg.alt = 'A marker showing where I live on the map';
      meImg.src = `/images/josh/josh-happy-${state.theme}.png`;
      meEl.appendChild(meImg);
      state.me = meImg;

      const pinEl = document.createElement('div');
      pinEl.className = 'ab-mk-pin';
      pinEl.innerHTML = PIN_SVG(COLORS[state.theme].pin);
      state.pin = pinEl;

      new maplibregl.Marker({ element: meEl, anchor: 'bottom', offset: [0, 6] }).setLngLat(ORIGIN).addTo(map);
      state.meEl = meEl;
      if (hasRoute) new maplibregl.Marker({ element: pinEl, anchor: 'bottom' }).setLngLat(dest).addTo(map);
      else meEl.classList.add('show'); // nothing to animate: just show where Josh is

      let progress = 0;
      let animationStarted = false;

      const drawRoute = () => {
        const src = map.getSource('route');
        if (src) src.setData(routeData(dest, ORIGIN, progress));
      };

      const applyStyle = () => {
        const c = COLORS[state.theme];
        map.getStyle().layers.forEach((layer) => {
          const { id, type } = layer;
          if (type === 'background') {
            map.setPaintProperty(id, 'background-color', c.land);
          } else if (type === 'fill' && id === 'water') {
            map.setPaintProperty(id, 'fill-color', c.sea);
          } else if (type === 'line' && id.startsWith('boundary_country')) {
            map.setPaintProperty(id, 'line-color', c.border);
            map.setPaintProperty(id, 'line-opacity', 1);
            map.setPaintProperty(id, 'line-width', 0.9);
          } else if (type === 'fill' && id !== 'water_shadow') {
            map.setPaintProperty(id, 'fill-color', c.fill);
            map.setPaintProperty(id, 'fill-opacity', 0.55);
          } else if (type === 'line' && !id.startsWith('boundary')) {
            map.setPaintProperty(id, 'line-color', c.road);
            map.setPaintProperty(id, 'line-opacity', 0.7);
          } else {
            map.setLayoutProperty(id, 'visibility', 'none');
          }
        });

        if (!hasRoute) return;
        map.addSource('route', { type: 'geojson', data: routeData(dest, ORIGIN, progress) });
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': c.line, 'line-width': 3, 'line-dasharray': [0, 2.4] },
        });
      };

      // zoom out from the visitor's city, reveal Josh, then draw the line towards Ahmedabad
      const playIntro = () => {
        if (animationStarted || !hasRoute) return;
        animationStarted = true;
        map.fitBounds(
          [
            [Math.min(ORIGIN[0], dest[0]), Math.min(ORIGIN[1], dest[1])],
            [Math.max(ORIGIN[0], dest[0]), Math.max(ORIGIN[1], dest[1])],
          ],
          {
            padding: { top: 104, bottom: 40, left: 44, right: 44 },
            maxZoom: 6,
            duration: 3600,
            easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
            essential: true,
          },
        );
        timers.push(window.setTimeout(() => state.meEl && state.meEl.classList.add('show'), 2700));
        timers.push(window.setTimeout(() => {
          const startAt = performance.now();
          const step = (now) => {
            const t = Math.min(1, (now - startAt) / 1800);
            progress = 1 - (1 - t) ** 3;
            drawRoute();
            if (t < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }, 2900));
      };

      let isIdle = false;
      let isSeen = false;
      const maybePlay = () => {
        if (isIdle && isSeen) timers.push(window.setTimeout(playIntro, 600));
      };

      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { isSeen = true; observer.disconnect(); maybePlay(); }
      }, { threshold: 0.4 });
      observer.observe(boxRef.current);

      map.on('style.load', applyStyle);
      map.once('load', () => {
        // keep the attribution tucked behind its (i) button, like a compact map
        const attrib = boxRef.current && boxRef.current.querySelector('.maplibregl-ctrl-attrib');
        if (attrib) {
          attrib.classList.remove('maplibregl-compact-show');
          attrib.removeAttribute('open');
        }
      });
      map.once('idle', () => { isIdle = true; if (onReady) onReady(); maybePlay(); });
      readyTimer = window.setTimeout(() => { if (onReady) onReady(); }, 7000);

      resizeObserver = new ResizeObserver(() => map.resize());
      resizeObserver.observe(boxRef.current);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(readyTimer);
      timers.forEach(clearTimeout);
      if (observer) observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      if (state.map) { state.map.remove(); state.map = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // follow the site theme
  useEffect(() => {
    const state = live.current;
    const theme = isDark ? 'dark' : 'light';
    if (state.theme === theme) return;
    state.theme = theme;
    if (state.me) state.me.src = `/images/josh/josh-happy-${theme}.png`;
    if (state.pin) state.pin.innerHTML = PIN_SVG(COLORS[theme].pin);
    if (state.map) {
      // The new style loads from scratch (diff: false), which would flash the canvas blank.
      // Dip the map softly instead and bring it back once the new tiles are drawn.
      const box = boxRef.current;
      const map = state.map;
      if (box) { box.style.transition = 'opacity 350ms ease'; box.style.opacity = '0.35'; }
      const restore = () => {
        if (!box) return;
        box.style.opacity = '';
        setTimeout(() => { box.style.transition = ''; }, 400);
      };
      map.once('idle', restore);
      setTimeout(restore, 3000);
      map.setStyle(STYLE_URL[theme], { diff: false });
    }
  }, [isDark]);

  return <div ref={boxRef} className="ab-map-gl" />;
};
