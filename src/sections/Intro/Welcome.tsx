import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { audio, playSound } from '../../audio/useSound'
import { PawPrint } from '../../components/BirthdayWorld/art'
import { Fireflies } from '../../components/BirthdayWorld/Ambient'
import { BirthdayCake } from '../../components/BirthdayWorld/BirthdayCake'
import { ClickyCat } from '../../components/Cat/ClickyCat'
import { SecretMoon } from '../../components/EasterEggs/SecretEggs'
import { Reveal } from '../../components/UI/Reveal'
import { StarField } from '../../components/UI/StarField'
import { content } from '../../data/birthdayContent'
import { eggText } from '../../data/easterEggs'
import { fx } from '../../fx'
import { usePrefersReducedMotion } from '../../hooks/useCursor'
import { useWorld } from '../../state/DiscoveryContext'

const SONG_MS = 14800

/** The cake. Tap it: the candles flare, it bounces, and a little music box plays Happy Birthday (once at a time). */
function Cake() {
  const w = content.welcome
  const { discover } = useWorld()
  const reduced = usePrefersReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [taps, setTaps] = useState(0)
  const [notes, setNotes] = useState<Array<{ id: number; x: number; ch: string }>>([])
  const btn = useRef<HTMLButtonElement>(null)
  const timer = useRef(0)
  const noteId = useRef(0)

  // little music notes drift up while the song plays
  useEffect(() => {
    if (!playing || reduced) return
    const iv = window.setInterval(() => {
      const id = ++noteId.current
      setNotes((n) => [...n.slice(-5), { id, x: 15 + Math.random() * 70, ch: Math.random() < 0.5 ? '🎵' : '🎶' }])
      window.setTimeout(() => setNotes((n) => n.filter((m) => m.id !== id)), 2800)
    }, 850)
    return () => window.clearInterval(iv)
  }, [playing, reduced])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const tap = () => {
    audio.unlock() // a tap is a gesture, so this is always allowed
    setTaps((t) => t + 1)
    playSound('cakeTap')
    playSound('flame')
    const r = btn.current?.getBoundingClientRect()
    fx.confetti({
      x: r ? (r.left + r.width / 2) / window.innerWidth : 0.5,
      y: r ? (r.top + r.height * 0.25) / window.innerHeight : 0.5,
      count: playing ? 10 : 30,
      power: 8,
      shapes: ['star', 'dot', 'heart'],
      spread: 1.2,
    })
    if (!playing) {
      playSound('happyBirthday')
      setPlaying(true)
      timer.current = window.setTimeout(() => setPlaying(false), SONG_MS)
      discover('cake')
    }
  }

  return (
    <div className="relative mt-4 flex flex-col items-center">
      <div className="pointer-events-none absolute left-1/2 top-[18%] h-48 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,200,130,.35),transparent)] blur-2xl" />
      <AnimatePresence>
        {notes.map((m) => (
          <motion.span
            key={m.id}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], y: -130, x: (m.x - 50) * 0.6, scale: 1 }}
            transition={{ duration: 2.8, ease: 'easeOut' }}
            className="pointer-events-none absolute top-[20%] z-20 text-2xl"
            style={{ left: `${m.x}%` }}
            aria-hidden
          >
            {m.ch}
          </motion.span>
        ))}
      </AnimatePresence>
      <button
        ref={btn}
        type="button"
        onClick={tap}
        aria-label="the birthday cake"
        className="relative touch-manipulation rounded-3xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        <motion.span
          key={taps}
          animate={reduced ? undefined : { y: taps ? [0, -16, 0, -6, 0] : 0, rotate: taps ? [0, -2, 2, 0] : 0, scale: taps ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.6 }}
          className="block"
        >
          <span style={{ animation: reduced ? undefined : 'floaty 4.6s ease-in-out infinite' }} className="block">
            <BirthdayCake size={240} playing={playing} reduced={reduced} />
          </span>
        </motion.span>
      </button>
      <p className="mt-1 h-7 font-hand text-2xl text-cream/60" aria-live="polite">
        {playing ? w.cakeSong : taps === 0 ? w.cakeHint : ''}
      </p>
    </div>
  )
}

/** AREA 01 — "Happy Birthday, Ishu ❤️", the cake, and the cat who introduces the world. */
export function Welcome() {
  const w = content.welcome
  const { discover } = useWorld()
  const [taps, setTaps] = useState(0)

  return (
    <section id="welcome" className="relative flex min-h-[100svh] flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-ink via-[#1b0f26] to-[#2a1540] px-6 pb-16 pt-24 text-center">
      <StarField count={110} seed={5} height={900} />
      <SecretMoon className="-right-8 top-16 md:right-[12%]" />
      <Fireflies count={8} seed={2} />

      <div className="relative z-10">
        <Reveal as="p" className="font-display text-sm uppercase tracking-[.4em] text-blush/80">
          area 01
        </Reveal>
        <Reveal as="p" delay={0.15} className="mt-4 font-hand text-3xl text-cream/70 sm:text-4xl">
          {w.eyebrow}
        </Reveal>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-display text-[clamp(2.2rem,9vw,4.6rem)] font-bold italic leading-none text-cream [text-shadow:0_0_30px_rgba(244,182,200,.4)]"
        >
          {w.greeting[0]}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.7, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => {
            const c = taps + 1
            setTaps(c)
            playSound('tap')
            if (c === 3) discover('nickname')
          }}
          className="mt-1 font-display text-[clamp(5rem,24vw,12rem)] font-bold italic leading-[.9] text-cream [text-shadow:0_0_50px_rgba(226,182,89,.6),0_5px_0_#8c1c2c]"
        >
          {eggText.nickname[taps % 3]}
          <motion.span
            className="ml-2 inline-block align-middle text-[.5em] [text-shadow:none]"
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            ❤️
          </motion.span>
          <span className="sr-only">{w.greeting[1]}</span>
        </motion.h1>
      </div>

      <Cake />

      <div className="relative z-10 mt-6 flex flex-col items-center gap-3">
        {w.lines.map((l, i) => (
          <Reveal key={l} delay={i * 0.4} className="font-display text-xl italic text-cream/85 sm:text-2xl">
            {l}
          </Reveal>
        ))}
      </div>

      <div className="relative z-10 mt-10 flex flex-col items-center">
        <ClickyCat size={150} />
        <div className="-mt-1 h-3 w-36 rounded-full bg-black/50 blur-md" />
        <div className="mt-8 flex flex-col items-center gap-1 opacity-70">
          <span className="font-hand text-xl text-cream">{w.scrollHint}</span>
          {[0, 1, 2].map((i) => (
            <PawPrint
              key={i}
              size={18}
              className="floaty"
              style={{ animationDelay: `${i * 0.25}s`, transform: `rotate(${180 + (i % 2 ? 14 : -14)}deg)`, opacity: 1 - i * 0.25 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
