import { useCallback, useEffect, useRef } from 'react';
import { soundFx } from '../utils/soundEffects';

/* A small, dependency-free take on Josh's `use-sound`.

   const [play, { stop }] = useSound(source, { volume, playbackRate });

   `source` is either
     - a URL to an audio file (fetched + decoded once, then cached), or
     - a function (ctx, { volume, playbackRate }) that plays a synthesized sound.

   It honours the site-wide sound toggle (soundFx.enabled). */

const bufferCache = new Map();

const loadBuffer = (ctx, url) => {
  if (!bufferCache.has(url)) {
    bufferCache.set(
      url,
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data)),
    );
  }
  return bufferCache.get(url);
};

export const useSound = (source, { volume = 1, playbackRate = 1 } = {}) => {
  const settings = useRef({ volume, playbackRate });
  const playing = useRef(new Set());

  useEffect(() => {
    settings.current = { volume, playbackRate };
  }, [volume, playbackRate]);

  const play = useCallback((override = {}) => {
    if (!soundFx.enabled) return;
    const ctx = soundFx.getAudioContext();
    if (!ctx) return;
    const options = { ...settings.current, ...override };

    if (typeof source === 'function') {
      source(ctx, options);
      return;
    }

    loadBuffer(ctx, source).then((buffer) => {
      const node = ctx.createBufferSource();
      node.buffer = buffer;
      node.playbackRate.value = options.playbackRate;
      const gain = ctx.createGain();
      gain.gain.value = options.volume;
      node.connect(gain).connect(ctx.destination);
      node.onended = () => playing.current.delete(node);
      playing.current.add(node);
      node.start();
    });
  }, [source]);

  const stop = useCallback(() => {
    playing.current.forEach((node) => {
      try { node.stop(); } catch { /* already stopped */ }
    });
    playing.current.clear();
  }, []);

  return [play, { stop }];
};
