import { ambientChirp, SOUNDS, type PlayOpts, type SoundDef, type SoundName } from './sounds'
import { LOOP_STEPS, scheduleStep, STEP } from './partyMusic'
import { Synth } from './synth'

/**
 * One place for all sound. Nothing is created until `unlock()` is called from a real user gesture
 * (the "Go explore" button), so we never fight the browser's autoplay policy.
 *
 *  master ─ compressor ─ destination
 *    ├─ sfx      one-shot sounds (synthesised, see sounds.ts)
 *    └─ ambience quiet looping layers, cross-faded per scene
 */

export type Section = 'welcome' | 'town' | 'corner' | 'scrapbook' | 'party' | 'cinema' | 'final' | 'none'
type Layer = 'room' | 'wind' | 'birds' | 'shimmer' | 'hum' | 'drone' | 'crowd'

/** how much of each layer is audible in each scene (0–1) */
const SCENES: Record<Section | 'finale', Partial<Record<Layer, number>>> = {
  none: {},
  welcome: { room: 0.5, shimmer: 1, wind: 0.3 },
  town: { wind: 1, birds: 1, room: 0.3, shimmer: 0.3 },
  corner: { wind: 0.5, birds: 0.35, room: 0.5, shimmer: 0.6 },
  scrapbook: { room: 1, shimmer: 0.3 },
  party: { room: 0.25, crowd: 1, shimmer: 0.2 },
  cinema: { room: 0.6, hum: 1 },
  finale: { room: 0.15, drone: 1 }, // everything else falls away
  final: { room: 0.5, shimmer: 0.5, drone: 0.35 },
}
/** peak gain of each layer at weight 1 — deliberately tiny */
const LEVEL: Record<Layer, number> = { room: 0.05, wind: 0.045, birds: 1, shimmer: 0.03, hum: 0.04, drone: 0.085, crowd: 0.022 }
/** how loud the party tune is at each level (see partyMusic.ts) */
const PARTY_GAIN = [0.55, 0.66, 0.85, 0.38, 0.12] // 4 = the letter is open: the party goes quiet in the background

const STORE = 'ishita-sound'
const MASTER = 0.8
const MAX_VOICES = 8

export interface AudioState {
  unlocked: boolean
  muted: boolean
}

type Ctor = typeof AudioContext

class AudioManager {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private sfxBus!: GainNode
  private ambBus!: GainNode
  private synth!: Synth
  private ambSynth!: Synth
  private musicBus!: GainNode
  private musicSynth!: Synth
  private party = { on: false, level: 0, timer: 0, next: 0, step: 0 }
  private layers: Partial<Record<Layer, GainNode>> = {}
  private nodes: AudioNode[] = []
  private last = new Map<string, number>()
  private locks = new Map<string, number>()
  private voices: number[] = []
  private section: Section = 'none'
  private finale = false
  private birdTimer = 0
  private suspendTimer = 0
  private reducedQ = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
  private listeners = new Set<() => void>()
  private state: AudioState = { unlocked: false, muted: false }

