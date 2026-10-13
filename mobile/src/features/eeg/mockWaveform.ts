/**
 * MOCK waveform generation.
 *
 * These traces are synthesised in-app for interface demonstration only.
 * They are NOT recordings: no file was read, no patient exists, and nothing
 * here is clinical data. The generator is deterministic (seeded) so the UI
 * looks the same on every launch.
 *
 * Signal character: slow neonatal background activity with low-amplitude
 * faster components and a little measurement noise. No seizure-like patterns
 * are generated on purpose — this app must never appear to display one.
 */

/** Mulberry32 — tiny deterministic PRNG. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface MockTraceOptions {
  /** Any integer; identical seeds produce identical traces. */
  seed: number;
  sampleRateHz: number;
  durationSeconds: number;
}

/**
 * Generates one fictional trace in microvolts (µV).
 * Typical amplitude range ≈ ±90 µV.
 */
export function generateMockTrace({ seed, sampleRateHz, durationSeconds }: MockTraceOptions): number[] {
  const random = createRandom(seed);
  const count = Math.max(8, Math.round(sampleRateHz * durationSeconds));
  const samples = new Array<number>(count);

  // Per-channel character, still deterministic.
  const slowFrequency = 1.2 + random() * 1.4; // 1.2–2.6 Hz dominant rhythm
  const slowAmplitude = 35 + random() * 25; // µV
  const fastAmplitude = 5 + random() * 7; // µV
  const baseline = (random() - 0.5) * 12;

  let noiseState = 0; // one-pole low-pass on white noise → pink-ish noise
  for (let i = 0; i < count; i += 1) {
    const t = i / sampleRateHz;

    const slow =
      slowAmplitude *
      (Math.sin(2 * Math.PI * slowFrequency * t) +
        0.45 * Math.sin(2 * Math.PI * (slowFrequency * 0.5 + 0.2) * t + 1.1));

    const fast =
      fastAmplitude * Math.sin(2 * Math.PI * 9 * t + 0.7 * Math.sin(2 * Math.PI * 0.4 * t));

    const white = random() * 2 - 1;
    noiseState = noiseState * 0.82 + white * 0.18;
    const noise = noiseState * 9;

    // Gentle amplitude modulation so the trace breathes like real background.
    const modulation = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.07 * t);

    samples[i] = slow * modulation + fast + noise + baseline;
  }

  return samples;
}

/** Deterministic seed derived from a channel name + recording id. */
export function seedFor(recordingId: number, channelName: string): number {
  let hash = recordingId * 31;
  for (let i = 0; i < channelName.length; i += 1) {
    hash = (hash * 33 + channelName.charCodeAt(i)) >>> 0;
  }
  return hash;
}
