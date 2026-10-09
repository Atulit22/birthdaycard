import { motion } from 'motion/react'
import { playSound } from '../../audio/useSound'
import { useEffect, useRef, useState } from 'react'
import { Flower } from '../../components/BirthdayWorld/art'
import { Cat } from '../../components/Cat/Cat'
import { SecretBook } from '../../components/EasterEggs/SecretEggs'
import { FlipCard } from '../../components/Scrapbook/FlipCard'
import { Reveal } from '../../components/UI/Reveal'
import { content, type CornerCard } from '../../data/birthdayContent'
import { eggText } from '../../data/easterEggs'
import { fx } from '../../fx'
import { useWhisperOnView } from '../../hooks/useWhisperOnView'
import { useWorld } from '../../state/DiscoveryContext'

const COLORS: Record<CornerCard['color'], { bg: string; fg: string; accent: string }> = {
  wine: { bg: 'bg-wine', fg: 'text-cream', accent: 'text-gold' },
  plum: { bg: 'bg-[#4a2a6a]', fg: 'text-cream', accent: 'text-blush' },
  cream: { bg: 'bg-cream', fg: 'text-ink', accent: 'text-wine' },
  blush: { bg: 'bg-blush', fg: 'text-ink', accent: 'text-wine' },
  gold: { bg: 'bg-gold', fg: 'text-ink', accent: 'text-wine' },
  sage: { bg: 'bg-[#8fb391]', fg: 'text-ink', accent: 'text-[#2c4a3a]' },
}