  constructor() {
    try {
      this.state.muted = localStorage.getItem(STORE) === 'off'
    } catch {
      /* storage blocked: default to sound on */
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibility)
      // phones can interrupt the context (calls, lock screen); the next touch brings it back
      const wake = () => this.wake()
      window.addEventListener('pointerdown', wake, { passive: true })
      window.addEventListener('keydown', wake)
    }
  }

  // ——— state for React (useSyncExternalStore) ———
  subscribe = (l: () => void) => {
    this.listeners.add(l)
    return () => void this.listeners.delete(l)
  }
  getState = () => this.state
  private set(p: Partial<AudioState>) {
    this.state = { ...this.state, ...p }
    this.listeners.forEach((l) => l())
  }

  private get reduced() {
    return !!this.reducedQ?.matches
  }

  // ——— lifecycle ———
  /** Call from a click/tap handler. Safe to call repeatedly. */
  unlock() {
    if (this.ctx) {
      this.wake()
      return
    }
    try {
      const C: Ctor | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext
      if (!C) return
      const ctx = new C()
      this.ctx = ctx
      this.master = ctx.createGain()
      this.master.gain.value = this.state.muted ? 0 : MASTER
      const comp = ctx.createDynamicsCompressor() // keeps overlapping sounds from ever getting harsh
      comp.threshold.value = -18
      comp.ratio.value = 4
      this.sfxBus = ctx.createGain()
      this.ambBus = ctx.createGain()
      this.musicBus = ctx.createGain()
      this.musicBus.gain.value = 0
      this.musicBus.connect(this.master)
      this.sfxBus.connect(this.master)
      this.ambBus.connect(this.master)
      this.master.connect(comp).connect(ctx.destination)
      this.synth = new Synth(ctx, this.sfxBus)
      this.ambSynth = new Synth(ctx, this.ambBus)
      this.musicSynth = new Synth(ctx, this.musicBus)
      void ctx.resume()
      this.buildAmbience(ctx)
      this.set({ unlocked: true })
      this.applyScene()
      if (this.party.on) this.startPartyLoop()
    } catch {
      this.ctx = null // no audio, no problem — the site works the same without it
    }
  }

  private wake() {
    const c = this.ctx
    if (c && !this.state.muted && !document.hidden && c.state !== 'running') void c.resume().catch(() => {})
  }

  private onVisibility = () => {
    const c = this.ctx
    if (!c) return
    if (document.hidden) void c.suspend().catch(() => {})
    else this.wake()
  }

  setMuted(muted: boolean) {
    this.set({ muted })
    try {
      localStorage.setItem(STORE, muted ? 'off' : 'on')
    } catch {
      /* ignore */
    }
    const c = this.ctx
    if (!c) return
    window.clearTimeout(this.suspendTimer)
    if (muted) {
      this.master.gain.setTargetAtTime(0, c.currentTime, 0.04)
      this.suspendTimer = window.setTimeout(() => void c.suspend().catch(() => {}), 300)
    } else {
      void c.resume().catch(() => {})
      this.master.gain.setTargetAtTime(MASTER, c.currentTime, 0.08)
      this.applyScene()
    }
  }
  toggleMuted() {
    this.setMuted(!this.state.muted)
    if (!this.state.muted) this.play('toggle')
  }

  /** Stop everything and release the context (e.g. HMR). */
  dispose() {
    window.clearTimeout(this.birdTimer)
    window.clearTimeout(this.suspendTimer)
    window.clearInterval(this.party.timer)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.nodes.forEach((n) => {
      try {
        ;(n as OscillatorNode).stop?.()
      } catch {
        /* already stopped */
      }
      n.disconnect()
    })
    this.nodes = []
    void this.ctx?.close().catch(() => {})
    this.ctx = null
    this.set({ unlocked: false })
  }

  // ——— one-shot sounds ———
  play(name: SoundName, opts: PlayOpts & { delay?: number } = {}) {
    const c = this.ctx
    if (!c || this.state.muted || document.hidden) return
    const def: SoundDef = SOUNDS[name]
    if (def.motion && this.reduced) return
    const now = performance.now()
    if (now - (this.last.get(name) ?? -1e9) < def.cooldown) return
    this.voices = this.voices.filter((end) => end > now)
    if (this.voices.length >= MAX_VOICES && !def.important) return
    if (def.lock) {
      if (now < (this.locks.get(name) ?? 0)) return
      this.locks.set(name, now + def.lock)
      if (def.duck) this.duck(def.lock)
    }
    this.last.set(name, now)
    this.voices.push(now + 1500)
    if (c.state !== 'running') void c.resume().catch(() => {})
    try {
      def.play(this.synth, c.currentTime + 0.01 + (opts.delay ?? 0), opts)
    } catch {
      /* a failed sound must never break the page */
    }
  }

  /** pull the ambience down for a while (a melody is playing), then bring it back */
  private duck(ms: number) {
    const c = this.ctx
    if (!c) return
    this.ambBus.gain.setTargetAtTime(0.25, c.currentTime, 0.4)
    window.setTimeout(() => {
      if (this.ctx) this.ambBus.gain.setTargetAtTime(1, this.ctx.currentTime, 1)
    }, ms)
  }

  // ——— the party tune ———
  /** Start / stop the party music (it fades in and out; nothing plays until sound is unlocked). */
  setParty(on: boolean) {
    if (on === this.party.on) return
    this.party.on = on
    if (on) this.startPartyLoop()
    else this.stopPartyLoop()
  }
  /** 0 tune · 1 build · 2 celebration · 3 wind-down */
  setPartyLevel(level: number) {
    this.party.level = level
    const c = this.ctx
    if (c && this.party.on) this.musicBus.gain.setTargetAtTime(PARTY_GAIN[level] ?? 0.55, c.currentTime, 1.1)
  }
  private startPartyLoop() {
    const c = this.ctx
    if (!c) return
    window.clearInterval(this.party.timer)
    this.party.next = c.currentTime + 0.1
    this.party.step = 0
    this.musicBus.gain.cancelScheduledValues(c.currentTime)
    this.musicBus.gain.setTargetAtTime(PARTY_GAIN[this.party.level] ?? 0.55, c.currentTime, 1.6)
    this.party.timer = window.setInterval(() => {
      const ctx = this.ctx
      if (!ctx || this.state.muted || document.hidden) return
      // keep ~0.4s of music scheduled ahead (and never a burst if the clock jumped)
      if (this.party.next < ctx.currentTime) this.party.next = ctx.currentTime + 0.05
      while (this.party.next < ctx.currentTime + 0.4) {
        try {
          scheduleStep(this.musicSynth, this.party.step, this.party.next, this.party.level)
        } catch {
          /* ignore */
        }
        this.party.next += STEP
        this.party.step = (this.party.step + 1) % LOOP_STEPS
      }
    }, 100)
  }
  private stopPartyLoop() {
    const c = this.ctx
    if (c) this.musicBus.gain.setTargetAtTime(0, c.currentTime, 0.4)
    window.clearInterval(this.party.timer) // notes already scheduled ring out under the fade
  }

  // ——— ambience ———
  setSection(s: Section) {
    if (s === this.section) return
    this.section = s
    this.applyScene()
  }
  /** The finale: everything else goes quiet and a low atmosphere takes over. */
  setFinale(on: boolean) {
    if (on === this.finale) return
    this.finale = on
    this.applyScene()
  }

  private applyScene() {
    const c = this.ctx
    if (!c) return
    const scene = SCENES[this.finale && this.section === 'cinema' ? 'finale' : this.section]
    const on = !this.reduced // ambience is made of slow drifting motion, so it sits out for reduced-motion
    const slow = this.finale && this.section === 'cinema' ? 1.6 : 1.1 // seconds (time constant): the lights go down slowly
    for (const k of Object.keys(LEVEL) as Layer[]) {
      const g = this.layers[k]
      if (!g) continue
      g.gain.setTargetAtTime(on ? (scene[k] ?? 0) * LEVEL[k] : 0, c.currentTime, slow)
    }
    window.clearTimeout(this.birdTimer)
    if (on && (scene.birds ?? 0) > 0) this.scheduleBird()
  }

  private scheduleBird() {
    this.birdTimer = window.setTimeout(
      () => {
        const c = this.ctx
        const w = SCENES[this.section].birds ?? 0
        if (c && !this.state.muted && !document.hidden && w > 0 && !(this.finale && this.section === 'cinema')) {
          ambientChirp(this.ambSynth, c.currentTime + 0.02)
        }
        this.scheduleBird()
      },
      3500 + Math.random() * 6500,
    )
  }

  private buildAmbience(ctx: AudioContext) {
    const keep = <T extends AudioNode>(n: T) => (this.nodes.push(n), n)
    const layer = (k: Layer) => {
      const g = keep(ctx.createGain())
      g.gain.value = 0
      g.connect(this.ambBus)
      this.layers[k] = g
      return g
    }
    const noise = () => {
      const s = keep(ctx.createBufferSource())
      s.buffer = Synth.noiseBuffer(ctx)
      s.loop = true
      s.start()
      return s
    }
    const osc = (f: number, type: OscillatorType = 'sine') => {
      const o = keep(ctx.createOscillator())
      o.type = type
      o.frequency.value = f
      o.start()
      return o
    }
    const lfo = (rate: number, depth: number, target: AudioParam) => {
      const o = osc(rate)
      const d = keep(ctx.createGain())
      d.gain.value = depth
      o.connect(d).connect(target)
    }

    // room tone: a soft, low breath of air
    {
      const f = keep(ctx.createBiquadFilter())
      f.type = 'lowpass'
      f.frequency.value = 380
      noise().connect(f).connect(layer('room'))
    }
    // wind: band-passed noise whose pitch and strength slowly drift
    {
      const f = keep(ctx.createBiquadFilter())
      f.type = 'bandpass'
      f.Q.value = 0.7
      f.frequency.value = 520
      lfo(0.07, 260, f.frequency)
      const swell = keep(ctx.createGain())
      swell.gain.value = 0.65
      lfo(0.11, 0.35, swell.gain)
      noise().connect(f).connect(swell).connect(layer('wind'))
    }
    // shimmer: a very quiet open chord that breathes
    {
      const g = layer('shimmer')
      const f = keep(ctx.createBiquadFilter())
      f.type = 'lowpass'
      f.frequency.value = 1800
      f.connect(g)
      ;[261.6, 392, 523.25, 659.25].forEach((hz, i) => {
        const o = osc(hz)
        o.detune.value = (i - 1.5) * 4
        lfo(0.05 + i * 0.013, 5, o.detune)
        const og = keep(ctx.createGain())
        og.gain.value = 0.25
        o.connect(og).connect(f)
      })
    }
    // a tiny crowd murmuring far away: band-passed noise that swells and fades unevenly
    {
      const f = keep(ctx.createBiquadFilter())
      f.type = 'bandpass'
      f.Q.value = 0.6
      f.frequency.value = 700
      lfo(0.09, 120, f.frequency)
      const swell = keep(ctx.createGain())
      swell.gain.value = 0.6
      lfo(0.7, 0.25, swell.gain)
      lfo(1.9, 0.15, swell.gain)
      noise().connect(f).connect(swell).connect(layer('crowd'))
    }
    // projector hum
    {
      const g = layer('hum')
      const f = keep(ctx.createBiquadFilter())
      f.type = 'lowpass'
      f.frequency.value = 260
      f.connect(g)
      osc(50, 'triangle').connect(f)
      const o2 = osc(100)
      const og = keep(ctx.createGain())
      og.gain.value = 0.4
      o2.connect(og).connect(f)
    }
    // finale drone: low and warm
    {
      const g = layer('drone')
      const f = keep(ctx.createBiquadFilter())
      f.type = 'lowpass'
      f.frequency.value = 420
      lfo(0.04, 90, f.frequency)
      f.connect(g)
      ;[55, 82.4, 110, 164.8].forEach((hz, i) => {
        const o = osc(hz, i === 0 ? 'triangle' : 'sine')
        const og = keep(ctx.createGain())
        og.gain.value = [0.6, 0.35, 0.25, 0.08][i]
        o.connect(og).connect(f)
      })
    }
  }
}

export const audio = new AudioManager()

if (import.meta.hot) import.meta.hot.dispose(() => audio.dispose())
