import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { eggText } from '../../data/easterEggs'
import { useWorld } from '../../state/DiscoveryContext'
import { Cat, type CatPose } from './Cat'

/**
 * The cat you can poke. Poke it enough and it storms off,
 * then comes back in sunglasses. (Secret: "The cat has limits")
 */
export function ClickyCat({ size = 150, pose = 'sit', hat = false }: { size?: number; pose?: CatPose; hat?: boolean }) {
  const { discover, found } = useWorld()
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'annoyed' | 'gone'>('idle')
  const [text, setText] = useState<string | null>('')
  const timer = useRef(0)
  const shades = found.includes('cat')

  const say = (t: string, ms = 1800) => {
    setText(t)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setText(null), ms)
  }

  const poke = () => {
    if (phase !== 'idle') return
    const c = n + 1
    setN(c)
    const lines = eggText.catClicks
    if (c < lines.length) say(lines[c - 1])
    else if (c === lines.length) {
      say(lines[lines.length - 1], 2400)
      setPhase('annoyed')
      window.setTimeout(() => setPhase('gone'), 1300)
      window.setTimeout(() => {
        setPhase('idle')
        discover('cat')
        say('deal with it.', 2600)
      }, 4600)
    } else say(eggText.catAfter[(c - lines.length - 1) % eggText.catAfter.length])
  }

  return (
    <div className="relative inline-block" style={{ width: size }}>
      <AnimatePresence>
        {text && (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute -top-9 left-1/2 z-30 w-max -translate-x-1/2 rounded-2xl bg-cream px-3 py-1 font-hand text-xl text-ink shadow-lg"
          >
            {text}
            <span className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-cream" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase !== 'gone' ? (
          <motion.button
            key="cat"
            aria-label="pet the cat"
            onClick={poke}
            initial={{ x: '-90vw', rotate: -30 }}
            animate={{ x: 0, rotate: 0, y: phase === 'annoyed' ? [0, -6, 0, -6, 0] : 0 }}
            exit={{ x: '90vw', rotate: 720, transition: { duration: 0.9, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            whileTap={{ scale: 0.93, rotate: -3 }}
            className="block"
          >
            <Cat pose={pose} size={size} mood={phase === 'annoyed' ? 'annoyed' : 'calm'} shades={shades} hat={hat} />
          </motion.button>
        ) : (
          <motion.div
            key="brb"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="grid place-items-center pt-10"
            style={{ height: size * 1.2 }}
          >
            <div className="rotate-[-4deg] rounded bg-paper px-3 py-1.5 text-center font-hand text-2xl leading-none text-ink shadow-xl">
              brb.
              <div className="text-sm">(storming)</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
