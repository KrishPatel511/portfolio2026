import { useSyncExternalStore } from 'react';

/* A tiny History API router. The store holds the current "path#hash" string so React can
   subscribe to it, and it works on the server too (see entry-server.jsx). */

const isClient = typeof window !== 'undefined';

export const normalizePath = (value) => {
  const clean = (value || '/').split(/[?#]/)[0].replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
};

let key = isClient ? normalizePath(window.location.pathname) + window.location.hash : '/';
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getKey = () => key;

export const setServerPath = (value) => {
  key = normalizePath(value);
};

/* Returns the current "path#hash"; use splitLocation() to read the parts. */
export const useLocationKey = () => useSyncExternalStore(subscribe, getKey, getKey);

export const splitLocation = (value) => {
  const index = value.indexOf('#');
  return index === -1
    ? { path: normalizePath(value), hash: '' }
    : { path: normalizePath(value.slice(0, index)), hash: value.slice(index) };
};

export const usePath = () => splitLocation(useLocationKey()).path;

export function navigate(to, { replace = false } = {}) {
  const url = new URL(to, window.location.origin);
  const path = normalizePath(url.pathname);
  const next = path + url.search + url.hash;
  window.history[replace ? 'replaceState' : 'pushState'](null, '', next);
  key = path + url.hash;
  emit();
  window.dispatchEvent(new Event('routechange'));
}

/* Old links used #hashes (e.g. /#projects). Send them to the new real URLs. */
const LEGACY_HASHES = {
  about: '/',
  projects: '/projects',
  experience: '/experience',
  skills: '/skills',
  contact: '/contact',
  gmdc: '/projects/gmdc',
  reposentry: '/projects/reposentry',
  waldor: '/projects/auralyx',
  emberleaf: '/projects/emberleaf',
  portfolio: '/projects/portfolio',
  education: '/experience#education',
  certifications: '/experience#certifications',
};

export function initRouter(isKnownPath) {
  if (!isClient) return;

  const legacy = LEGACY_HASHES[window.location.hash.replace('#', '')];
  if (legacy && normalizePath(window.location.pathname) === '/') {
    window.history.replaceState(null, '', legacy);
    key = normalizePath(legacy) + (legacy.includes('#') ? legacy.slice(legacy.indexOf('#')) : '');
  }

  window.addEventListener('popstate', () => {
    key = normalizePath(window.location.pathname) + window.location.hash;
    emit();
  });

  // Turn clicks on internal links into client-side navigation
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !isKnownPath(normalizePath(url.pathname))) return;
    event.preventDefault();
    navigate(url.pathname + url.hash);
  });
}
