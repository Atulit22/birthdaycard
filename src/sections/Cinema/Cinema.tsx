import { AnimatePresence, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Popcorn } from '../../components/BirthdayWorld/art'
import { Cat } from '../../components/Cat/Cat'
import { Poppable } from '../../components/UI/Poppable'
import { Celebration } from '../../components/UI/Celebration'
import { StarField } from '../../components/UI/StarField'
import { VideoGift } from '../../components/Video/VideoGift'
import { content } from '../../data/birthdayContent'
import { eggText } from '../../data/easterEggs'
import { fx } from '../../fx'
import { usePrefersReducedMotion } from '../../hooks/useCursor'
import { useWhisperOnView } from '../../hooks/useWhisperOnView'
import { useWorld } from '../../state/DiscoveryContext'

const Bulbs = ({ n = 14 }: { n?: number }) => (
  <div className="flex justify-between px-1" aria-hidden>
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} className="bulb h-2 w-2 rounded-full bg-[#ffe9a0] shadow-[0_0_8px_2px_rgba(255,224,130,.8)]" />
    ))}
  </div>
)

const Curtain = ({ side, open }: { side: 'l' | 'r'; open: boolean }) => (
  <motion.div
    initial={false}
    animate={{ x: open ? (side === 'l' ? '-102%' : '102%') : 0 }}
    transition={{ duration: 1.8, ease: [0.65, 0, 0.25, 1] }}
    className={`absolute top-0 h-full w-1/2 ${side === 'l' ? 'left-0' : 'right-0'}`}
    style={{
      background:
        'repeating-linear-gradient(90deg, #5a0f1c 0 18px, #8c1c2c 18px 36px, #6e1424 36px 54px), linear-gradient(#000, #000)',
      boxShadow: side === 'l' ? '6px 0 24px rgba(0,0,0,.6)' : '-6px 0 24px rgba(0,0,0,.6)',
    }}
  />
)

