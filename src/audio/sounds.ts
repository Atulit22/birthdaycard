import type { Synth } from './synth'

// The site's sound language. Loudness hierarchy (peak amplitude before the master bus):
//   interface ≈ .1–.2 · discovery ≈ .2–.3 · finale ≈ .3–.4 · ambience ≈ .05–.1 (see AudioManager)

export interface PlayOpts {
  /** e.g. which Easter egg, so different eggs get slightly different melodies */
  variant?: number
}

interface SoundDef {
  /** minimum ms between two plays of this sound */
  cooldown: number
  /** skipped when the visitor prefers reduced motion (sweeps, risers, rumbles) */
  motion?: boolean
  /** always allowed through the voice limit */
  important?: boolean
  /** ms during which a repeat is ignored (so a long melody can never overlap itself) */
  lock?: number
  /** quiet the ambience while it plays */
  duck?: boolean
  play: (s: Synth, t: number, o: PlayOpts) => void
}

const PENTA = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2] // major pentatonic ratios
const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]

let lastCat = -1

function sparkle(s: Synth, t: number, root = 1046.5, n = 4, gain = 0.08) {
  const start = Math.floor(Math.random() * 2)
  for (let i = 0; i < n; i++) {
    const f = root * PENTA[Math.min(start + i + (Math.random() < 0.3 ? 1 : 0), PENTA.length - 1)]
    s.tone({ f, t: t + i * 0.065, dur: 0.4, gain })
    s.tone({ f: f * 2, t: t + i * 0.065, dur: 0.2, gain: gain * 0.3 })
  }
}

function whoosh(s: Synth, t: number, gain: number, dur: number, f0 = 250, f1 = 2200) {
  s.noise({ t, dur, gain, type: 'bandpass', f: f0, f2: f1, q: 0.8, attack: dur * 0.4 })
}

