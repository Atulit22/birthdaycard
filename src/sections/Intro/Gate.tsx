import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Cat } from '../../components/Cat/Cat'
import { Moon, Streetlight } from '../../components/BirthdayWorld/art'
import { StarField } from '../../components/UI/StarField'
import { content } from '../../data/birthdayContent'
import { useWorld } from '../../state/DiscoveryContext'

function Typed({ text, speed = 55 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= text.length) return
    const t = window.setTimeout(() => setN(n + 1), speed)
    return () => window.clearTimeout(t)
  }, [n, text, speed])
  return (
    <>
      {text.slice(0, n)}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-gold align-middle" style={{ height: '1em', opacity: n < text.length ? 1 : 0 }} />
    </>
  )
}

/** The very first thing she sees: a quiet street, a lamp, a cat that looks at her. */
export function Gate() {
  const { enter } = useWorld()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t1 = window.setTimeout(() => setStep(1), 1400)
    const t2 = window.setTimeout(() => setStep(2), 3600)
    const t3 = window.setTimeout(() => setStep(3), 6400)
    return () => [t1, t2, t3].forEach(window.clearTimeout)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-[radial-gradient(ellipse_at_50%_70%,#2a1236,#120a14_70%)]"
      initial={{ clipPath: 'circle(150% at 50% 70%)' }}
      exit={{ clipPath: 'circle(0% at 50% 70%)', transition: { duration: 1, ease: [0.7, 0, 0.3, 1] } }}
    >
      <StarField count={140} seed={11} height={1000} />
      <Moon size={90} className="absolute right-[10%] top-[8%] opacity-80" />

      {/* text */}
      <div className="absolute inset-x-0 top-[14%] z-10 px-6 text-center">
        <div className="mx-auto min-h-[7.5rem] max-w-xl">
          {step >= 1 && (
            <p className="font-hand text-5xl text-cream sm:text-6xl">
              <Typed text={content.gate.lines[0]} />
            </p>
          )}
          {step >= 2 && (
            <p className="mt-3 font-display text-lg italic text-blush sm:text-2xl">
              <Typed text={content.gate.lines[1]} speed={38} />
            </p>
          )}
        </div>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={step >= 3 ? { opacity: 1, y: 0 } : {}}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={enter}
          disabled={step < 3}
          className="mt-6 rounded-full border border-gold bg-gold/10 px-7 py-3 font-display text-lg tracking-wide text-gold shadow-[0_0_30px_rgba(226,182,89,.35)] backdrop-blur transition-colors hover:bg-gold hover:text-ink"
        >
          {content.gate.button}
        </motion.button>
      </div>

      {/* street */}
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#07040a] to-[#1a0f22]" />
      <div className="absolute bottom-[33%] left-0 right-0 h-px bg-white/5" />
      <div className="absolute bottom-[21%] left-1/2 -ml-[62px]" style={{ transform: 'translateX(-50%)' }}>
        <Streetlight size={80} />
      </div>
      <motion.div
        className="absolute bottom-[22%] left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.2 }}
      >
        <Cat size={140} blinkDelay={0.5} />
      </motion.div>
      <div className="absolute bottom-[18%] left-1/2 h-4 w-40 -translate-x-1/2 rounded-full bg-black/60 blur-md" />
    </motion.div>
  )
}
