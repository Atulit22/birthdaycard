import { motion } from 'motion/react'
import { useState } from 'react'
import { Present } from '../BirthdayWorld/art'
import { Poppable } from '../UI/Poppable'
import { fx } from '../../fx'
import { usePrefersReducedMotion } from '../../hooks/useCursor'

type Props = {
  eyebrow: string
  title: string
  lines: [string, string]
  button: string
  note: string
  badge: string
  href: string
  tinyEgg: string
  onOpen: () => void
}

// deterministic little sparkles drifting up behind the card
const SPARKS = Array.from({ length: 14 }).map((_, i) => ({
  left: `${(i * 37 + 8) % 96}%`,
  delay: `${(i * 0.53) % 4}s`,
  dur: `${4 + ((i * 7) % 5)}s`,
  size: 6 + ((i * 5) % 8),
}))

/** Replaces the old in-page video player: a little wrapped surprise that links to the full-quality video on Google Drive. */
export function VideoGift({ eyebrow, title, lines, button, note, badge, href, tinyEgg, onOpen }: Props) {
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = useState(false)
  const [egg, setEgg] = useState(false)

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-70 blur-2xl"
        style={{ background: 'radial-gradient(closest-side, rgba(226,182,89,.35), rgba(244,182,200,.12) 60%, transparent)', animation: reduced ? undefined : 'glowpulse 4s ease-in-out infinite' }}
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl border border-gold/50 bg-gradient-to-b from-[#3b1626] to-[#1a0c14] px-5 py-10 text-center shadow-[0_0_60px_rgba(226,182,89,.18)] sm:px-10 sm:py-14">
        {!reduced && (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {SPARKS.map((s, i) => (
              <span
                key={i}
                className="absolute bottom-0 text-gold/70"
                style={{ left: s.left, fontSize: s.size, animation: `rise ${s.dur} linear ${s.delay} infinite` }}
              >
                ✦
              </span>
            ))}
          </div>
        )}

        <p className="relative font-display text-[10px] uppercase tracking-[.4em] text-cream/55">{eyebrow}</p>

        <div className="relative mx-auto mt-5 flex h-28 w-28 items-center justify-center">
          <Poppable
            label="a tiny gift"
            lines={[tinyEgg]}
            onPop={() => {
              setEgg(true)
              fx.confetti({ x: 0.5, y: 0.5, count: 24, power: 8, shapes: ['dot'], spread: 1.2 })
            }}
            inline
          >
            <span style={{ display: 'inline-block', animation: reduced ? undefined : 'floaty 3.4s ease-in-out infinite' }}>
              <Present size={92} open={hover || egg} />
            </span>
          </Poppable>
        </div>

        <h3 className="relative mt-3 font-hand text-4xl leading-tight text-gold [text-shadow:0_0_22px_rgba(226,182,89,.55)] sm:text-5xl">{title}</h3>
        <p className="relative mx-auto mt-4 max-w-md font-display text-lg italic leading-relaxed text-cream sm:text-xl">
          {lines[0]}
          <br />
          {lines[1]}
        </p>

        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onOpen}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="relative mt-8 inline-flex min-h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full border border-gold bg-gold px-8 py-4 font-display text-lg font-bold text-ink shadow-[0_0_44px_rgba(226,182,89,.55)] outline-none focus-visible:ring-4 focus-visible:ring-blush/70 sm:w-auto"
        >
          {button}
        </motion.a>

        <p className="relative mt-4 text-sm text-cream/60">{note}</p>
        <p className="relative mt-5 inline-block rounded-full border border-cream/20 px-3 py-1 font-display text-[10px] uppercase tracking-[.25em] text-cream/55">{badge}</p>
      </div>
    </div>
  )
}