function meow(s: Synth, t: number, pitch: number, dur: number, gain: number) {
  const ctx = s.ctx
  const o = ctx.createOscillator()
  const bp = ctx.createBiquadFilter()
  const g = ctx.createGain()
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(480 * pitch, t)
  o.frequency.exponentialRampToValueAtTime(860 * pitch, t + dur * 0.3)
  o.frequency.exponentialRampToValueAtTime(520 * pitch, t + dur)
  bp.type = 'bandpass'
  bp.Q.value = 3.5
  bp.frequency.setValueAtTime(900, t)
  bp.frequency.exponentialRampToValueAtTime(1700, t + dur * 0.35)
  bp.frequency.exponentialRampToValueAtTime(1000, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(gain, t + dur * 0.2)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(bp).connect(g).connect(s.out)
  o.start(t)
  o.stop(t + dur + 0.05)
  o.onended = () => {
    o.disconnect()
    bp.disconnect()
    g.disconnect()
  }
}

const chirp = (s: Synth, t: number, gain = 0.09) => {
  const p = rnd(0.9, 1.15)
  s.tone({ f: 700 * p, f2: 1500 * p, t, dur: 0.08, gain })
  s.tone({ f: 800 * p, f2: 1700 * p, t: t + 0.11, dur: 0.09, gain: gain * 0.9 })
}
const squeak = (s: Synth, t: number) => s.tone({ f: rnd(950, 1100), f2: rnd(1500, 1800), t, dur: 0.1, gain: 0.07, attack: 0.01 })
const pawTap = (s: Synth, t: number) => {
  s.tone({ f: 190, f2: 70, t, dur: 0.1, gain: 0.2 })
  s.noise({ t, dur: 0.04, gain: 0.04, type: 'lowpass', f: 900 })
}

export const SOUNDS = {
  // ——— interface ———
  tap: { cooldown: 60, play: (s, t) => s.tone({ f: 520, f2: 380, type: 'triangle', t, dur: 0.07, gain: 0.13 }) },
  toggle: { cooldown: 120, play: (s, t) => s.tone({ f: 740, f2: 990, t, dur: 0.07, gain: 0.1 }) },
  pop: {
    cooldown: 90,
    play: (s, t) => {
      s.tone({ f: rnd(340, 400), f2: rnd(700, 800), t, dur: 0.12, gain: 0.17 })
      s.noise({ t, dur: 0.03, gain: 0.03, type: 'highpass', f: 3000 })
    },
  },
  sparkle: { cooldown: 140, play: (s, t) => sparkle(s, t) },
  confettiPop: {
    cooldown: 200,
    play: (s, t) => {
      s.noise({ t, dur: 0.05, gain: 0.09, type: 'bandpass', f: 2500, q: 1.2 })
      sparkle(s, t + 0.03, 1318.5, 3, 0.05)
    },
  },
  whoosh: { cooldown: 250, motion: true, play: (s, t) => whoosh(s, t, 0.15, 0.65) },
  whooshSoft: { cooldown: 250, motion: true, play: (s, t) => whoosh(s, t, 0.07, 0.5, 200, 1200) },

  // ——— paper ———
  paperFlip: {
    cooldown: 120,
    play: (s, t) => {
      s.noise({ t, dur: 0.08, gain: 0.11, type: 'highpass', f: rnd(1600, 2200), q: 0.6 })
      s.noise({ t: t + 0.05, dur: 0.13, gain: 0.05, type: 'bandpass', f: rnd(3000, 4200), q: 0.8 })
    },
  },
  paperRustle: {
    cooldown: 300,
    play: (s, t) => {
      for (let i = 0; i < 4; i++) s.noise({ t: t + i * rnd(0.05, 0.1), dur: 0.06, gain: 0.05, type: 'highpass', f: rnd(2200, 3200) })
    },
  },
  shutter: {
    cooldown: 300,
    play: (s, t) => {
      s.noise({ t, dur: 0.025, gain: 0.12, type: 'bandpass', f: 4000, q: 1.5 })
      s.noise({ t: t + 0.07, dur: 0.03, gain: 0.1, type: 'bandpass', f: 3200, q: 1.5 })
      s.tone({ f: 180, t, dur: 0.04, gain: 0.07 })
    },
  },
  envelope: {
    cooldown: 400,
    play: (s, t) => {
      for (let i = 0; i < 3; i++) s.noise({ t: t + i * 0.07, dur: 0.07, gain: 0.07, type: 'highpass', f: 2400 })
      s.bell(1046.5, t + 0.25, 0.08, 1.2)
    },
  },

  // ——— the cat ———
  catPoke: {
    cooldown: 380,
    play: (s, t) => {
      let i = Math.floor(Math.random() * 4)
      if (i === lastCat) i = (i + 1) % 4
      lastCat = i
      if (i === 0) pawTap(s, t)
      else if (i === 1) meow(s, t, rnd(0.95, 1.25), 0.32, 0.07)
      else if (i === 2) chirp(s, t)
      else squeak(s, t)
    },
  },
  catMeow: { cooldown: 500, play: (s, t) => meow(s, t, rnd(0.8, 0.9), 0.55, 0.09) },
  catPeek: {
    cooldown: 900,
    play: (s, t) => {
      s.tone({ f: 420, f2: 640, t, dur: 0.09, gain: 0.07 })
      if (Math.random() < 0.5) chirp(s, t + 0.1, 0.05)
      else s.bell(2100, t + 0.1, 0.03, 0.4)
    },
  },

  // ——— discovery ———
  discover: {
    cooldown: 250,
    important: true,
    play: (s, t, o) => {
      const root = [784, 880, 988, 1174.7][(o.variant ?? 0) % 4]
      const shape = [
        [0, 1, 2, 3],
        [0, 2, 1, 3],
        [0, 1, 3, 4],
      ][Math.floor((o.variant ?? 0) / 4) % 3]
      shape.forEach((n, i) => s.tone({ f: root * PENTA[n], t: t + i * 0.08, dur: 0.6, gain: 0.17 }))
      s.bell(root * 2, t + 0.34, 0.1, 1.5)
      s.noise({ t: t + 0.1, dur: 0.6, gain: 0.015, type: 'highpass', f: 7000 })
    },
  },
  success: {
    cooldown: 400,
    important: true,
    play: (s, t) => [523.25, 659.25, 783.99].forEach((f, i) => s.tone({ f, t: t + i * 0.09, dur: 0.9, gain: 0.12 })),
  },
  gateOpen: {
    cooldown: 800,
    important: true,
    play: (s, t) => {
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => s.bell(f, t + i * 0.13, 0.1, 1.8))
    },
  },
  blow: {
    cooldown: 600,
    play: (s, t) => s.noise({ t, dur: 0.7, gain: 0.12, type: 'lowpass', f: 1400, f2: 300, attack: 0.1 }),
  },

  // ——— the party ———
  cheer: {
    cooldown: 1500,
    important: true,
    play: (s, t) => {
      s.noise({ t, dur: 1.4, gain: 0.13, type: 'bandpass', f: 500, f2: 1300, q: 0.5, attack: 0.5 })
      s.noise({ t: t + 0.1, dur: 1.1, gain: 0.05, type: 'bandpass', f: 2200, q: 0.8, attack: 0.4 })
      for (let i = 0; i < 4; i++) s.tone({ f: rnd(500, 800), f2: rnd(900, 1300), t: t + 0.1 + i * 0.12, dur: 0.18, gain: 0.03, attack: 0.03 })
    },
  },
  clap: {
    cooldown: 800,
    play: (s, t) => {
      for (let i = 0; i < 9; i++) s.noise({ t: t + i * rnd(0.08, 0.13), dur: 0.05, gain: rnd(0.05, 0.09), type: 'bandpass', f: rnd(1400, 2200), q: 0.8 })
    },
  },
  giggle: {
    cooldown: 700,
    play: (s, t) => {
      const base = rnd(650, 850)
      for (let i = 0; i < 4; i++) s.tone({ f: base * (i % 2 ? 1.12 : 1), f2: base * 0.9, type: 'triangle', t: t + i * 0.1, dur: 0.08, gain: 0.05 })
    },
  },
  popper: {
    cooldown: 150,
    play: (s, t) => {
      s.noise({ t, dur: 0.06, gain: 0.14, type: 'bandpass', f: 1200, q: 0.7 })
      sparkle(s, t + 0.04, 1568, 3, 0.05)
    },
  },
  riff: {
    cooldown: 1200,
    play: (s, t) => {
      ;[0, 0.16, 0.32, 0.56].forEach((d, i) => s.tone({ f: i === 3 ? 98 : 82.4, type: 'sawtooth', t: t + d, dur: i === 3 ? 0.4 : 0.12, gain: 0.07, attack: 0.004 }))
      s.noise({ t, dur: 0.1, gain: 0.03, type: 'lowpass', f: 900 })
    },
  },
  crunch: {
    cooldown: 400,
    play: (s, t) => {
      for (let i = 0; i < 3; i++) s.noise({ t: t + i * 0.09, dur: 0.05, gain: 0.1, type: 'bandpass', f: rnd(2500, 4000), q: 1.5 })
    },
  },
  leer: {
    cooldown: 500,
    play: (s, t) => {
      s.tone({ f: 1200, f2: 380, t, dur: 0.22, gain: 0.07 })
      s.bell(1760, t + 0.05, 0.03, 0.7)
    },
  },

  // ——— the cake ———
  cakeTap: {
    cooldown: 120,
    play: (s, t) => {
      s.tone({ f: 330, f2: 220, type: 'triangle', t, dur: 0.12, gain: 0.14 })
      s.bell(1318.5, t + 0.02, 0.05, 0.6)
    },
  },
  flame: {
    cooldown: 400,
    play: (s, t) => s.noise({ t, dur: 0.35, gain: 0.05, type: 'bandpass', f: 700, f2: 2400, q: 0.9, attack: 0.08 }),
  },
  /** Happy Birthday on a little music box: ~14 seconds, soft, can't overlap itself */
  happyBirthday: {
    cooldown: 0,
    lock: 14800,
    duck: true,
    important: true,
    play: (s, t) => {
      const N = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 }
      const song: Array<[keyof typeof N, number]> = [
        ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
        ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
        ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 1],
        ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2],
      ]
      const beat = 0.6
      let at = t + 0.15
      song.forEach(([n, b], i) => {
        const f = N[n]
        const last = i === song.length - 1
        s.tone({ f, t: at, dur: last ? 2.4 : 1.0, gain: 0.1, attack: 0.003 })
        s.tone({ f: f * 2, t: at, dur: 0.4, gain: 0.04, attack: 0.002 })
        s.tone({ f: f * 4.02, t: at, dur: 0.16, gain: 0.018, attack: 0.002 })
        s.noise({ t: at, dur: 0.012, gain: 0.02, type: 'highpass', f: 6000 })
        at += b * beat
      })
    },
  },

  // ——— the scrapbook ———
  knock: {
    cooldown: 600,
    play: (s, t) => {
      for (let i = 0; i < 3; i++) {
        s.tone({ f: 150, f2: 85, t: t + i * 0.18, dur: 0.1, gain: 0.22, attack: 0.002 })
        s.noise({ t: t + i * 0.18, dur: 0.05, gain: 0.07, type: 'lowpass', f: 700 })
      }
    },
  },
  tapeRip: {
    cooldown: 300,
    play: (s, t) => s.noise({ t, dur: 0.28, gain: 0.1, type: 'highpass', f: 1500, f2: 5000, q: 0.5, attack: 0.04 }),
  },

  // ——— secrets ———
  balloonPop: {
    cooldown: 80,
    play: (s, t) => {
      s.noise({ t, dur: 0.07, gain: 0.16, type: 'bandpass', f: 1800, q: 0.8 })
      s.tone({ f: 320, f2: 110, t, dur: 0.06, gain: 0.1 })
    },
  },
  lampClick: {
    cooldown: 150,
    play: (s, t) => {
      s.tone({ f: 2200, t, dur: 0.015, gain: 0.1 })
      s.tone({ f: 900, f2: 600, t: t + 0.02, dur: 0.04, gain: 0.07 })
      s.noise({ t, dur: 0.02, gain: 0.05, type: 'highpass', f: 4000 })
    },
  },
  ting: { cooldown: 200, play: (s, t) => s.bell(2637, t, 0.12, 0.7) },
  splash: {
    cooldown: 400,
    play: (s, t) => {
      s.noise({ t, dur: 0.4, gain: 0.1, type: 'bandpass', f: 1600, f2: 600, q: 0.7, attack: 0.03 })
      for (let i = 0; i < 4; i++) s.tone({ f: rnd(350, 500), f2: rnd(800, 1100), t: t + i * 0.07, dur: 0.07, gain: 0.07 })
    },
  },
  moonChime: {
    cooldown: 400,
    play: (s, t) => {
      s.bell(1568, t, 0.09, 2)
      s.bell(2349, t + 0.18, 0.05, 2)
    },
  },
  mouse: {
    cooldown: 500,
    play: (s, t) => {
      s.tone({ f: 1500, f2: 2200, t, dur: 0.06, gain: 0.06 })
      s.tone({ f: 1600, f2: 2400, t: t + 0.09, dur: 0.06, gain: 0.06 })
    },
  },
  /** the finishing chord for the secrets that take more than one step */
  secretChord: {
    cooldown: 800,
    important: true,
    play: (s, t) => {
      ;[523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => s.bell(f, t + i * 0.1, 0.1, 2.4))
      sparkle(s, t + 0.35, 1568, 5, 0.05)
    },
  },

  // ——— cinema ———
  curtain: {
    cooldown: 1500,
    motion: true,
    play: (s, t) => {
      s.noise({ t, dur: 1.9, gain: 0.08, type: 'lowpass', f: 260, f2: 160, attack: 0.5 })
      whoosh(s, t + 0.1, 0.06, 1.5, 200, 900)
    },
  },
  projector: {
    cooldown: 1500,
    play: (s, t) => {
      s.tone({ f: 130, f2: 70, t, dur: 0.08, gain: 0.12 })
      let at = t + 0.2
      for (let i = 0; i < 12; i++) {
        s.noise({ t: at, dur: 0.018, gain: 0.05, type: 'bandpass', f: 1600, q: 2 })
        at += 0.05 + i * 0.006
      }
    },
  },

  // ——— the finale ———
  finaleLights: {
    cooldown: 3000,
    motion: true,
    important: true,
    play: (s, t) => {
      s.tone({ f: 58, f2: 49, t, dur: 3.2, gain: 0.14, attack: 1.4 })
      s.noise({ t, dur: 2.4, gain: 0.03, type: 'lowpass', f: 300, f2: 120, attack: 1 })
    },
  },
  giftAppear: {
    cooldown: 2000,
    important: true,
    play: (s, t) => {
      sparkle(s, t, 1318.5, 3, 0.05)
      s.bell(1568, t + 0.15, 0.06, 1.6)
    },
  },
  giftOpen: {
    cooldown: 2000,
    important: true,
    play: (s, t) => {
      s.bell(784, t, 0.14, 2)
      s.bell(1174.7, t + 0.1, 0.1, 2)
      sparkle(s, t + 0.12, 1568, 5, 0.07)
    },
  },
  riser: {
    cooldown: 2000,
    motion: true,
    important: true,
    play: (s, t) => {
      s.noise({ t, dur: 1.3, gain: 0.13, type: 'bandpass', f: 300, f2: 3200, q: 0.9, attack: 1.15 })
      s.tone({ f: 196, f2: 392, type: 'triangle', t, dur: 1.3, gain: 0.1, attack: 1.15 })
      s.tone({ f: 294, f2: 588, t, dur: 1.3, gain: 0.07, attack: 1.15 })
    },
  },
  impact: {
    cooldown: 2000,
    important: true,
    play: (s, t) => {
      s.tone({ f: 82, f2: 36, t, dur: 1.2, gain: 0.36, attack: 0.004 })
      s.noise({ t, dur: 0.7, gain: 0.1, type: 'lowpass', f: 420, f2: 70, attack: 0.004 })
      ;[261.6, 392, 523.25].forEach((f) => s.tone({ f, t: t + 0.02, dur: 2.2, gain: 0.05, attack: 0.15 }))
    },
  },
  ctaShimmer: {
    cooldown: 2000,
    important: true,
    play: (s, t) => {
      for (let i = 0; i < 7; i++) s.tone({ f: 1400 * Math.pow(1.13, i), t: t + i * 0.055, dur: 0.5, gain: 0.045 })
      s.noise({ t, dur: 0.6, gain: 0.018, type: 'highpass', f: 6000, attack: 0.2 })
    },
  },
  ctaHover: {
    cooldown: 500,
    play: (s, t) => {
      s.tone({ f: 1568, t, dur: 0.12, gain: 0.04 })
      s.tone({ f: 2093, t: t + 0.05, dur: 0.14, gain: 0.03 })
    },
  },
  ctaGo: {
    cooldown: 800,
    important: true,
    play: (s, t) => {
      whoosh(s, t, 0.18, 0.75, 300, 3000)
      s.tone({ f: 110, f2: 220, t, dur: 0.7, gain: 0.12, attack: 0.3 })
      s.bell(1046.5, t + 0.3, 0.07, 1.6)
    },
  },
} satisfies Record<string, SoundDef>

export type SoundName = keyof typeof SOUNDS
export type { SoundDef }

// exported for the ambience scheduler
export const ambientChirp = (s: Synth, t: number) => {
  const base = rnd(2300, 3500)
  const n = pick([2, 3, 3, 4])
  for (let i = 0; i < n; i++) s.tone({ f: base * rnd(0.95, 1.1), f2: base * rnd(1.15, 1.4), t: t + i * 0.11, dur: 0.07, gain: 0.05 })
}
