import { AnimatePresence, motion } from 'motion/react'
import { playSound } from '../../audio/useSound'
import { useEffect, useRef, useState } from 'react'
import { fx } from '../../fx'
import { useWorld } from '../../state/DiscoveryContext'

const GOAL = 5

interface Star {
  id: number
  x: number // start x (vw)
  y: number // start y (vh)
  dur: number
}

/**
 * The one tiny optional game: shooting stars cross the sky while you're in town.
 * Catch five of them. Fully optional — nothing is gated behind it.
 */
export function WishStars({ active }: { active: boolean }) {
  const { discover, found, say } = useWorld()
  const done = found.includes('wishes')
  const [star, setStar] = useState<Star | null>(null)
  const [caught, setCaught] = useState(0)
  const [trophy, setTrophy] = useState(false)
  const seen = useRef(false)
  const id = useRef(0)

  useEffect(() => {
    if (!active || done) return
    let t: number
    const spawn = () => {
      const fromRight = Math.random() > 0.5
      setStar({
        id: ++id.current,
        x: fromRight ? 70 + Math.random() * 25 : 5 + Math.random() * 25,
        y: 10 + Math.random() * 35,
        dur: 3.4 + Math.random() * 1.2,
      })
      if (!seen.current) {
        seen.current = true
        window.setTimeout(() => say('ooh. a wishing star. catch some?'), 700)
      }
      t = window.setTimeout(() => {
        setStar(null)
        t = window.setTimeout(spawn, 2500 + Math.random() * 2500)
      }, 4800)
    }
    t = window.setTimeout(spawn, 3500)
    return () => window.clearTimeout(t)
  }, [active, done, say])

  const catchIt = (x: number, y: number) => {
    setStar(null)
    playSound('sparkle')
    fx.confetti({ x: x / window.innerWidth, y: y / window.innerHeight, count: 18, power: 6, shapes: ['star', 'dot'] })
    const n = caught + 1
    setCaught(n)
    if (n >= GOAL) {
      setTrophy(true)
      fx.confetti({ x: 0.5, y: 0.5, count: 120 })
      discover('wishes')
      window.setTimeout(() => setTrophy(false), 5200)
    }
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[40] overflow-hidden">
        <AnimatePresence>
          {active && star && !done && (
            <motion.button
              key={star.id}
              aria-label="a wishing star"
              initial={{ left: `${star.x}vw`, top: `${star.y}vh`, opacity: 0 }}
              animate={{
                left: `${star.x > 50 ? star.x - 55 : star.x + 55}vw`,
                top: `${star.y + 32}vh`,
                opacity: [0, 1, 1, 0],
              }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: star.dur, ease: 'linear', opacity: { duration: star.dur, times: [0, 0.1, 0.85, 1] } }}
              onClick={(e) => catchIt(e.clientX, e.clientY)}
              className="pointer-events-auto absolute grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center"
            >
              <span
                className="block h-4 w-4 rounded-full bg-[#fff3cf]"
                style={{ boxShadow: '0 0 14px 6px rgba(255,224,150,.85), 40px -20px 22px -2px rgba(255,224,150,.35)', transform: star.x > 50 ? undefined : 'scaleX(-1)' }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {active && caught > 0 && !done && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-gold/40 bg-ink/75 px-4 py-1.5 font-hand text-xl text-cream backdrop-blur"
          >
            wishing stars{' '}
            <span className="text-gold">
              {'★'.repeat(caught)}
              {'☆'.repeat(GOAL - caught)}
            </span>
          </motion.div>
        )}
        {trophy && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="fixed left-1/2 top-20 z-[85] w-[min(22rem,90vw)] -translate-x-1/2 rounded-2xl border-2 border-gold bg-gradient-to-br from-wine to-plum p-4 text-center shadow-[0_0_40px_rgba(226,182,89,.5)]"
          >
            <div className="text-3xl">🏆</div>
            <p className="text-xs uppercase tracking-[.25em] text-gold">Achievement unlocked</p>
            <p className="font-display text-2xl text-cream">Birthday Girl</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
