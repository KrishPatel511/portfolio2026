import { lazy, Suspense, useEffect, useState } from 'react';

const SplashCursor = lazy(() => import('./SplashCursor'));

/* The WebGL fluid is decoration, so its code is downloaded and started only after the page has
   painted and the browser is idle. Content and text never wait for it. */
export default function LazySplashCursor(props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => setReady(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 600);
    return () => clearTimeout(id);
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <SplashCursor {...props} />
    </Suspense>
  );
}