/** The cinema: marquee → curtains part → "You found it." → your birthday movie → celebration. */
export function Cinema() {
  const { videoDone, markVideoDone, unlockFinal, discover } = useWorld()
  const reduced = usePrefersReducedMotion()
  const secRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const seen = useInView(stageRef, { amount: 0.4, once: true })
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(videoDone ? 3 : 0)
  const [party, setParty] = useState(0)
  const timers = useRef<number[]>([])
  useWhisperOnView(secRef, content.areaWhispers.cinema)

  useEffect(() => {
    if (!seen) return
    const t = window.setTimeout(() => setOpen(true), 500)
    return () => window.clearTimeout(t)
  }, [seen])
  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  const ended = () => {
    markVideoDone()
    setParty((p) => p + 1)
    fx.confetti({ x: 0.5, y: 0.7, count: 140, power: 16 })
    timers.current.push(window.setTimeout(() => fx.confetti({ x: 0.1, y: 0.9, count: 70, spread: 1, power: 17 }), 350))
    timers.current.push(window.setTimeout(() => fx.confetti({ x: 0.9, y: 0.9, count: 70, spread: 1, power: 17 }), 650))
    if (step < 3) {
      timers.current.push(window.setTimeout(() => setStep(1), 1700))
      timers.current.push(window.setTimeout(() => setStep(2), 4300))
      timers.current.push(window.setTimeout(() => setStep(3), 6600))
    }
    stageRef.current?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' })
  }

  const follow = () => {
    unlockFinal()
    window.setTimeout(() => document.getElementById('final')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }), 120)
  }

  const cin = content.cinema
  return (
    <section ref={secRef} id="cinema" className="relative overflow-hidden bg-gradient-to-b from-[#3a1a3f] via-[#2a0d18] to-[#120a14] px-4 pb-32 pt-28 sm:px-8">
      <StarField count={60} seed={33} height={1800} className="opacity-60" />
      <Celebration fireKey={party} />

      <div className="relative mx-auto max-w-4xl">
        {/* marquee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto max-w-2xl rounded-xl border-4 border-gold/80 bg-ink px-4 py-5 text-center shadow-[0_0_70px_rgba(226,182,89,.3)] sm:px-8"
        >
          <p className="mb-2 font-display text-[10px] uppercase tracking-[.45em] text-cream/50">area 07 · now showing</p>
          <Bulbs />
          <h2 className="my-4 font-display text-[clamp(1.6rem,6.2vw,3.4rem)] font-bold tracking-[.12em] text-gold [text-shadow:0_0_24px_rgba(226,182,89,.7)]">
            {cin.marquee}
          </h2>
          <Bulbs />
        </motion.div>
        <div className="mx-auto flex max-w-[22rem] justify-between sm:max-w-md" aria-hidden>
          <div className="h-10 w-3 bg-gradient-to-b from-gold/80 to-gold/20" />
          <div className="h-10 w-3 bg-gradient-to-b from-gold/80 to-gold/20" />
        </div>

        {/* ticket + popcorn */}
        <div className="relative mx-auto mt-4 flex max-w-xl items-end justify-between px-2 sm:px-8">
          <motion.div
            initial={{ rotate: -12, opacity: 0 }}
            whileInView={{ rotate: -7, opacity: 1 }}
            viewport={{ once: true }}
            className="relative w-36 rounded-md bg-paper px-4 py-3 text-center text-ink shadow-xl before:absolute before:-left-2 before:top-1/2 before:h-4 before:w-4 before:-translate-y-1/2 before:rounded-full before:bg-[#2a0d18] after:absolute after:-right-2 after:top-1/2 after:h-4 after:w-4 after:-translate-y-1/2 after:rounded-full after:bg-[#2a0d18]"
          >
            <p className="font-display text-[11px] font-bold tracking-[.3em] text-wine">{cin.ticket[0]}</p>
            <p className="font-hand text-3xl leading-none">{cin.ticket[1]}</p>
            <p className="mt-1 border-t border-dashed border-ink/30 pt-1 text-[10px] uppercase tracking-widest text-ink/50">{cin.ticket[2]}</p>
          </motion.div>
          <div className="relative h-[90px] w-[72px]">
            <Poppable
              label="a bucket of popcorn"
              lines={eggText.popcorn}
              onPop={(n) => {
                fx.confetti({ x: 0.5, y: 0.5, count: 18, power: 7, shapes: ['dot'], spread: 1.2 })
                if (n === 3) discover('popcorn')
              }}
              className="left-0 top-0"
            >
              <Popcorn size={64} />
            </Poppable>
          </div>
        </div>

        {/* the screen */}
        <div ref={stageRef} className="relative mt-16">
          <div className="mb-6 min-h-[5.5rem] text-center">
            <AnimatePresence>
              {open && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.9 }}>
                  <p className="font-hand text-3xl text-gold sm:text-4xl">{cin.found}</p>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0, duration: 1 }}
                    className="mt-1 font-display text-3xl font-bold italic text-cream sm:text-5xl"
                  >
                    {content.video.heading}
                  </motion.h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <VideoGift
              eyebrow={content.video.eyebrow}
              title={content.video.title}
              lines={content.video.lines}
              button={content.video.button}
              note={content.video.note}
              badge={content.video.badge}
              href={content.video.url}
              tinyEgg={content.video.tinyEgg}
              onOpen={ended}
            />
            {/* curtains */}
            <div className={`pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl transition-opacity duration-500 ${open ? 'opacity-0 delay-[1900ms]' : ''}`}>
              <Curtain side="l" open={open} />
              <Curtain side="r" open={open} />
            </div>
          </div>
        </div>

        {/* after the video */}
        <div className="mt-14 flex flex-col items-center text-center">
          <AnimatePresence>
            {step >= 1 && (
              <motion.div initial={{ opacity: 0, scale: 0.6, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
                <div style={{ animation: 'hop .7s ease-in-out 6' }}>
                  <Cat pose="sit" size={130} mood="happy" hat look={false} autoYawn={false} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-4 space-y-2">
            {step >= 1 && (
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl italic text-cream sm:text-3xl">
                {content.afterVideo.lines[0]}
              </motion.p>
            )}
            {step >= 2 && (
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-hand text-3xl text-blush sm:text-4xl">
                {content.afterVideo.lines[1]}
              </motion.p>
            )}
          </div>
          {step >= 3 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={follow}
              className="mt-8 rounded-full border border-gold bg-gold px-8 py-3 font-display text-lg text-ink shadow-[0_0_40px_rgba(226,182,89,.55)]"
            >
              {content.afterVideo.button}
            </motion.button>
          )}
        </div>
      </div>
    </section>
  )
}
