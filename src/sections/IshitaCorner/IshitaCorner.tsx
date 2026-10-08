import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { Flower } from '../../components/BirthdayWorld/art'
import { Cat } from '../../components/Cat/Cat'
import { FlipCard } from '../../components/Scrapbook/FlipCard'
import { Reveal } from '../../components/UI/Reveal'
import { content, type CornerCard } from '../../data/birthdayContent'
import { eggText } from '../../data/easterEggs'
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

function SleepyCat() {
  const { discover, say } = useWorld()
  const [n, setN] = useState(0)
  const awake = n >= 3
  return (
    <button
      aria-label="a sleeping cat"
      onClick={() => {
        const c = n + 1
        setN(c)
        say(eggText.sleepy[Math.min(c - 1, 2)], 2400)
        if (c === 3) discover('sleepy')
      }}
      className="relative mx-auto block"
    >
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
  return (
    <section
      ref={ref}
      id="corner"
      className="relative overflow-hidden bg-gradient-to-b from-[#170b24] via-[#2b1237] to-[#3a1a3f] px-5 py-24 sm:px-8"
    >
      {/* warm lamp light */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 bg-[radial-gradient(ellipse_closest-side_at_50%_0,rgba(255,200,130,.28),transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-16 w-px bg-cream/30" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-6 w-16 -translate-x-1/2 rounded-b-full bg-gold/90 shadow-[0_10px_60px_20px_rgba(255,200,130,.35)]" />

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
            <SleepyCat />
            <Flower size={44} color="#f4b6c8" />
          </div>
          <div className="mx-auto h-3 max-w-xl rounded bg-[#4a2c3a] shadow-[0_8px_0_#2b1820]" />
        </Reveal>
      </div>
    </section>
  )
}
