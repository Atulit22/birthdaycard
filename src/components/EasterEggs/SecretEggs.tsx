import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { playSound } from '../../audio/useSound'
import { content } from '../../data/birthdayContent'
import { eggText } from '../../data/easterEggs'
import { fx } from '../../fx'
import { usePrefersReducedMotion } from '../../hooks/useCursor'
import { useWorld } from '../../state/DiscoveryContext'
import { Balloon, Moon } from '../BirthdayWorld/art'
import { pos, type Pos } from '../BirthdayWorld/spot'

/* The second layer of secrets. None of these have a "click me" hint on purpose.
   Documented (for the developer only) in docs/EASTER_EGGS.md. */

/** places where the cat has already dropped a hint this visit */
const hinted = new Set<string>()

const paper = 'rounded-lg bg-paper px-3 py-2 text-center text-ink shadow-2xl'

/** A little paper note that pops over something. */
function Note({ lines, className = '' }: { lines: string[]; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`${paper} w-56 ${className}`}
      style={{ rotate: -1.5 }}
    >
      <p className="font-hand text-2xl leading-none text-wine">{lines[0]}</p>
      {lines.slice(1).map((l) => (
        <p key={l} className="mt-1 font-hand text-xl leading-[1.1]">
          {l}
        </p>
      ))}
    </motion.div>
  )
}

/**
 * The moon in the first scene.
 * · tap it three times → it blinks
 * · once the sleepy cat has dreamed (chain: lamp → dream → moon) it glows, and one tap opens a letter
 */
export function SecretMoon({ className = '' }: { className?: string }) {
  const { discover, found } = useWorld()
  const [n, setN] = useState(0)
  const [blink, setBlink] = useState(0)
  const [letter, setLetter] = useState(false)
  const [text, setText] = useState<string | null>(null)
  const reduced = usePrefersReducedMotion()
  const dreamed = found.includes('dream')

  const tap = () => {
    if (dreamed) {
      const first = !found.includes('moonLetter')
      setLetter((l) => !l)
      if (first) {
        playSound('secretChord')
        discover('moonLetter')
      } else playSound('moonChime')
      return
    }
    const c = n + 1
    setN(c)
    playSound('moonChime')
    if (c % 3 === 0) {
      setBlink((b) => b + 1)
      setText(eggText.moonBlink)
      window.setTimeout(() => setText(null), 2600)
      discover('moon')
    }
  }

  return (
    <div className={`absolute z-20 ${className}`}>
      <button type="button" aria-label="the moon" onClick={tap} className="block touch-manipulation rounded-full outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
        <motion.div
          key={blink}
          animate={reduced ? undefined : { scaleY: blink ? [1, 0.12, 1] : 1 }}
          transition={{ duration: 0.45 }}
          style={dreamed ? { filter: 'drop-shadow(0 0 22px rgba(255,214,120,.85))', animation: reduced ? undefined : 'glowpulse 3.4s ease-in-out infinite' } : undefined}
        >
          <Moon size={150} className={dreamed ? 'opacity-95' : 'opacity-70'} />
        </motion.div>
      </button>
      <AnimatePresence>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute left-1/2 top-full w-max max-w-[60vw] -translate-x-1/2 font-hand text-xl text-cream/80"
          >
            {text}
          </motion.p>
        )}
        {letter && <Note key="l" lines={[...eggText.moonLetter]} className="absolute right-4 top-full z-30 mt-1 !w-64" />}
      </AnimatePresence>
    </div>
  )
}

