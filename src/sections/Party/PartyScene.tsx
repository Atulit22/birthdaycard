import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { audio, playSound } from '../../audio/useSound'
import { Balloon, Bush, Cloud, Flower, GrassTuft, House, Lantern, Moon, Popcorn, Present, Rock, Tree } from '../../components/BirthdayWorld/art'
import { Fireflies } from '../../components/BirthdayWorld/Ambient'
import { BirthdayCake } from '../../components/BirthdayWorld/BirthdayCake'
import { Cat } from '../../components/Cat/Cat'
import { LetterOverlay, TableEnvelope } from '../../components/Party/LetterObject'
import { Hero, Ishu, Me, Turtle } from '../../components/Party/PartyCast'
import { StarField } from '../../components/UI/StarField'
import { fx } from '../../fx'
import { content } from '../../data/birthdayContent'
import { usePrefersReducedMotion } from '../../hooks/useCursor'
import { haptic } from '../../hooks/useTouch'
import { useWorld } from '../../state/DiscoveryContext'

/* AREA 08 — everyone comes to the party.
   One pinned "stage" while she scrolls through 340svh. Scroll position is the camera:
   wide shot → push in → hold on Ishu → (confetti, everyone cheers) → pull back → hold → "one last little thing...".
   Layers (background / middle / foreground) zoom by different amounts, which is what makes it feel deep.

   Sizes use --u (one "unit", scales with the screen) and --gy (where the ground line sits). */

const KEYS = [0, 0.14, 0.38, 0.52, 0.66, 0.84, 1]
const ZOOM = [1, 1.02, 1.5, 2.05, 2.05, 1.28, 1.2]
const CELEBRATE_AT = 0.66

const U = (k: number) => `calc(var(--u) * ${k})`

/** Something standing at the party: dx units from the middle, y units above the ground line. */
function At({ dx = 0, y = 0, w, z = 10, children, className = '', style }: { dx?: number; y?: number; w: number; z?: number; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`absolute ${className}`} style={{ left: `calc(50% + ${U(dx)})`, bottom: `calc(var(--gy) + ${U(y)})`, width: U(w), zIndex: z, transform: 'translateX(-50%)', ...style }}>
      {children}
    </div>
  )
}

/** a person (or rock) you can poke: they answer with a line, a sound, and a tiny bounce */
function Talk({ label, lines, sound = 'giggle', children }: { label: string; lines: string[]; sound?: 'giggle' | 'tap' | 'pop'; children: ReactNode }) {
  const { say, bubble } = useSay()
  const n = useRef(0)
  return (
    <div className="relative">
      {bubble}
      <button
        type="button"
        aria-label={label}
        onClick={() => {
          say(lines[n.current % lines.length], 2600)
          n.current += 1
          playSound(sound)
          haptic(8)
        }}
        className="block w-full touch-manipulation outline-offset-4 transition-transform active:scale-[.97]"
      >
        {children}
      </button>
    </div>
  )
}

