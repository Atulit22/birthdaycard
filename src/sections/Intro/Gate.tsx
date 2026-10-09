import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { audio, playSound } from '../../audio/useSound'
import { Cloud, Flower, GrassTuft, House, Moon, Streetlight, Tree } from '../../components/BirthdayWorld/art'
import { Fireflies } from '../../components/BirthdayWorld/Ambient'
import { Cat } from '../../components/Cat/Cat'
import { StarField } from '../../components/UI/StarField'
import { content } from '../../data/birthdayContent'
import { eggText } from '../../data/easterEggs'
import { usePrefersReducedMotion } from '../../hooks/useCursor'
import { useWorld } from '../../state/DiscoveryContext'

// Beats of the opening, in ms from the start.
// 1 "Hey Ishu." · 2 "So... this is what I've been working on." · 3 "A tiny world, made just for you."
// 4 the hidden-things line + the path starts to light · 5 the way in
const TIMES = [1600, 4600, 8200, 11200, 13600]
const STONES = 7

const rise = {
  initial: { opacity: 0, y: 14, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.6 } },
  transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] as const },
}

/** one tree-shaped silhouette on the horizon */
const Pine = ({ h, className = '' }: { h: number; className?: string }) => (
  <svg viewBox="0 0 40 100" height={h} className={className} aria-hidden>
    <path d="M20 0 L33 32 L26 32 L37 58 L28 58 L40 90 L0 90 L12 58 L3 58 L14 32 L7 32Z" fill="#12091c" />
    <rect x="18" y="88" width="4" height="12" fill="#12091c" />
  </svg>
)

/**
 * The first scene: a quiet street at night, a lamp, a cat under it, a path that leads inside.
 * Behind everything the lines arrive one at a time; when the last one lands, the path lights up.
 */