/** Three balloons you can pop. The last one drops a note (chain: balloons → note → mouse). */
export function PopBalloons({ items }: { items: Array<{ at: Pos; color: string; size?: number; delay?: number; dur?: number }> }) {
  const { discover } = useWorld()
  const [gone, setGone] = useState<boolean[]>(() => items.map(() => false))

  const pop = (i: number, e: React.MouseEvent) => {
    if (gone[i]) return
    const next = gone.map((g, j) => g || j === i)
    setGone(next)
    playSound('balloonPop')
    fx.confetti({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight, count: 12, power: 6, shapes: ['dot'], spread: 1.4 })
    if (next.every(Boolean)) discover('balloons')
  }

  return (
    <>
      {items.map((b, i) => {
        if (gone[i]) return null
        const p = pos(b.at)
        return (
          <div key={i} className={p.className} style={p.style}>
            <button type="button" aria-label="a balloon" onClick={(e) => pop(i, e)} className="block touch-manipulation p-2 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
              <div className="floaty" style={{ animationDelay: `${b.delay ?? 0}s`, animationDuration: `${b.dur ?? 6}s` }}>
                <Balloon color={b.color} size={b.size ?? 34} />
              </div>
            </button>
          </div>
        )
      })}
    </>
  )
}

/** The note that fell out of the last balloon. Only exists once the balloons have been popped. */
export function FallenNote({ at }: { at: Pos }) {
  const { found, discover } = useWorld()
  const [open, setOpen] = useState(false)
  if (!found.includes('balloons')) return null
  const p = pos(at)
  return (
    <div className={p.className} style={p.style}>
      <motion.button
        type="button"
        aria-label="a folded note in the grass"
        initial={{ y: -80, opacity: 0, rotate: 40 }}
        animate={{ y: 0, opacity: 1, rotate: -14 }}
        transition={{ type: 'spring', stiffness: 90, damping: 11, delay: 0.4 }}
        onClick={() => {
          setOpen((o) => !o)
          playSound('paperRustle')
          discover('note')
        }}
        className="block touch-manipulation p-2 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        <span className="block h-6 w-5 bg-paper shadow-md [clip-path:polygon(0_0,100%_0,100%_78%,70%_100%,0_100%)]" />
      </motion.button>
      <AnimatePresence>{open && <Note lines={eggText.note} className="absolute bottom-full left-1/2 z-30 mb-1 -translate-x-1/2" />}</AnimatePresence>
    </div>
  )
}

