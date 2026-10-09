import type { Synth } from './synth'

// A bouncy little party tune, written as data: C – Am – F – G, 116 bpm, eight bars that loop.
// Levels: 0 = the tune on its own · 1 = + kick & hats (the build) · 2 = + claps & sparkle (the celebration) · 3 = the tune again, softer (the wind-down)

export const STEP = 60 / 116 / 4 // one sixteenth note, in seconds
export const LOOP_STEPS = 128 // 8 bars

const ROOT = [130.81, 110, 174.61, 196]
const CHORD = [
  [261.63, 329.63, 392],
  [220, 261.63, 329.63],
  [220, 261.63, 349.23],
  [246.94, 293.66, 392],
]
const N = { A4: 440, G4: 392, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5 }
type Note = keyof typeof N
const MELODY: Array<Array<[number, Note]>> = [
  [[0, 'E5'], [2, 'G5'], [4, 'A5'], [6, 'G5'], [8, 'E5'], [10, 'D5'], [12, 'C5']],
  [[0, 'C5'], [2, 'E5'], [4, 'A5'], [8, 'G5'], [10, 'E5'], [12, 'A4']],
  [[0, 'A5'], [2, 'G5'], [4, 'E5'], [6, 'C5'], [8, 'D5'], [10, 'E5'], [12, 'G5']],
  [[0, 'D5'], [2, 'E5'], [4, 'G5'], [6, 'E5'], [8, 'D5'], [14, 'G4']],
  [[0, 'G5'], [2, 'A5'], [4, 'C6'], [6, 'A5'], [8, 'G5'], [10, 'E5'], [12, 'G5']],
  [[0, 'A5'], [2, 'C6'], [4, 'A5'], [6, 'G5'], [8, 'E5'], [10, 'G5'], [12, 'A5']],
  [[0, 'A5'], [2, 'G5'], [4, 'E5'], [6, 'D5'], [8, 'C5'], [10, 'D5'], [12, 'E5']],
  [[0, 'D5'], [2, 'E5'], [4, 'G5'], [6, 'A5'], [8, 'G5'], [12, 'G5']],
]
const BASS = [0, 3, 8, 10, 12]

/** Schedule everything that happens on one sixteenth-note step. */
export function scheduleStep(s: Synth, step: number, t: number, level: number) {
  const n = step % LOOP_STEPS
  const bar = Math.floor(n / 16)
  const k = n % 16
  const chord = bar % 4

  // bass
  if (BASS.includes(k)) {
    const f = ROOT[chord] * (k === 8 || k === 12 ? 1.5 : 1)
    s.tone({ f, type: 'triangle', t, dur: 0.2, gain: 0.085, attack: 0.004 })
  }
  // chord stabs on the off-beats
  if (k % 4 === 2) {
    const g = k === 6 || k === 14 ? 0.034 : 0.022
    for (const f of CHORD[chord]) s.tone({ f, type: 'triangle', t, dur: 0.17, gain: g, attack: 0.004 })
  }
  // melody: a marimba-ish pluck
  for (const [at, note] of MELODY[bar]) {
    if (at !== k) continue
    const f = N[note]
    s.tone({ f, t, dur: 0.28, gain: 0.06, attack: 0.003 })
    s.tone({ f: f * 4, t, dur: 0.07, gain: 0.014, attack: 0.002 })
  }

  if (level >= 1 && level < 3) {
    if (k % 8 === 0) s.tone({ f: 130, f2: 45, t, dur: 0.14, gain: 0.12, attack: 0.002 }) // kick
    if (k % 2 === 0) s.noise({ t, dur: 0.035, gain: k % 4 === 0 ? 0.02 : 0.013, type: 'highpass', f: 7500 }) // hats
  }
  if (level === 2) {
    if (k === 4 || k === 12) s.noise({ t, dur: 0.09, gain: 0.07, type: 'bandpass', f: 1600, q: 0.7 }) // claps
    if (k % 4 === 0) s.tone({ f: CHORD[chord][(k / 4) % 3] * 4, t, dur: 0.25, gain: 0.014 }) // sparkle on top
  }
}
