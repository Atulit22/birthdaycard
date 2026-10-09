import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { playSound } from '../../audio/useSound'
import { content } from '../../data/birthdayContent'
import { usePrefersReducedMotion } from '../../hooks/useCursor'

const RULED = 'repeating-linear-gradient(#fbf3e4 0 31px, #e0cfb2 31px 32px)'
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .36  0 0 0 0 .26  0 0 0 0 .2  0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

/** The little envelope that sits on the party table, leaning on the cake. It is meant to look like one of the gifts. */
export function TableEnvelope({ glow, onOpen }: { glow: boolean; onOpen: (rect: DOMRect) => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const f = content.final
  return (
    <button
      ref={ref}
      type="button"
      aria-label={`a small envelope, ${f.letterTag}`}
      onClick={() => ref.current && onOpen(ref.current.getBoundingClientRect())}
      className="hit group relative block w-full -rotate-[6deg] touch-manipulation outline-offset-4 transition-transform hover:-translate-y-1 hover:rotate-[-3deg] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
    >
      {glow && <span aria-hidden className="pointer-events-none absolute -inset-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(255,226,160,.55),transparent)]" style={{ animation: 'glowpulse 2.6s ease-in-out infinite' }} />}
      <svg viewBox="0 0 80 58" className="relative w-full drop-shadow-[0_3px_3px_rgba(0,0,0,.45)]" aria-hidden>
        <rect x="2" y="6" width="76" height="50" rx="3" fill="#ead7b6" />
        <path d="M2 9 L40 36 L78 9" stroke="#cdb48c" strokeWidth="1.6" fill="none" />
        <path d="M2 56 L30 30 M78 56 L50 30" stroke="#cdb48c" strokeWidth="1.2" />
        <path d="M2 6 L40 34 L78 6Z" fill="#f4e6c9" />
        <path d="M40 40 c-6 -5 -10 -8 -7 -11 c2 -2 5 -1 7 2 c2 -3 5 -4 7 -2 c3 3 -1 6 -7 11Z" fill="#b3202f" />
      </svg>
      <span className="absolute -right-[18%] top-[48%] origin-top-left rotate-[14deg] rounded-[2px] bg-paper px-[3px] font-hand leading-none text-wine shadow" style={{ fontSize: 'calc(var(--u) * .17)' }} aria-hidden>
        {f.letterTag}
      </span>
    </button>
  )
}

/** the letter itself: a real sheet of folded paper, handwritten, with a few doodles */
function Sheet({ onClose }: { onClose: () => void }) {
  const f = content.final
  const reduced = usePrefersReducedMotion()
  const paragraphs = f.letterParagraphs
  const closeBtn = useRef<HTMLButtonElement>(null)
  useEffect(() => closeBtn.current?.focus({ preventScroll: true }), [])
  const line = (i: number) => ({
    initial: { opacity: 0, y: 10, filter: 'blur(3px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.9, delay: reduced ? 0 : 0.9 + i * 0.55 },
  })
  return (
    <div className="relative w-[min(92vw,540px)]" onClick={(e) => e.stopPropagation()}>
      <div
        className="relative max-h-[80svh] touch-pan-y overflow-y-auto overscroll-contain rounded-[3px] px-7 pb-8 pt-9 text-ink shadow-[0_2px_2px_rgba(0,0,0,.3),0_30px_70px_-10px_rgba(0,0,0,.85)] sm:px-11"
        style={{ background: RULED }}
        role="dialog"
        aria-label="a handwritten letter"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50 mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
        {/* folds */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[34%] h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[68%] h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />
        {/* tape + doodles */}
        <span aria-hidden className="absolute -top-0 left-1/2 h-6 w-20 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] bg-gold/60" />
        <svg aria-hidden viewBox="0 0 40 40" className="absolute right-4 top-4 h-9 w-9 rotate-12 text-wine/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 34 C 6 24, 6 10, 14 9 C 18 8.5, 20 12, 20 14 C 20 12, 22 8.5, 26 9 C 34 10, 34 24, 20 34Z" />
        </svg>
        <svg aria-hidden viewBox="0 0 40 40" className="absolute bottom-14 right-6 h-8 w-8 -rotate-12 text-ink/20" fill="currentColor">
          <ellipse cx="20" cy="26" rx="8" ry="7" />
          <circle cx="9" cy="17" r="3.2" /><circle cx="16" cy="11" r="3.2" /><circle cx="24" cy="11" r="3.2" /><circle cx="31" cy="17" r="3.2" />
        </svg>

        <div className="relative">
          <motion.p {...line(0)} className="font-hand text-[2.1rem] leading-[32px] text-wine">
            {f.letterGreeting}
          </motion.p>
          {paragraphs.map((p, i) => (
            <motion.p key={i} {...line(i + 1)} className="mt-[32px] font-hand text-[1.5rem] leading-[32px] first:mt-0">
              {p}
            </motion.p>
          ))}
          <motion.p {...line(paragraphs.length + 1)} className="mt-[32px] text-right font-hand text-[1.7rem] leading-[32px] text-wine">
            {f.letterSign}
          </motion.p>
        </div>
      </div>
      <motion.button
        ref={closeBtn}
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.2 }}
        onClick={onClose}
        className="mx-auto mt-4 block rounded-full border border-cream/30 bg-ink/50 px-5 py-2 font-hand text-2xl text-cream/85 backdrop-blur transition hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        {f.letterClose}
      </motion.button>
    </div>
  )
}

/**
 * The letter, as an object in the world: the envelope lifts off the table toward the camera, opens, and the paper unfolds.
 * Closing it sends everything back where it came from. (The party underneath is dimmed by the scene, not replaced.)
 */
export function LetterOverlay({ from, onClose }: { from: DOMRect; onClose: () => void }) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<'fly' | 'open' | 'paper'>(reduced ? 'paper' : 'fly')
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    const a = window.setTimeout(() => setPhase('open'), 850)
    const b = window.setTimeout(() => {
      setPhase('paper')
      playSound('paperFlip')
    }, 1650)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [reduced])
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  // where the envelope is, relative to the middle of the stage — the object starts there and flies to the center
  const stage = box.current?.getBoundingClientRect()
  const sx = from.left + from.width / 2 - (stage ? stage.left + stage.width / 2 : window.innerWidth / 2)
  const sy = from.top + from.height / 2 - (stage ? stage.top + stage.height / 2 : window.innerHeight / 2)
  const s0 = Math.max(0.12, from.width / 240)

  return (
    <motion.div
      ref={box}
      className="absolute inset-0 z-[55] grid place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { delay: 0.55, duration: 0.4 } }}
      onClick={onClose}
    >
      <motion.div className="absolute inset-0 bg-[#080210]/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />

      {phase !== 'paper' && (
        <motion.div
          className="relative"
          initial={{ x: sx, y: sy, scale: s0, rotate: -6 }}
          animate={{ x: 0, y: 0, scale: 1, rotate: 0 }}
          exit={{ x: sx, y: sy, scale: s0, rotate: -6 }}
          transition={{ duration: reduced ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-[150px] w-[240px]" style={{ perspective: 700 }}>
            <div className="absolute inset-0 rounded-md bg-[#d6bd94] shadow-[0_24px_50px_-12px_rgba(0,0,0,.85)]" />
            <motion.div
              className="absolute inset-x-4 bottom-3 top-3 rounded-sm bg-paper"
              animate={{ y: phase === 'open' ? -48 : 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#f6ead6] to-[#e8d5b8] [clip-path:polygon(0_0,50%_54%,100%_0,100%_100%,0_100%)]" />
            <motion.div
              initial={false}
              animate={{ rotateX: phase === 'open' ? 180 : 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-x-0 top-0 h-[56%] bg-gradient-to-b from-[#f4b6c8] to-[#e48fae]"
              style={{ transformOrigin: 'top', clipPath: 'polygon(0 0,100% 0,50% 100%)', zIndex: phase === 'open' ? 0 : 20 }}
            />
            <div className={`absolute left-1/2 top-[40%] z-30 -translate-x-1/2 text-2xl transition-opacity ${phase === 'open' ? 'opacity-0' : ''}`} aria-hidden>
              ❤️
            </div>
          </div>
        </motion.div>
      )}

      {phase === 'paper' && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          exit={{ opacity: 0, y: 40, scale: 0.8, transition: { duration: 0.45 } }}
          transition={{ duration: reduced ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Sheet onClose={onClose} />
        </motion.div>
      )}
    </motion.div>
  )
}
