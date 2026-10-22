/* Tiny synthesized drum kit (Web Audio) used by the QWER pads.
   Every voice has the signature (ctx, { volume, playbackRate }) so it can be
   passed straight to the `useSound` hook, just like an audio file URL. */

const noiseBuffer = (ctx, seconds) => {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
};

const burst = (ctx, { seconds, gain, highpass, rate = 1 }) => {
  const now = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, seconds);
  src.playbackRate.value = rate;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = highpass;
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.001, now + seconds);
  src.connect(filter).connect(amp).connect(ctx.destination);
  src.start(now);
};

const tone = (ctx, { type, from, to, seconds, gain, rate = 1 }) => {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from * rate, now);
  if (to) osc.frequency.exponentialRampToValueAtTime(to * rate, now + seconds);
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.001, now + seconds);
  osc.connect(amp).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + seconds);
};

export const kick = (ctx, { volume = 1, playbackRate = 1 } = {}) =>
  tone(ctx, { type: 'sine', from: 150, to: 40, seconds: 0.28, gain: 0.9 * volume, rate: playbackRate });

export const hihat = (ctx, { volume = 1, playbackRate = 1 } = {}) =>
  burst(ctx, { seconds: 0.07, gain: 0.32 * volume, highpass: 7000, rate: playbackRate });

export const snare = (ctx, { volume = 1, playbackRate = 1 } = {}) => {
  burst(ctx, { seconds: 0.16, gain: 0.5 * volume, highpass: 1500, rate: playbackRate });
  tone(ctx, { type: 'triangle', from: 200, to: 120, seconds: 0.1, gain: 0.3 * volume, rate: playbackRate });
};

export const cowbell = (ctx, { volume = 1, playbackRate = 1 } = {}) => {
  tone(ctx, { type: 'square', from: 587, seconds: 0.35, gain: 0.14 * volume, rate: playbackRate });
  tone(ctx, { type: 'square', from: 845, seconds: 0.35, gain: 0.14 * volume, rate: playbackRate });
};
