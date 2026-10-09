// Tiny Web Audio helpers. Every sound on the site is synthesised from oscillators and filtered noise,
// so there are no audio files to ship, license, or load.

export interface ToneOpts {
  f: number
  /** glide to this frequency over the note */
  f2?: number
  type?: OscillatorType
  t: number
  dur: number
  gain: number
  attack?: number
}

export interface NoiseOpts {
  t: number
  dur: number
  gain: number
  type: BiquadFilterType
  f: number
  f2?: number
  q?: number
  attack?: number
}

const FLOOR = 0.0001

export class Synth {
  private static noiseBuf = new WeakMap<BaseAudioContext, AudioBuffer>()

  constructor(
    readonly ctx: BaseAudioContext,
    readonly out: AudioNode,
  ) {}

  /** one shared 2-second buffer of white noise per context */
  static noiseBuffer(ctx: BaseAudioContext): AudioBuffer {
    let b = Synth.noiseBuf.get(ctx)
    if (!b) {
      b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const d = b.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
      Synth.noiseBuf.set(ctx, b)
    }
    return b
  }

  tone({ f, f2, type = 'sine', t, dur, gain, attack = 0.006 }: ToneOpts) {
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(f, t)
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur)
    g.gain.setValueAtTime(FLOOR, t)
    g.gain.linearRampToValueAtTime(gain, t + Math.min(attack, dur * 0.9))
    g.gain.exponentialRampToValueAtTime(FLOOR, t + dur)
    o.connect(g).connect(this.out)
    o.start(t)
    o.stop(t + dur + 0.05)
    o.onended = () => {
      o.disconnect()
      g.disconnect()
    }
  }

  noise({ t, dur, gain, type, f, f2, q = 1, attack = 0.005 }: NoiseOpts) {
    const s = this.ctx.createBufferSource()
    s.buffer = Synth.noiseBuffer(this.ctx)
    const fl = this.ctx.createBiquadFilter()
    fl.type = type
    fl.Q.value = q
    fl.frequency.setValueAtTime(f, t)
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(FLOOR, t)
    g.gain.linearRampToValueAtTime(gain, t + Math.min(attack, dur * 0.9))
    g.gain.exponentialRampToValueAtTime(FLOOR, t + dur)
    s.connect(fl).connect(g).connect(this.out)
    s.start(t, Math.random() * 1.5, dur + 0.05)
    s.onended = () => {
      s.disconnect()
      fl.disconnect()
      g.disconnect()
    }
  }

  /** a soft bell: a few inharmonic partials with long decays */
  bell(f: number, t: number, gain: number, dur = 1.4) {
    const partials: Array<[number, number, number]> = [
      [1, 1, 1],
      [2.76, 0.4, 0.6],
      [5.4, 0.18, 0.35],
    ]
    for (const [m, g, d] of partials) this.tone({ f: f * m, t, dur: dur * d, gain: gain * g, attack: 0.004 })
  }
}