/** Tap her three times and she wakes. Tap her with the lights OFF and you see what she dreams about. */
function SleepyCat({ dark }: { dark: boolean }) {
  const { discover, say } = useWorld()
  const [n, setN] = useState(0)
  const [dream, setDream] = useState<number | null>(null)
  const awake = n >= 3

  useEffect(() => {
    if (dream === null) return
    const t = window.setTimeout(() => setDream(dream >= eggText.dream.length ? null : dream + 1), dream >= eggText.dream.length ? 1000 : 750)
    return () => window.clearTimeout(t)
  }, [dream])
  return (
    <button
      aria-label="a sleeping cat"
      onClick={() => {
        if (dark && !awake) {
          setDream(0)
          playSound('moonChime')
          discover('dream')
          return
        }
        const c = n + 1
        setN(c)
        say(eggText.sleepy[Math.min(c - 1, 2)], 2400)
        playSound(c === 3 ? 'catMeow' : 'tap')
        if (c === 3) discover('sleepy')
      }}
      className="relative mx-auto block"
    >
      {dream !== null && dream < eggText.dream.length && (
        <motion.div
          key={dream}
          initial={{ opacity: 0, y: 6, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="pointer-events-none absolute -top-14 left-1/2 z-10 -translate-x-1/2 rounded-full bg-cream/90 px-3 py-1.5 text-3xl shadow-lg"
        >
          {eggText.dream[dream]}
        </motion.div>
      )}
      <motion.div key={awake ? 'a' : 's'} initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
        {awake ? <Cat pose="sit" size={120} mood="annoyed" autoYawn={false} yawn /> : <Cat pose="sleep" size={190} />}
      </motion.div>
      <div className="absolute inset-x-6 -bottom-2 -z-10 h-6 rounded-full bg-gradient-to-r from-wine/80 via-crimson/80 to-wine/80 blur-[1px]" />
    </button>
  )
}

/** "Things that are very Ishita" — a cosy room, a lamp, a sleeping cat, a deck of flip cards. */
export function IshitaCorner() {
  const ref = useRef<HTMLElement>(null)
  useWhisperOnView(ref, content.areaWhispers.corner)
  const c = content.corner
  const { discover } = useWorld()
  const [lampOn, setLampOn] = useState(true)
  const flips = useRef<Record<string, number>>({})

  const toggleLamp = () => {
    const next = !lampOn
    setLampOn(next)
    playSound('lampClick')
    if (!next) discover('lamp')
  }
  // flipping the same card again and again: a couple of cards have opinions about that
  const countFlip = (id: string) => {
    const n = (flips.current[id] = (flips.current[id] ?? 0) + 1)
    if (id === 'gaming' && n === 6) {
      playSound('ting')
      discover('whiff')
    }
    if (id === 'music' && n === 5) {
      fx.shake()
      playSound('pop')
      discover('repeat')
    }
  }
  return (
    <section
      ref={ref}
      id="corner"
      className="relative overflow-hidden bg-gradient-to-b from-[#170b24] via-[#2b1237] to-[#3a1a3f] px-5 py-24 sm:px-8"
    >
      {/* warm lamp light — the lamp can be switched off */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 bg-[radial-gradient(ellipse_closest-side_at_50%_0,rgba(255,200,130,.28),transparent)] transition-opacity duration-700"
        style={{ opacity: lampOn ? 1 : 0 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[#04020a] transition-opacity duration-1000" style={{ opacity: lampOn ? 0 : 0.55 }} />
      <div className="pointer-events-none absolute left-1/2 top-0 h-16 w-px bg-cream/30" />
      <div
        className={`pointer-events-none absolute left-1/2 top-16 h-6 w-16 -translate-x-1/2 rounded-b-full transition-all duration-500 ${
          lampOn ? 'bg-gold/90 shadow-[0_10px_60px_20px_rgba(255,200,130,.35)]' : 'bg-gold/25'
        }`}
      />
      <button type="button" aria-label="a hanging lamp" onClick={toggleLamp} className="absolute left-1/2 top-12 z-10 h-12 w-24 -translate-x-1/2 touch-manipulation rounded-b-full outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold" />
      <p
        aria-hidden={lampOn}
        className="pointer-events-none absolute inset-x-0 top-[7.4rem] text-center font-hand text-xl text-[#e8f5a0] transition-opacity duration-1000 sm:text-2xl"
        style={{ opacity: lampOn ? 0 : 0.85, textShadow: '0 0 12px rgba(232,245,160,.7)' }}
      >
        {eggText.lamp}
      </p>

      <div className="relative mx-auto max-w-5xl">
        <Reveal className="mt-16 text-center">
          <p className="font-display text-xs uppercase tracking-[.4em] text-cream/55">area 05 · {c.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl font-bold italic leading-tight text-cream sm:text-6xl">{c.title}</h2>
          <p className="mt-2 font-hand text-2xl text-blush/80">{c.sub}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {c.cards.map((card, i) => {
            const col = COLORS[card.color]
            return (
              <Reveal key={card.id} delay={(i % 3) * 0.1}>
                <FlipCard
                  label={`${card.title} card`}
                  tilt={i % 2 ? 1.6 : -1.6}
                  onFlip={() => countFlip(card.id)}
                  front={
                    <div className={`flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center shadow-[0_14px_30px_-10px_rgba(0,0,0,.7)] ${col.bg} ${col.fg}`}>
                      <span className="text-5xl sm:text-6xl">{card.emoji}</span>
                      <span className="font-display text-xl font-bold sm:text-2xl">{card.title}</span>
                      <span className={`font-hand text-xl ${col.accent}`}>{card.teaser}</span>
                      <span className="mt-1 text-[10px] uppercase tracking-[.3em] opacity-50">tap to open</span>
                    </div>
                  }
                  back={
                    <div className={`flex aspect-[4/5] flex-col justify-center gap-2 overflow-hidden rounded-2xl p-4 shadow-[0_14px_30px_-10px_rgba(0,0,0,.7)] ring-4 ring-inset ring-black/10 ${col.bg} ${col.fg}`}>
                      <span className={`font-display text-lg font-bold ${col.accent}`}>
                        {card.emoji} {card.title}
                      </span>
                      <ul className="space-y-1.5 font-hand text-[1.15rem] leading-[1.1] sm:text-[1.35rem]">
                        {card.items.map((it) => (
                          <li key={it} className="flex gap-1.5">
                            <span className={col.accent}>✦</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  }
                />
              </Reveal>
            )
          })}
        </div>

        {/* shelf with decorations + sleeping cat */}
        <Reveal className="relative mt-20">
          <div className="mx-auto flex max-w-xl items-end justify-between px-2">
            <Flower size={44} color="#e2b659" />
            <SleepyCat dark={!lampOn} />
            <div className="flex items-end gap-3">
              <SecretBook />
              <Flower size={44} color="#f4b6c8" />
            </div>
          </div>
          <div className="mx-auto h-3 max-w-xl rounded bg-[#4a2c3a] shadow-[0_8px_0_#2b1820]" />
        </Reveal>
      </div>
    </section>
  )
}