/** a little speech bubble that goes away by itself */
function useSay() {
  const [text, setText] = useState<string | null>(null)
  const t = useRef(0)
  useEffect(() => () => window.clearTimeout(t.current), [])
  const say = (s: string, ms = 2400) => {
    setText(s)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setText(null), ms)
  }
  const bubble = (
    <AnimatePresence>
      {text && (
        <motion.p
          key={text}
          initial={{ opacity: 0, y: 6, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute -top-[18%] left-1/2 z-50 w-max max-w-[60vw] -translate-x-1/2 rounded-xl bg-cream px-2.5 py-1 text-center font-hand text-xl leading-none text-ink shadow-lg"
        >
          {text}
        </motion.p>
      )}
    </AnimatePresence>
  )
  return { say, bubble }
}

/** a deterministic confetti rain (the real explosion comes from the shared confetti layer) */
const RAIN = Array.from({ length: 34 }).map((_, i) => ({
  left: `${(i * 29 + 7) % 100}%`,
  delay: `${-((i * 1.37) % 11)}s`,
  dur: `${7 + ((i * 5) % 6)}s`,
  dx: `${((i * 13) % 70) - 35}px`,
  c: ['#f4b6c8', '#e2b659', '#b3202f', '#c9a6e8', '#fff3cf', '#7ec8dd'][i % 6],
  w: 5 + (i % 3) * 2,
}))

// strings of lights: bulbs placed along a sagging curve (percent of the strip)
const strand = (n: number, top: number, sag: number) =>
  Array.from({ length: n }).map((_, i) => {
    const t = (i + 0.5) / n
    return { x: t * 100, y: top + sag * 4 * t * (1 - t), c: ['#ffe9a0', '#f4b6c8', '#fff', '#ffb347'][i % 4], d: (i * 0.37) % 3 }
  })

export function PartyScene() {
  const ref = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const inView = useInView(stage, { amount: 0.6 })

  // the camera: each layer zooms by a different fraction of the move
  const layer = (k: number) => useTransform(p, KEYS, ZOOM.map((v) => 1 + (v - 1) * k)) // eslint-disable-line react-hooks/rules-of-hooks
  const zBg = layer(0.25)
  const zMid = layer(0.6)
  const zFg = layer(1)
  // everybody gradually turns to look at Ishu as the camera pushes in
  const glance = useTransform(p, [0.16, 0.5], [0, 1])
  const lkL = useTransform(glance, (v) => v) // for people on her left → look right
  const lkR = useTransform(glance, (v) => -v) // for people on her right → look left
  const leanL = useTransform(glance, (v) => v * 3)
  const leanR = useTransform(glance, (v) => v * -3)
  const lightsFade = useTransform(p, [0.88, 1], [0, 1])
  const cueOpacity = useTransform(p, [0.86, 0.95], [0, 1])
  const hintOpacity = useTransform(p, [0, 0.06], [0.7, 0])
  const fired = useRef(false)

  const [cele, setCele] = useState(false)
  const [burst, setBurst] = useState(0) // bumped to restart one-shot moves (spin, flip)
  const [cueOn, setCueOn] = useState(false)
  const level = useRef(0)
  const [letter, setLetter] = useState<{ rect: DOMRect } | null>(null)
  const [letterSeen, setLetterSeen] = useState(false)
  const letterRef = useRef(false)
  const [focus, setFocus] = useState('50% 60%') // where the camera leans in when the letter opens (kept after closing so it eases back out the same way)

  const celebrate = () => {
    setCele(true)
    setBurst((b) => b + 1)
    audio.setPartyLevel(2)
    level.current = 2
    playSound('cheer')
    fx.confetti({ x: 0.5, y: 0.55, count: 170, power: 17, spread: 1.3 })
    for (const [d, x, y] of [[250, 0.2, 0.8], [450, 0.8, 0.8], [700, 0.5, 0.3]] as const) {
      window.setTimeout(() => {
        playSound('popper')
        fx.confetti({ x, y, count: 70, power: 15, spread: 1.1 })
      }, d)
    }
    window.setTimeout(() => playSound('clap'), 600)
    window.setTimeout(() => playSound('giggle'), 1500)
  }

  // the letter: lift the envelope toward the camera; the party dims and goes quiet behind it, then comes back
  // NOTE: opening the letter never touches the page's scrolling (no overflow/position changes, no body classes, no scroll jumps)
  const openLetter = (rect: DOMRect) => {
    letterRef.current = true
    // the "camera" leans in toward where the envelope is on the stage
    const s = stage.current?.getBoundingClientRect()
    if (s) setFocus(`${rect.left + rect.width / 2 - s.left}px ${rect.top + rect.height / 2 - s.top}px`)
    setLetter({ rect })
    setLetterSeen(true)
    audio.setPartyLevel(4)
    playSound('envelope')
    playSound('sparkle')
    fx.confetti({ x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight, count: 10, power: 4, shapes: ['star'], spread: 1.4 })
  }
  const closeLetter = () => {
    if (!letterRef.current) return
    letterRef.current = false
    setLetter(null)
    audio.setPartyLevel(level.current)
    // nothing was reset — and everyone is happy again
    window.setTimeout(() => {
      playSound('cheer')
      fx.confetti({ x: 0.5, y: 0.6, count: 90, power: 14, spread: 1.2 })
      setBurst((b) => b + 1)
    }, 650)
  }

  useMotionValueEvent(p, 'change', (v) => {
    if (reduced) return
    if (v >= CELEBRATE_AT && !fired.current) {
      fired.current = true
      celebrate()
    }
    const want = cele || v >= CELEBRATE_AT ? (v > 0.9 ? 3 : 2) : v > 0.3 ? 1 : 0
    if (want !== level.current) {
      level.current = want
      if (!letterRef.current) audio.setPartyLevel(want)
    }
    setCueOn(v > 0.9)
  })
  // reduced motion: no camera — just celebrate once she is looking at it
  useEffect(() => {
    if (!reduced || !inView || fired.current) return
    const t = window.setTimeout(() => {
      fired.current = true
      celebrate()
      setCueOn(true)
    }, 1200)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, inView, cele])
  useEffect(() => () => audio.setPartyLevel(0), [])

  // the little repeating things: Squirtle's spin, the cat's hop
  useEffect(() => {
    if (!cele || reduced) return
    const iv = window.setInterval(() => setBurst((b) => b + 1), 4200)
    return () => window.clearInterval(iv)
  }, [cele, reduced])

  const lights = useMemo(() => [strand(17, 6, 30), strand(13, 20, 22)], [])
  const flags = useMemo(() => Array.from({ length: 13 }).map((_, i) => ({ t: (i + 0.5) / 13, c: ['#b3202f', '#e2b659', '#f4b6c8', '#8a6aa8', '#f6ead6'][i % 5] })), [])
  const origin = `50% calc(100% - var(--gy) - ${U(4.7)})`

  return (
    <section ref={ref} id="party" className="relative" style={{ height: reduced ? 'auto' : '340svh' }}>
      {/* the scrapbook's paper ends here (a torn edge that scrolls away) */}
      <svg aria-hidden className="pointer-events-none absolute -top-px left-0 z-[60] w-full text-paper" viewBox="0 0 1440 60" preserveAspectRatio="none" height="40">
        <path fill="currentColor" d="M0 0H1440V20 L1400 34 1352 18 1300 38 1248 22 1190 40 1130 20 1070 36 1010 18 950 38 890 22 830 40 770 20 710 38 650 18 590 36 530 22 470 40 410 20 350 38 290 20 230 38 170 22 110 36 50 18 0 34Z" />
      </svg>

      <div
        ref={stage}
        className="sticky top-0 h-[100svh] overflow-hidden bg-[#0c0616]"
        style={{ ['--u' as string]: 'min(12.5vw, 11svh)', ['--gy' as string]: '15%' }}
      >
        {/* everything in the party sits inside this, so the letter can soften and darken it all at once */}
        <motion.div className="absolute inset-0" style={{ transformOrigin: focus }} animate={{ filter: letter ? 'blur(2.5px) brightness(.55)' : 'blur(0px) brightness(1)', scale: letter ? 1.14 : 1 }} transition={{ duration: 0.9, ease: 'easeInOut' }}>
        {/* ───────────── BACKGROUND ───────────── */}
        <motion.div className="absolute inset-0" style={{ scale: reduced ? 1 : zBg, transformOrigin: origin }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(#0c0616 0%, #241039 34%, #4f2152 58%, #8a3a62 76%, #d0687a 90%)' }} />
          <StarField count={150} seed={88} height={900} />
          {/* the moon */}
          <div className="absolute" style={{ left: '9%', top: '5%', width: U(3.4) }}>
            <div className="absolute -inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(255,236,190,.35),transparent)]" />
            <Moon size={400} className="relative h-auto w-full" />
          </div>
          <ReynaEye />
          {[
            { l: '30%', t: '10%', s: 3.4, d: 0 },
            { l: '62%', t: '15%', s: 4.2, d: 2 },
            { l: '84%', t: '8%', s: 2.8, d: 4 },
          ].map((c, i) => (
            <div key={i} className="floaty absolute opacity-40" style={{ left: c.l, top: c.t, width: U(c.s), animationDelay: `${c.d}s`, animationDuration: '14s' }}>
              <Cloud size={400} tone="#c9a6e8" className="h-auto w-full" />
            </div>
          ))}
          {/* far-away hills and houses with warm windows */}
          <svg aria-hidden className="absolute inset-x-0 w-full" style={{ bottom: `calc(var(--gy) + ${U(0.4)})`, height: U(2.2) }} viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M0 20 V12 Q12 3 26 10 T52 8 T78 10 T100 6 V20Z" fill="#26123a" />
          </svg>
          {[-5.6, -3.7, 3.9, 5.7].map((dx, i) => (
            <At key={i} dx={dx} y={0.55} w={i % 2 ? 1.5 : 1.15} z={1} style={{ opacity: 0.9 }}>
              <House size={300} lit wall={i % 2 ? '#4a2a5a' : '#3c2250'} roof="#1e0f2c" className="h-auto w-full" />
            </At>
          ))}
        </motion.div>

        {/* ───────────── MIDDLE ───────────── */}
        <motion.div className="absolute inset-0" style={{ scale: reduced ? 1 : zMid, transformOrigin: origin }}>
          <At dx={-4.6} y={0.4} w={2.4} z={2}>
            <Tree size={300} canopy="#3a2a5c" light="#4d3a78" trunk="#241830" className="h-auto w-full" />
          </At>
          <At dx={4.8} y={0.3} w={2.2} z={2}>
            <Tree size={300} canopy="#e89ab4" light="#f6bfd0" trunk="#4a2c3a" className="h-auto w-full" />
          </At>
          <At dx={-3.0} y={0.3} w={1.5} z={3}>
            <Bush size={300} color="#2f5a47" light="#43745c" className="h-auto w-full" />
          </At>
          {/* lantern posts */}
          {[-3.7, 3.7].map((dx) => (
            <At key={dx} dx={dx} y={0.2} w={0.7} z={4}>
              <div className="mx-auto h-[calc(var(--u)*1.3)] w-[3px] translate-y-[calc(var(--u)*.5)] bg-[#241830]" />
              <div className="-mt-[calc(var(--u)*1.9)] flex justify-center">
                <Lantern lit size={200} className="h-auto w-[calc(var(--u)*.7)]" />
              </div>
            </At>
          ))}

          {/* string lights + bunting across the top */}
          <div className="absolute inset-x-0 top-0 h-[30%]" aria-hidden>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 6 Q50 66 100 6" fill="none" stroke="#2a1d33" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
              <path d="M0 20 Q50 64 100 20" fill="none" stroke="#2a1d33" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            </svg>
            {lights.flat().map((b, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: 'calc(var(--u) * .13)',
                  height: 'calc(var(--u) * .13)',
                  background: b.c,
                  boxShadow: `0 0 calc(var(--u) * .22) calc(var(--u) * .05) ${b.c}`,
                  animation: reduced ? undefined : `bulb ${2.4 + b.d}s ease-in-out ${b.d}s infinite`,
                }}
              />
            ))}
            {flags.map((f, i) => (
              <Flag key={i} t={f.t} color={f.c} rawr={i === 8} />
            ))}
          </div>
          <Fireflies count={14} seed={31} />
        </motion.div>

        {/* ───────────── FOREGROUND ───────────── */}
        <motion.div className="absolute inset-0" style={{ scale: reduced ? 1 : zFg, transformOrigin: origin }}>
          {/* ground */}
          <div className="absolute inset-x-0 bottom-0 z-[1]" style={{ height: `calc(var(--gy) + ${U(1.5)})`, background: 'linear-gradient(#34204a, #1b0f26 60%, #120a1a)' }}>
            <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#4a6a50]/60 to-transparent" />
          </div>
          {[-5, -3.2, -1.1, 1.3, 3.4, 5.1].map((dx, i) => (
            <At key={i} dx={dx} y={i % 2 ? -0.35 : -0.1} w={0.5} z={5}>
              {i % 2 ? <Flower size={80} color={['#f4b6c8', '#e2b659', '#c9a6e8'][i % 3]} className="h-auto w-full" /> : <GrassTuft size={80} className="h-auto w-full" />}
            </At>
          ))}

          {/* Ishu — in the middle of everything */}
          <At dx={0} y={2.2} w={2.9} z={10}>
            <Sparkles on={cele} />
            <div style={{ ['--bh' as string]: '-3px', animation: reduced ? undefined : `bodyBob ${cele ? 0.55 : 2.4}s ease-in-out infinite` }}>
              <Talk label="Ishu" lines={content.partyTalk.ishu}>
                <Ishu celebrating={cele} className="h-auto w-full" />
              </Talk>
            </div>
          </At>

          {/* me — right beside her, clapping */}
          <At dx={-2.55} y={2.1} w={2.7} z={9}>
            <Person lk={lkL} lean={leanL} bob={1.7} delay={0.4} cele={cele}>
              <Talk label="the guy who made this" lines={content.partyTalk.me} sound="tap">
                <Me celebrating={cele} className="h-auto w-full" />
              </Talk>
            </Person>
          </At>

          {/* the hanging guest */}
          <HangingHero cele={cele} burst={burst} lk={lkR} reduced={reduced} />

          {/* the table */}
          <Table cele={cele} reduced={reduced} />
          <At dx={-1.08} y={2.3} w={0.68} z={27}>
            <TableEnvelope glow={cele && !letterSeen} onOpen={openLetter} />
          </At>

          {/* in front: gifts, the shades cat, the turtle, a rock with feelings, the speaker */}
          <At dx={-0.1} y={-0.55} w={2.3} z={32}>
            <div className="flex items-end justify-center gap-1">
              <Present size={200} box="#2b1a3a" lid="#1b0f26" ribbon="#b3202f" className="h-auto w-[34%]" />
              <Present size={200} box="#b3202f" lid="#8c1c2c" ribbon="#e2b659" open={cele} className="h-auto w-[44%]" />
              <Present size={200} box="#e2b659" lid="#c9962f" ribbon="#f4b6c8" className="h-auto w-[30%]" />
            </div>
          </At>
          <At dx={-3.05} y={-0.4} w={1.45} z={33}>
            <Person lk={lkL} lean={leanL} bob={2.1} delay={1} cele={cele} hop={cele}>
              <Cat pose="sit" size={200} shades look={false} autoYawn={false} mood={cele ? 'happy' : 'calm'} className="h-auto w-full" />
            </Person>
          </At>
          <At dx={2.35} y={-0.75} w={2.1} z={34}>
            <TurtleGuest lk={lkR} lean={leanR} cele={cele} burst={burst} reduced={reduced} />
          </At>
          <At dx={4.05} y={-0.15} w={0.95} z={31}>
            <div style={{ animation: reduced ? undefined : 'wobble 3.2s ease-in-out infinite', transformOrigin: '50% 100%' }}>
              <Talk label="a rock with a party hat" lines={content.partyTalk.rock} sound="pop">
                <Rock size={200} mood={cele ? 'cry' : 'plain'} className="h-auto w-full" />
              </Talk>
            </div>
            <span className="absolute -top-[22%] left-[8%] w-[84%]" aria-hidden>
              <svg viewBox="0 0 40 26" className="w-full"><path d="M4 22 L20 2 L36 22Z" fill="#e2b659" /><circle cx="20" cy="2" r="3" fill="#f4b6c8" /></svg>
            </span>
          </At>
          <Speaker />

          {/* the camera's vignette lives inside the foreground so it zooms with the people */}
        </motion.div>

        </motion.div>

        {/* ───────────── ABOVE THE CAMERA ───────────── */}
        {!reduced && (
          <div className="pointer-events-none absolute inset-0 z-[40] overflow-hidden" aria-hidden>
            {RAIN.slice(0, cele ? 34 : 9).map((c, i) => (
              <span key={i} className="absolute top-0 block rounded-[1px]" style={{ left: c.left, width: c.w, height: c.w * 1.6, background: c.c, opacity: 0, animation: `confFall ${c.dur} linear ${c.delay} infinite`, ['--dx' as string]: c.dx } as CSSProperties} />
            ))}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 z-[41]" style={{ boxShadow: 'inset 0 0 18vmin 4vmin rgba(8,3,14,.7)' }} aria-hidden />
        <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-[42] h-[28%] bg-gradient-to-t from-[#3a1a3f] to-transparent" style={{ opacity: lightsFade }} aria-hidden />

        <AnimatePresence>
          {cele && (
            <motion.p
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.5 }}
              className="pointer-events-none absolute inset-x-0 top-[9%] z-[45] px-4 text-center font-display text-[clamp(1.9rem,8.5vw,4.6rem)] font-bold italic leading-none text-cream [text-shadow:0_0_36px_rgba(244,182,200,.8),0_0_80px_rgba(226,182,89,.55),0_3px_0_#8c1c2c]"
            >
              HAPPY BIRTHDAY, ISHU ❤️
            </motion.p>
          )}
        </AnimatePresence>

        <motion.p style={{ opacity: reduced ? 0.6 : hintOpacity }} className="pointer-events-none absolute inset-x-0 top-4 z-[45] text-center font-display text-xs uppercase tracking-[.4em] text-cream/70">
          area 08
        </motion.p>

        <AnimatePresence>{letter && <LetterOverlay key="letter" from={letter.rect} onClose={closeLetter} />}</AnimatePresence>

        {!cele && !reduced && (
          <motion.p style={{ opacity: hintOpacity }} className="pointer-events-none absolute inset-x-0 bottom-5 z-[45] text-center font-hand text-xl text-cream/70">
            keep scrolling ↓
          </motion.p>
        )}

        <motion.div style={{ opacity: reduced ? (cueOn ? 1 : 0) : cueOpacity }} className={`absolute inset-x-0 bottom-6 z-[46] flex justify-center px-4 ${letter ? 'invisible' : ''}`}>
          <button
            type="button"
            tabIndex={cueOn ? 0 : -1}
            onClick={() => {
              playSound('whooshSoft')
              document.getElementById('final')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
            }}
            className="rounded-full border border-gold/50 bg-ink/60 px-6 py-3 font-hand text-2xl text-cream backdrop-blur transition hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            {content.final.partyCue}
          </button>
        </motion.div>
      </div>
    </section>
  )
}

/** a guest: bobs on their own rhythm and leans toward the middle as the camera pushes in */
function Person({ children, lk, lean, bob, delay = 0, cele, hop = false }: { children: ReactNode; lk: MotionValue<number>; lean: MotionValue<number>; bob: number; delay?: number; cele: boolean; hop?: boolean }) {
  return (
    <motion.div className="origin-bottom" style={{ ['--lk' as string]: lk, rotate: lean } as never}>
      <div style={{ ['--bh' as string]: cele ? '-9px' : '-4px', ['--hh' as string]: '-22px', animation: hop ? `hopParty .7s ease-in-out ${delay}s 3` : `bodyBob ${cele ? 0.5 : bob}s ease-in-out ${delay}s infinite` }}>{children}</div>
    </motion.div>
  )
}

/** the little turtle: always dancing; five taps and he gets a very big idea */
function TurtleGuest({ lk, lean, cele, burst, reduced }: { lk: MotionValue<number>; lean: MotionValue<number>; cele: boolean; burst: number; reduced: boolean }) {
  const { discover, found } = useWorld()
  const { say, bubble } = useSay()
  const [n, setN] = useState(0)
  const [spin, setSpin] = useState(0)
  // if the flags are still unexplored a while after the big moment, the turtle drops a hint
  useEffect(() => {
    if (!cele || found.includes('partyRawr')) return
    const t = window.setTimeout(() => say(content.hints.turtle, 3600), 9000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cele])
  const cool = n >= 5
  return (
    <div className="relative">
      {bubble}
      <button
        type="button"
        aria-label="a little blue turtle, dancing"
        onClick={() => {
          const c = n + 1
          setN(c)
          setSpin((s) => s + 1)
          playSound(c === 5 ? 'splash' : 'giggle')
          if (c === 5) {
            say('squirtle squad.', 2600)
            fx.confetti({ x: 0.7, y: 0.75, count: 40, power: 12, shapes: ['dot'], spread: 1.1 })
            discover('squirtleDance')
          }
        }}
        className="block w-full touch-manipulation outline-offset-4"
      >
        <motion.div className="origin-bottom" style={{ ['--lk' as string]: lk, rotate: lean } as never}>
          <div style={{ ['--hh' as string]: cele ? '-34px' : '-16px', animation: reduced ? undefined : `hopParty ${cele ? 0.62 : 1.2}s ease-in-out infinite` }}>
            <div key={`${burst}-${spin}`} style={{ animation: !reduced && (burst > 0 || spin > 0) ? 'spinJump 1.1s ease-in-out 1' : undefined, transformOrigin: '50% 60%' }}>
              <Turtle celebrating={cele || spin > 0} shades={cool} className="h-auto w-full" />
            </div>
          </div>
        </motion.div>
      </button>
    </div>
  )
}

/** The guest who prefers the ceiling. He hangs from the string lights; at the big moment he does a flip. */
function HangingHero({ cele, burst, lk, reduced }: { cele: boolean; burst: number; lk: MotionValue<number>; reduced: boolean }) {
  const { discover } = useWorld()
  const { say, bubble } = useSay()
  const [flips, setFlips] = useState(0)
  const go = flips + (cele ? burst : 0)
  return (
    <div className="absolute z-[8]" style={{ left: `calc(50% + ${U(2.9)})`, top: '10%', width: U(1.5), transform: 'translateX(-50%)' }}>
      <div style={{ transformOrigin: '50% 0', animation: reduced ? undefined : 'ropeSwing 4.8s ease-in-out infinite' }}>
        <div className="absolute bottom-full left-1/2 h-[40svh] w-px -translate-x-1/2 bg-white/55" aria-hidden />
        <div className="relative">
          {bubble}
          <button
            type="button"
            aria-label="someone hanging upside down from the lights"
            onClick={() => {
              setFlips((f) => f + 1)
              playSound('giggle')
              say('just hanging out.', 2400)
              discover('hangingOut')
            }}
            className="block w-full touch-manipulation outline-offset-4"
          >
            <motion.div style={{ ['--lk' as string]: lk } as never}>
              <div key={go} style={{ transform: 'rotate(180deg)', transformOrigin: '50% 50%', animation: !reduced && go > 0 ? 'heroFlip 1s ease-in-out 1' : undefined }}>
                <Hero celebrating={cele} className="h-auto w-full" />
              </div>
            </motion.div>
          </button>
        </div>
      </div>
    </div>
  )
}

/** The party table: cake, candles, gifts, treats, popcorn — and a mouse with a very small sign. */
function Table({ cele, reduced }: { cele: boolean; reduced: boolean }) {
  const { discover, say: whisper } = useWorld()
  const { say, bubble } = useSay()
  const [taps, setTaps] = useState(0)
  const [lit, setLit] = useState(true)
  const relight = useRef(0)
  useEffect(() => () => window.clearTimeout(relight.current), [])
  const blowOut = () => {
    if (!lit) return
    setLit(false)
    haptic(12)
    playSound('blow')
    discover('wish')
    whisper(content.final.wishDone, 4200)
    relight.current = window.setTimeout(() => {
      setLit(true)
      playSound('sparkle')
    }, 5500)
  }
  const stolen = taps >= 3
  return (
    <>
      {/* the cloth */}
      <At dx={0} y={0} w={7} z={20}>
        <div className="relative" style={{ height: U(2.3) }}>
          <div className="absolute inset-0 rounded-t-md bg-[repeating-linear-gradient(90deg,#8c1c2c_0_var(--u),#9d2236_var(--u)_calc(var(--u)*2))] shadow-[0_-4px_0_#e2b659_inset]" />
          <div className="absolute inset-x-0 -bottom-[calc(var(--u)*.2)] h-[calc(var(--u)*.4)] bg-[radial-gradient(circle_at_50%_0,#8c1c2c_62%,transparent_64%)] [background-size:calc(var(--u)*.5)_100%]" />
          <div className="absolute inset-x-0 top-0 h-[calc(var(--u)*.14)] rounded-t-md bg-[#f6ead6]" />
          <svg aria-hidden className="absolute left-1/2 top-[34%] w-[calc(var(--u)*.6)] -translate-x-1/2 opacity-70" viewBox="0 0 24 22"><path d="M12 21 C 1 12, 4 2, 12 7 C 20 2, 23 12, 12 21Z" fill="#f4b6c8" /></svg>
        </div>
      </At>

      {/* what's on it */}
      <At dx={0} y={2.3} w={1.7} z={25}>
        <div className="relative">
          <div className="absolute -inset-x-[40%] -top-[10%] bottom-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(255,210,140,.5),transparent)] blur-md" />
          <button type="button" aria-label="the birthday cake — blow out the candles?" onClick={blowOut} className="hit block w-full touch-manipulation outline-offset-4">
            <BirthdayCake size={400} playing={cele && lit} lit={lit} reduced={reduced} />
          </button>
          {/* a slice you'd notice missing */}
          {!stolen && <span aria-hidden className="absolute bottom-[10%] right-[18%] h-[12%] w-[14%] bg-[#fbf3e4] opacity-0" />}
          {stolen && (
            <span aria-hidden className="absolute bottom-[6%] right-[16%] h-[26%] w-[18%] origin-bottom-right rotate-[-8deg] rounded-sm bg-[#1b1220]" />
          )}
        </div>
      </At>
      {/* cupcakes */}
      {[-1.85, -2.2].map((dx, i) => (
        <At key={i} dx={dx} y={2.3} w={0.42} z={25}>
          <span className="mx-auto block h-[calc(var(--u)*.17)] w-full rounded-t-full" style={{ background: ['#f4b6c8', '#e2b659'][i] }} />
          <span className="mx-auto block h-[calc(var(--u)*.2)] w-[80%] rounded-b-[3px] bg-[#8c1c2c]" />
        </At>
      ))}
      <At dx={-2.8} y={2.3} w={0.7} z={25}>
        <Present size={160} className="h-auto w-full" />
      </At>
      <At dx={-3.25} y={2.3} w={0.45} z={25}>
        <Popcorn size={120} className="h-auto w-full" />
      </At>
      {/* balloons tied to the table */}
      {[
        { dx: -3.35, c: '#b3202f', h: 3.2, d: 0 },
        { dx: -3.0, c: '#e2b659', h: 3.8, d: 0.7 },
        { dx: 3.2, c: '#f4b6c8', h: 3.5, d: 0.3 },
        { dx: 3.55, c: '#8a6aa8', h: 3.0, d: 1.1 },
      ].map((b, i) => (
        <At key={i} dx={b.dx} y={2.3} w={0.62} z={8}>
          <span className="absolute bottom-0 left-1/2 w-px bg-white/40" style={{ height: U(b.h - 0.8) }} />
          <div className="floaty" style={{ transform: `translateY(calc(var(--u) * -${b.h}))`, animationDelay: `${b.d}s`, animationDuration: '5.5s' }}>
            <Balloon color={b.c} size={120} className="h-auto w-full" />
          </div>
        </At>
      ))}
      {/* the mouse */}
      <At dx={1.3} y={2.3} w={0.55} z={26}>
        <div className="relative" style={{ animation: reduced ? undefined : 'bodyBob 2.7s ease-in-out infinite', ['--bh' as string]: '-3px' } as CSSProperties}>
          <span className="block text-center leading-none" style={{ fontSize: U(0.5) }} aria-hidden>
            🐭
          </span>
          <span className="absolute -right-[60%] -top-[10%] rotate-6 whitespace-nowrap rounded-[2px] bg-paper px-[3px] font-hand leading-none text-ink" style={{ fontSize: U(0.2) }} aria-hidden>
            still here
          </span>
        </div>
      </At>

      {/* the cat, up on the table, looking at the cake */}
      <At dx={2.4} y={2.3} w={1.35} z={26}>
        <div className="relative">
          {bubble}
          <button
            type="button"
            aria-label="a black cat sitting very innocently next to the cake"
            onClick={() => {
              const c = taps + 1
              setTaps(c)
              if (c === 1) playSound('catPoke')
              if (c === 2) say('(not looking at the cake)', 2200)
              if (c === 3) {
                playSound('crunch')
                say('...what cake.', 2800)
                discover('cakeThief')
              }
              if (c > 3) playSound('catMeow')
            }}
            className="block w-full touch-manipulation outline-offset-4"
          >
            <div style={{ animation: cele && !reduced ? 'hopParty .7s ease-in-out .3s 3' : undefined, ['--hh' as string]: '-18px' } as CSSProperties}>
              <Cat pose="sit" size={200} hat mood={cele || stolen ? 'happy' : 'calm'} autoYawn={false} className="h-auto w-full" />
            </div>
          </button>
        </div>
      </At>
    </>
  )
}

/** a flag on the bunting; one of them is not like the others */
function Flag({ t, color, rawr }: { t: number; color: string; rawr: boolean }) {
  const { discover } = useWorld()
  const [roar, setRoar] = useState(false)
  const y = 20 + 22 * 4 * t * (1 - t) // follows the second string's sag
  return (
    <div className="absolute" style={{ left: `${t * 100}%`, top: `${y + 4}%`, width: 'calc(var(--u) * .34)', transform: 'translateX(-50%)', transformOrigin: '50% 0', animation: `bunt ${3 + (t * 7) % 2}s ease-in-out ${t * 3}s infinite` }}>
      {rawr ? (
        <button
          type="button"
          aria-label="a flag on the bunting"
          onClick={() => {
            setRoar(true)
            playSound('catMeow')
            fx.shake()
            discover('partyRawr')
          }}
          className="hit pointer-events-auto relative block w-full touch-manipulation"
        >
          <span className="block aspect-[1/1.15] w-full [clip-path:polygon(0_0,100%_0,50%_100%)]" style={{ background: color }} />
          <span className="absolute inset-x-0 top-[6%] text-center font-hand leading-none text-ink/45 transition-colors" style={{ fontSize: 'calc(var(--u) * .1)', color: roar ? '#fff' : undefined }}>
            rawr
          </span>
        </button>
      ) : (
        <span className="block aspect-[1/1.15] w-full [clip-path:polygon(0_0,100%_0,50%_100%)]" style={{ background: color }} />
      )}
    </div>
  )
}

/** a very small speaker with a sticker on it */
function Speaker() {
  const { discover } = useWorld()
  const { say, bubble } = useSay()
  const [hit, setHit] = useState(0)
  return (
    <At dx={-4.0} y={-0.1} w={0.85} z={31}>
      <div className="relative">
        {bubble}
        <button
          type="button"
          aria-label="a small speaker with a sticker"
          onClick={() => {
            setHit((h) => h + 1)
            playSound('riff')
            say(hit === 0 ? 'turn it down.' : 'no. turn it UP.', 2200)
            discover('partyBmth')
          }}
          className="hit block w-full touch-manipulation outline-offset-4"
        >
          <div key={hit} className="relative aspect-[3/4] rounded-md border-2 border-[#050308] bg-[#17101c] shadow-lg" style={{ animation: hit ? 'rattle .4s ease-in-out 2' : undefined }}>
            <span className="absolute left-1/2 top-[16%] block aspect-square w-[34%] -translate-x-1/2 rounded-full border-2 border-[#33243e]" />
            <span className="absolute left-1/2 top-[52%] block aspect-square w-[58%] -translate-x-1/2 rounded-full border-2 border-[#33243e] bg-[#0c0710]" />
            <span className="absolute -right-[10%] top-[6%] -rotate-12 bg-cream px-[2px] font-display font-bold leading-none text-ink" style={{ fontSize: U(0.13) }}>
              BMTH
            </span>
          </div>
        </button>
      </div>
    </At>
  )
}

/** a small purple eye that watches the party; it does not like being poked */
function ReynaEye() {
  const { discover } = useWorld()
  const [shut, setShut] = useState(false)
  return (
    <button
      type="button"
      aria-label="a small purple orb in the sky"
      onClick={() => {
        setShut(true)
        playSound('leer')
        discover('partyReyna')
        window.setTimeout(() => setShut(false), 1800)
      }}
      className="absolute touch-manipulation p-3"
      style={{ left: '27%', top: '23%' }}
    >
      <span
        className="block rounded-full transition-all duration-300"
        style={{
          width: U(0.34),
          height: shut ? U(0.04) : U(0.34),
          background: 'radial-gradient(circle at 50% 50%, #1b0a2c 28%, #8a4bd8 30%, #5b2aa0 70%)',
          boxShadow: '0 0 calc(var(--u) * .35) calc(var(--u) * .06) rgba(150,80,230,.45)',
          opacity: 0.55,
        }}
      />
    </button>
  )
}

/** little gold sparkles drifting around the birthday girl while everyone celebrates */
function Sparkles({ on }: { on: boolean }) {
  if (!on) return null
  return (
    <div className="pointer-events-none absolute inset-[-25%]" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-[#ffe9a0]"
          style={{ left: `${10 + ((i * 37) % 80)}%`, top: `${8 + ((i * 53) % 70)}%`, fontSize: U(0.22 + (i % 3) * 0.08), animation: `sparkup ${1.8 + (i % 4) * 0.4}s ease-in-out ${i * 0.2}s infinite`, textShadow: '0 0 10px rgba(255,224,130,.9)' }}
        >
          ✦
        </span>
      ))}
    </div>
  )
}
