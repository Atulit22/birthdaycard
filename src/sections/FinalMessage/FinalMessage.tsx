import { AnimatePresence, motion, useInView } from 'motion/react'
import { useRef, useState } from 'react'
import { playSound } from '../../audio/useSound'
import { Moon } from '../../components/BirthdayWorld/art'
import { Fireflies } from '../../components/BirthdayWorld/Ambient'
import { Cat } from '../../components/Cat/Cat'
import { StarField } from '../../components/UI/StarField'
import { content } from '../../data/birthdayContent'
import { fx } from '../../fx'
import { usePrefersReducedMotion } from '../../hooks/useCursor'
import { useWorld } from '../../state/DiscoveryContext'

/**
 * The epilogue: the quiet part between the party and the movie.
 * The world gets calmer, black bars slide in like a film is about to start, the cat waits.
 * No cake, no "happy birthday" — that already happened. (Two tiny secrets still live here: "rawr." and the cat.)
 */
export function FinalMessage() {
  const f = content.final
  const { found, discover } = useWorld()
  const reduced = usePrefersReducedMotion()
  const secRef = useRef<HTMLElement>(null)
  const conRef = useRef<HTMLDivElement>(null)
  const inView = useInView(secRef, { amount: 0.3 })
  const [rawrTaps, setRawrTaps] = useState(0)
  const [ending, setEnding] = useState(false)
  const [purrs, setPurrs] = useState(0)

  const track = (e: React.PointerEvent) => {
    const el = conRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  // "rawr." three times → a P.S.   ·   after the P.S., the cat has one more thing
  const tapRawr = () => {
    const c = rawrTaps + 1
    setRawrTaps(c)
    playSound('tap')
    if (c === 3) {
      playSound('sparkle')
      discover('ps')
    }
  }
  const pokeCat = () => {
    setPurrs((n) => n + 1)
    if (found.includes('ps')) {
      setEnding((e) => !e)
      if (!found.includes('ending')) {
        playSound('secretChord')
        fx.confetti({ x: 0.5, y: 0.5, count: 50, shapes: ['star', 'heart'], power: 9 })
        discover('ending')
      } else playSound('moonChime')
    } else playSound(purrs % 2 ? 'catMeow' : 'catPoke')
  }

  return (
    <section
      ref={secRef}
      id="final"
      onPointerMove={track}
      onPointerDown={track}
      className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-[#3a1a3f] via-[#120a14] to-[#05030a] px-5 pb-36 pt-28 text-center"
    >
      <StarField count={240} seed={77} height={3000} />
      <Moon size={110} className="absolute right-[8%] top-16 opacity-80" />
      <Fireflies count={7} seed={5} />

      {/* a cat-shaped constellation that only shows near your cursor / finger */}
      <div ref={conRef} className="pointer-events-none absolute left-1/2 top-24 w-[min(480px,86vw)] -translate-x-1/2" style={{ ['--mx' as string]: '-999px', ['--my' as string]: '-999px' }} aria-hidden>
        {[0.1, 1].map((o, i) => (
          <svg
            key={i}
            viewBox="0 0 300 240"
            className={i ? 'absolute inset-0' : ''}
            style={{
              opacity: o,
              maskImage: i ? 'radial-gradient(circle 150px at var(--mx) var(--my), #000 0%, transparent 100%)' : undefined,
              WebkitMaskImage: i ? 'radial-gradient(circle 150px at var(--mx) var(--my), #000 0%, transparent 100%)' : undefined,
            }}
          >
            <path d="M70 120 L58 38 L112 82 L188 82 L242 38 L230 120 C 240 170, 200 210, 150 214 C 100 210, 60 170, 70 120 Z M115 140 L150 165 L185 140" stroke="#e2b659" strokeWidth="1" fill="none" strokeDasharray="3 4" />
            {[[70, 120], [58, 38], [112, 82], [188, 82], [242, 38], [230, 120], [150, 214], [115, 140], [185, 140], [150, 165]].map(([x, y], j) => (
              <circle key={j} cx={x} cy={y} r="3" fill="#fff3cf" />
            ))}
          </svg>
        ))}
      </div>

      <div className="relative mx-auto max-w-xl">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} className="font-display text-xs uppercase tracking-[.4em] text-cream/50">
          epilogue · the quiet part
        </motion.p>

        <div className="mt-[24vh] space-y-3 sm:mt-[28vh]">
          {f.quiet.map((l, i) => (
            <motion.p
              key={l}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.6, delay: reduced ? 0 : i * 1.6 }}
              className={i ? 'font-hand text-3xl text-blush/90 sm:text-4xl' : 'font-display text-xl italic text-cream/85 sm:text-2xl'}
            >
              {l}
            </motion.p>
          ))}
        </div>

        {/* the cat, waiting in the dark */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.4, delay: 0.4 }} className="relative mx-auto mt-14 w-[150px]">
          <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,217,138,.16),transparent)]" />
          <AnimatePresence>
            {ending && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bottom-full left-1/2 z-30 mb-2 w-60 -translate-x-1/2 rounded-lg bg-paper p-3 text-center text-ink shadow-2xl"
                style={{ rotate: -2 }}
              >
                <p className="text-[10px] uppercase tracking-[.3em] text-wine/70">{f.ending[0]}</p>
                <p className="mt-1 font-hand text-2xl leading-[1.1]">{f.ending[1]}</p>
                <p className="mt-1 font-hand text-xl text-wine">{f.ending[2]}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button type="button" aria-label="the cat" onClick={pokeCat} className="relative block w-full touch-manipulation outline-offset-4">
            <Cat pose="sit" size={150} blinkDelay={2} className="h-auto w-full" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: 1.2, duration: 1.2 }}
          onClick={tapRawr}
          className="mx-auto mt-6 w-fit touch-manipulation px-4 py-2 font-hand text-4xl text-gold"
        >
          {f.rawr}
        </motion.p>
        {found.includes('ps') && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-1 max-w-xs font-hand text-2xl text-cream/60">
            {f.ps}
          </motion.p>
        )}

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ delay: 1.8, duration: 1.2 }} className="mt-14 font-hand text-2xl text-cream/60">
          {f.secretsLine.replace('{n}', String(found.length))}
        </motion.p>
      </div>

      {/* the way into the movie */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: 2.4, duration: 1.4 }} className="relative mt-16 flex justify-center">
        <button
          type="button"
          onClick={() => {
            playSound('whooshSoft')
            document.getElementById('cinema')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
          }}
          className="rounded-full border border-gold/50 bg-ink/50 px-6 py-3 font-hand text-2xl text-cream backdrop-blur transition hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          {f.cue}
        </button>
      </motion.div>

      {/* black bars slide in, like a film is about to start */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-black" initial={false} animate={{ height: inView && !reduced ? '6svh' : 0 }} transition={{ duration: 1.6 }} />
      <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black" initial={false} animate={{ height: inView && !reduced ? '6svh' : 0 }} transition={{ duration: 1.6 }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[22%] bg-gradient-to-t from-[#3a1a3f]/70 to-transparent" />
    </section>
  )
}