/** A tiny mouse hole. Does nothing until you have read the note. */
export function MouseHole({ at }: { at: Pos }) {
  const { found, discover } = useWorld()
  const [out, setOut] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const knows = found.includes('note')
  const p = pos(at)

  const tap = () => {
    if (!knows) {
      playSound('tap')
      return
    }
    setOut(true)
    playSound('mouse')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOut(false), 2200)
    if (!found.includes('mouse')) {
      playSound('secretChord')
      discover('mouse')
    }
  }

  return (
    <div className={p.className} style={p.style}>
      <button type="button" aria-label="a tiny hole in the ground" onClick={tap} className="relative block touch-manipulation p-2 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
        <span
          className="block h-3 w-6 rounded-t-full bg-[#0c0610]"
          style={knows && !found.includes('mouse') ? { boxShadow: '0 0 0 1px rgba(226,182,89,.35), 0 0 10px 2px rgba(226,182,89,.3)' } : { boxShadow: '0 0 0 1px rgba(60,40,30,.6)' }}
        />
        <AnimatePresence>
          {out && (
            <motion.span initial={{ y: 10, opacity: 0 }} animate={{ y: -14, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-xl">
              🐭
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {out && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute bottom-full left-1/2 mb-6 w-max -translate-x-1/2 rounded-xl bg-cream px-2.5 py-1 font-hand text-xl leading-none text-ink shadow-lg">
            {eggText.mouse}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/** A tiny book on the shelf. Opening it starts the journal in the discoveries panel. */
export function SecretBook() {
  const { discover } = useWorld()
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        aria-label="a tiny book"
        onClick={() => {
          setOpen((o) => !o)
          playSound('paperRustle')
          discover('journal')
        }}
        className="mb-0.5 block touch-manipulation rounded-sm outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        <span className="flex h-11 w-6 items-center justify-center rounded-[2px] border border-[#1b0f26] bg-[#2f5a47] shadow-md" style={{ animation: 'nudge 9s ease-in-out 4s infinite' }}>
          <span className="rotate-90 whitespace-nowrap font-display text-[6px] uppercase tracking-[.15em] text-gold/80">field notes</span>
        </span>
      </button>
      <AnimatePresence>{open && <Note lines={eggText.book} className="absolute bottom-full right-0 z-30 mb-2" />}</AnimatePresence>
    </div>
  )
}

/** Three doodles in the scrapbook margins. Tap each one. */
export function Doodles() {
  const { discover } = useWorld()
  const [hit, setHit] = useState<boolean[]>([false, false, false])
  const tap = (i: number) => {
    if (hit[i]) return
    const next = hit.map((h, j) => h || j === i)
    setHit(next)
    playSound('sparkle')
    if (next.every(Boolean)) discover('doodles')
  }
  const base = 'absolute touch-manipulation p-3 font-hand transition-all duration-500'
  return (
    <>
      <button type="button" aria-label="a doodle" onClick={() => tap(0)} className={`${base} left-[4%] top-28 rotate-12 text-5xl ${hit[0] ? 'scale-110 text-wine/80' : 'text-wine/25'}`}>
        ✦
      </button>
      <button type="button" aria-label="a doodle" onClick={() => tap(1)} className={`${base} right-[6%] top-40 -rotate-12 text-6xl ${hit[1] ? 'scale-110 text-mauve/90' : 'text-mauve/30'}`}>
        ♡
      </button>
      <button type="button" aria-label="a doodle" onClick={() => tap(2)} className={`${base} bottom-20 left-[8%] -rotate-6 text-4xl ${hit[2] ? 'scale-110 text-wine/70' : 'text-wine/20'}`}>
        ~ ~ ~
      </button>
    </>
  )
}

/**
 * Quiet watchers:
 *  · "idle" — sit still for 45 seconds.
 *  · "return" — after the movie, scroll back to the very first scene.
 */
export function SecretWatchers() {
  const { entered, discover, found, finalUnlocked, say } = useWorld()
  const foundCount = useRef(found.length)
  foundCount.current = found.length

  useEffect(() => {
    if (!entered || found.includes('idle')) return
    let last = Date.now()
    const bump = () => (last = Date.now())
    const events = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }))
    const iv = window.setInterval(() => {
      if (!document.hidden && Date.now() - last > 45000) {
        discover('idle')
        window.clearInterval(iv)
      }
    }, 3000)
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump))
      window.clearInterval(iv)
    }
  }, [entered, found, discover])

  // a raised eyebrow, never a tutorial: if she lingers somewhere new without finding anything, the cat says a small thing (once per place)
  useEffect(() => {
    if (!entered) return
    const ids = ['town', 'corner', 'scrapbook', 'party', 'final']
    let cur = ''
    let timer = 0
    const check = () => {
      const mid = window.innerHeight * 0.5
      let now = ''
      for (const id of ids) {
        const r = document.getElementById(id)?.getBoundingClientRect()
        if (r && r.top <= mid && r.bottom > mid) now = id
      }
      if (now === cur) return
      cur = now
      window.clearTimeout(timer)
      const text = (content.hints as Record<string, string>)[now]
      if (!text || hinted.has(now)) return
      const before = foundCount.current
      timer = window.setTimeout(() => {
        if (foundCount.current === before && !document.hidden) {
          hinted.add(now)
          say(text, 4800)
        }
      }, 10000)
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => {
      window.removeEventListener('scroll', check)
      window.clearTimeout(timer)
    }
  }, [entered, say])

  useEffect(() => {
    if (!finalUnlocked || found.includes('return')) return
    let t = 0
    const check = () => {
      const r = document.getElementById('welcome')?.getBoundingClientRect()
      const here = !!r && r.top <= 0 && r.bottom > window.innerHeight * 0.6
      if (here && !t) t = window.setTimeout(() => discover('return'), 1500)
      else if (!here && t) {
        window.clearTimeout(t)
        t = 0
      }
    }
    window.addEventListener('scroll', check, { passive: true })
    return () => {
      window.removeEventListener('scroll', check)
      window.clearTimeout(t)
    }
  }, [finalUnlocked, found, discover])

  return null
}