export function Gate() {
  const { enter, discover, found, videoDone } = useWorld()
  const reduced = usePrefersReducedMotion()
  const g = content.gate
  const [step, setStep] = useState(reduced || found.length > 0 || videoDone ? 5 : 0)
  const [pokes, setPokes] = useState(0) // the streetlight
  const [cats, setCats] = useState(0) // the cat
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    if (step >= 5) return
    const ts = TIMES.map((ms, i) => window.setTimeout(() => setStep((s) => Math.max(s, i + 1)), ms))
    return () => ts.forEach(window.clearTimeout)
  }, [step >= 5]) // eslint-disable-line react-hooks/exhaustive-deps

  // a very gentle parallax: the farther a layer, the less it moves
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 18 })
  const sy = useSpring(my, { stiffness: 40, damping: 18 })
  const far = { x: useTransform(sx, (v) => v * -5), y: useTransform(sy, (v) => v * -3) }
  const mid = { x: useTransform(sx, (v) => v * -11), y: useTransform(sy, (v) => v * -5) }
  const near = { x: useTransform(sx, (v) => v * -20), y: useTransform(sy, (v) => v * -8) }
  const onMove = (e: React.PointerEvent) => {
    if (reduced) return
    mx.set((e.clientX / window.innerWidth - 0.5) * 2)
    my.set((e.clientY / window.innerHeight - 0.5) * 2)
  }

  const motes = useMemo(
    () => Array.from({ length: 22 }).map((_, i) => ({ a: (i / 22) * Math.PI * 2, r: 24 + ((i * 17) % 30), d: (i * 0.03) % 0.4 })),
    [],
  )

  const go = () => {
    if (entering) return
    audio.unlock() // the first user gesture: this is what allows sound at all
    playSound('whoosh')
    playSound('gateOpen')
    setEntering(true)
    window.setTimeout(enter, reduced ? 80 : 1150)
  }

  const stones = useMemo(
    () =>
      Array.from({ length: STONES }).map((_, i) => {
        const t = i / (STONES - 1)
        return { x: 50 + Math.sin(t * 4.2) * 5 * (0.4 + t), y: 80 + t * 11, w: 14 + t * 30 }
      }),
    [],
  )

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-[#0b0510]"
      onPointerMove={onMove}
      initial={{ clipPath: 'circle(150% at 50% 70%)' }}
      exit={{ clipPath: 'circle(0% at 50% 70%)', transition: { duration: 1, ease: [0.7, 0, 0.3, 1] } }}
    >
      {/* the whole world — it pushes forward when she steps in */}
      <motion.div className="absolute inset-0" style={{ transformOrigin: '50% 72%' }} animate={{ scale: entering ? 1.7 : 1 }} transition={{ duration: 1.15, ease: [0.5, 0, 0.9, 0.5] }}>
        {/* ───── far: sky, stars, moon, haze, the town on the horizon ───── */}
        <motion.div className="absolute -inset-6" style={far}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_92%,#5a1d3e_0%,#2d1238_38%,#130a1c_72%,#0b0510_100%)]" />
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.6 }}>
            <StarField count={90} seed={11} height={1000} />
            <StarField count={40} seed={23} height={1000} className="opacity-70" />
          </motion.div>
          <motion.div className="absolute right-[9%] top-[7%]" initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ duration: 3.2, delay: 0.6 }}>
            <div className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,236,190,.22),transparent)]" />
            <Moon size={96} className="relative" />
          </motion.div>
          {[
            { l: '8%', t: '24%', s: 190, d: 0 },
            { l: '58%', t: '33%', s: 240, d: 5 },
          ].map((c, i) => (
            <div key={i} className="floaty absolute opacity-25" style={{ left: c.l, top: c.t, animationDelay: `${c.d}s`, animationDuration: '18s' }}>
              <Cloud size={c.s} tone="#8a6aa8" />
            </div>
          ))}
          {/* distant hills */}
          <svg aria-hidden className="absolute inset-x-0 bottom-[30%] h-[22%] w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path d="M0 30 V16 Q14 6 28 14 T58 12 T84 14 T100 9 V30Z" fill="#1d0f2b" />
          </svg>
          {/* a few warm windows, very far away */}
          {[
            [12, 36], [15, 35], [31, 34], [66, 35], [74, 34], [79, 36], [90, 34],
          ].map(([x, y], i) => (
            <span key={i} className="absolute h-[3px] w-[3px] rounded-full bg-[#ffd98a]" style={{ left: `${x}%`, top: `${y + 28}%`, boxShadow: '0 0 8px 2px rgba(255,200,120,.55)', animation: reduced ? undefined : `twinkle ${3 + (i % 3)}s ease-in-out ${i * 0.5}s infinite` }} />
          ))}
        </motion.div>

        {/* ───── middle: trees and little houses ───── */}
        <motion.div className="absolute -inset-6" style={mid}>
          <div className="absolute bottom-[36%] left-[3%] opacity-95"><Pine h={150} /></div>
          <div className="absolute bottom-[37%] left-[11%] opacity-95"><Pine h={110} /></div>
          <div className="absolute bottom-[36%] right-[4%] opacity-95"><Pine h={170} /></div>
          <div className="absolute bottom-[37%] right-[13%] opacity-95"><Pine h={120} /></div>
          <div className="absolute bottom-[36%] left-[20%] opacity-90"><House size={66} lit wall="#2f1b43" roof="#170c24" /></div>
          <div className="absolute bottom-[36.5%] right-[24%] opacity-90"><House size={54} lit wall="#2c1840" roof="#170c24" /></div>
          <Fireflies count={12} seed={4} />
        </motion.div>

        {/* ───── near: the ground, the path, the lamp, the cat ───── */}
        <motion.div className="absolute -inset-6" style={near}>
          <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#07040a] via-[#12091a] to-[#1d1128]" />
          <div className="absolute inset-x-0 bottom-[37.5%] h-px bg-white/5" />
          {/* the path leading toward you */}
          <svg aria-hidden className="absolute inset-x-0 bottom-0 h-[34%] w-full" viewBox="0 0 100 34" preserveAspectRatio="none">
            <path d="M47 0 Q 44 12 50 18 T 44 34 H 62 Q 58 22 54 17 T 53 0Z" fill="#2a1a38" opacity=".75" />
          </svg>
          {stones.map((s, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 rounded-[50%] bg-[#ffd98a]"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.w,
                height: s.w * 0.42,
                opacity: step >= 4 ? undefined : 0.1,
                boxShadow: step >= 4 ? '0 0 18px 4px rgba(255,200,120,.55)' : undefined,
                animation: step >= 4 && !reduced ? `stoneOn .7s ease-out ${i * 0.34}s both` : undefined,
              }}
            />
          ))}

          {/* the lamp, its pool of light, and the cat inside it */}
          <div className="absolute bottom-[19%] left-[50%] w-[min(92vw,540px)] -translate-x-1/2" style={{ aspectRatio: '540 / 150' }}>
            <div className="absolute inset-0 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,210,130,.5),rgba(255,190,110,.18)_55%,transparent)]" style={{ animation: reduced ? undefined : 'glowpulse 5s ease-in-out infinite' }} />
            {/* a firefly drifting through the light */}
            {!reduced && <span aria-hidden className="absolute left-0 top-[30%] h-1.5 w-1.5 rounded-full bg-[#fff3cf]" style={{ boxShadow: '0 0 10px 3px rgba(255,236,170,.9)', animation: 'flyBy 11s ease-in-out 3s infinite' }} />}
          </div>
          <div
            className="absolute bottom-[21%] left-[36%] -translate-x-1/2"
            style={{ width: 'clamp(64px, 9.5svh, 96px)', animation: pokes >= 3 ? 'flicker .3s ease-in-out 6' : undefined }}
          >
            {pokes > 0 && (
              <p className="pointer-events-none absolute -top-8 left-1/2 z-10 w-max -translate-x-1/2 font-hand text-xl text-cream/80">
                {eggText.gateLamp[Math.min(pokes - 1, eggText.gateLamp.length - 1)]}
              </p>
            )}
            <button
              type="button"
              aria-label="a streetlight"
              onClick={() => {
                const c = pokes + 1
                setPokes(c)
                if (c === 5) discover('gateLamp')
              }}
              className="block w-full touch-manipulation outline-offset-2 [&>svg]:h-auto [&>svg]:w-full"
            >
              <Streetlight size={96} />
            </button>
          </div>
          <motion.div
            className="absolute bottom-[22%] left-[61%] -translate-x-1/2"
            style={{ width: 'clamp(118px, 17svh, 170px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.4 }}
          >
            <AnimatePresence mode="wait">
              {cats > 0 && cats <= 3 && (
                <motion.p
                  key={cats}
                  initial={{ opacity: 0, y: 6, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute -top-9 left-1/2 z-10 w-max max-w-[70vw] -translate-x-1/2 rounded-xl bg-cream px-2.5 py-1 font-hand text-xl leading-none text-ink shadow-lg"
                >
                  {eggText.gateCat[cats - 1]}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="button"
              aria-label="the cat under the lamp"
              onClick={() => {
                const c = cats + 1
                setCats(c)
                playSound('catPoke')
                if (c === 2) setPokes((p) => Math.max(p, 3)) // the lamp flickers, the cat blames it
                if (c === 3) discover('gateCat')
              }}
              className="block w-full touch-manipulation outline-offset-4 [&>svg]:h-auto [&>svg]:w-full"
              style={{ animation: reduced ? undefined : 'catTilt 9s ease-in-out 4s infinite', transformOrigin: '50% 100%' }}
            >
              <Cat size={170} blinkDelay={0.5} autoYawn mood={cats >= 2 ? 'annoyed' : 'calm'} />
            </button>
          </motion.div>
          <div className="absolute bottom-[19%] left-[61%] h-3 w-[clamp(90px,13svh,130px)] -translate-x-1/2 rounded-full bg-black/60 blur-md" />

          {/* the little things that live here */}
          {[
            { l: '8%', b: 14, f: true, c: '#f4b6c8' },
            { l: '16%', b: 9, f: false },
            { l: '86%', b: 12, f: true, c: '#e2b659' },
            { l: '93%', b: 8, f: false },
            { l: '25%', b: 5, f: true, c: '#c9a6e8' },
            { l: '78%', b: 6, f: false },
          ].map((d, i) => (
            <span key={i} className="absolute -translate-x-1/2" style={{ left: d.l, bottom: `${d.b}%` }}>
              {d.f ? <Flower size={34} color={d.c} /> : <GrassTuft size={34} />}
            </span>
          ))}
          <div className="absolute bottom-[34%] left-[6%] opacity-90"><Tree size={110} canopy="#2f1b43" light="#3e2757" trunk="#150c20" /></div>
        </motion.div>
      </motion.div>

      {/* ───── words ───── */}
      <div className="pointer-events-none absolute inset-x-0 top-[8%] z-10 px-6 text-center">
        <div className="mx-auto min-h-[10.5rem] max-w-xl sm:min-h-[12rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.p key="a" {...rise} className="font-hand text-6xl text-cream [text-shadow:0_0_30px_rgba(244,182,200,.45)] sm:text-7xl">
                {g.greeting}
              </motion.p>
            )}
            {step === 2 && (
              <motion.p key="b" {...rise} className="font-display text-2xl italic leading-snug text-cream [text-shadow:0_0_24px_rgba(0,0,0,.6)] sm:text-4xl">
                {g.line2}
              </motion.p>
            )}
            {step >= 3 && (
              <motion.div key="c" {...rise} animate={{ ...rise.animate, opacity: entering ? 0 : 1 }}>
                <p className="font-hand text-4xl text-blush [text-shadow:0_0_26px_rgba(244,182,200,.5)] sm:text-6xl">{g.line3}</p>
                {step >= 4 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }} className="mx-auto mt-4 max-w-sm font-hand text-xl text-cream/60 sm:text-2xl">
                    {g.hidden}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ───── the way in ───── */}
      <div className="absolute inset-x-0 bottom-[3.5%] z-20 flex justify-center px-6">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={step >= 5 && !entering ? { opacity: 1, y: 0 } : { opacity: entering ? 0 : 0, y: 12 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          disabled={step < 5 || entering}
          onClick={go}
          className="min-h-12 rounded-full border border-gold/70 bg-[#1a0d1f]/60 px-9 py-3 font-hand text-3xl text-gold shadow-[0_0_44px_rgba(226,182,89,.5)] backdrop-blur transition-colors hover:bg-gold hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          {g.button}
        </motion.button>
      </div>

      {step < 5 && step >= 1 && (
        <button type="button" onClick={() => setStep(5)} className="absolute bottom-3 left-3 z-20 p-3 font-display text-[10px] uppercase tracking-[.4em] text-cream/30 transition hover:text-cream/70">
          {g.skip}
        </button>
      )}

      {/* stepping in: the lights swell and everything drifts toward the middle */}
      <AnimatePresence>
        {entering && (
          <>
            <motion.div className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_50%_72%,rgba(255,226,160,.85),rgba(255,200,120,.25)_45%,transparent_75%)]" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0.6] }} transition={{ duration: 1.1 }} />
            {!reduced &&
              motes.map((m, i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute left-1/2 top-[72%] z-30 h-1.5 w-1.5 rounded-full bg-[#fff3cf]"
                  style={{ boxShadow: '0 0 10px 3px rgba(255,226,150,.9)' }}
                  initial={{ x: Math.cos(m.a) * m.r * 9, y: Math.sin(m.a) * m.r * 7, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
                  transition={{ duration: 1, delay: m.d, ease: 'easeIn' }}
                />
              ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
