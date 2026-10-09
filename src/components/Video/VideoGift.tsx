import { useEffect, useRef, useState } from 'react'
import { audio, playSound } from '../../audio/useSound'
import { fx } from '../../fx'
import { usePrefersReducedMotion } from '../../hooks/useCursor'

type Props = {
  eyebrow: string
  pause: [string, string]
  premiere: string
  title: string
  meta: string[]
  button: string
  note: string
  hint: string
  thanks: string
  href: string
  /** start the sequence (the curtains are open) */
  play: boolean
  /** returning visitor: skip straight to the reveal */
  instant: boolean
  /** true while the lights are down, so the rest of the page can quiet itself */
  onLights: (down: boolean) => void
  onOpen: () => void
}

// deterministic golden dust drifting up the room
const DUST = Array.from({ length: 22 }).map((_, i) => ({
  left: `${(i * 41 + 5) % 98}%`,
  delay: `${-((i * 1.7) % 14)}s`,
  dur: `${12 + ((i * 3) % 9)}s`,
  size: 2 + ((i * 5) % 3),
  glyph: i % 5 === 0,
}))

// sparkles that wake up around the gift
const SPARKS = [
  { x: -78, y: -6, d: 0 },
  { x: -52, y: -48, d: 0.35 },
  { x: 8, y: -66, d: 0.7 },
  { x: 58, y: -42, d: 0.2 },
  { x: 84, y: 0, d: 0.55 },
  { x: -20, y: -30, d: 0.9 },
]

const Film = () => (
  <div className="flex justify-between gap-1.5 px-1" aria-hidden>
    {Array.from({ length: 16 }).map((_, i) => (
      <span key={i} className="h-2 w-1.5 shrink-0 rounded-[1px] bg-cream/15 sm:w-2" />
    ))}
  </div>
)

const fade = (on: boolean) => `transition-all duration-[1400ms] ease-out ${on ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`

/**
 * The finale. Stages: 0 lights go down · 1 "Before you go..." · 2 "There's one last thing." + gift
 * · 3 the gift opens and the premiere is revealed. The CTA is a plain external link to the movie on Google Drive.
 */
export function VideoGift({ eyebrow, pause, premiere, title, meta, button, note, hint, thanks, href, play, instant, onLights, onOpen }: Props) {
  const reduced = usePrefersReducedMotion()
  const [stage, setStage] = useState(instant ? 3 : 0)
  const [near, setNear] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [calm, setCalm] = useState(false) // stop the CTA pulse once she has noticed it
  const burst = useRef(false)
  const anim = (a: string) => (reduced ? undefined : a)
  const revealed = stage >= 3
  const lit = near || revealed

  useEffect(() => {
    if (!play) return
    onLights(true)
    audio.setFinale(true) // ambience falls away, a low atmosphere takes over
    if (!instant) playSound('finaleLights')
    if (instant || reduced) {
      setStage(3)
      return
    }
    const ts = [
      window.setTimeout(() => setStage((s) => Math.max(s, 1)), 700),
      window.setTimeout(() => setStage((s) => Math.max(s, 2)), 3400),
      window.setTimeout(() => setStage((s) => Math.max(s, 3)), 6800),
    ]
    return () => ts.forEach(window.clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, instant, reduced])

  // leaving the finale (scrolling away, unmounting) hands the ambience back
  useEffect(() => () => audio.setFinale(false), [])

  // sound follows the picture: near-silence in the pause, a chime as the gift appears,
  // then chime + riser as it opens, a soft impact as the title lands, a shimmer across the button
  useEffect(() => {
    if (instant || !play) return
    if (stage === 2) playSound('giftAppear')
    if (stage !== 3) return
    playSound('giftOpen')
    playSound('riser')
    const ts = [window.setTimeout(() => playSound('impact'), 1100), window.setTimeout(() => playSound('ctaShimmer'), 2100)]
    return () => ts.forEach(window.clearTimeout)
  }, [stage, instant, play])

  useEffect(() => {
    if (stage === 3 && !instant && !reduced && !burst.current) {
      burst.current = true
      fx.confetti({ x: 0.5, y: 0.5, count: 40, power: 9, spread: 1.1 })
    }
  }, [stage, instant, reduced])

  const openGift = () => {
    if (stage < 3) setStage(3)
    else fx.confetti({ x: 0.5, y: 0.45, count: 14, power: 6, shapes: ['dot'], spread: 1.2 })
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div
        className="relative isolate overflow-hidden rounded-3xl border border-gold/30 px-5 pb-9 pt-7 text-center shadow-[0_0_90px_rgba(0,0,0,.6)] sm:px-12 sm:pb-12 sm:pt-9"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 30%, #3a1426 0%, #1c0b15 55%, #0b0509 100%)' }}
      >
        {/* atmosphere: golden spotlight, dust, vignette */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div
            className="absolute left-1/2 top-0 h-full w-[130%] -translate-x-1/2 transition-opacity duration-[2500ms]"
            style={{
              opacity: stage >= 2 ? 1 : 0,
              background: 'radial-gradient(ellipse 38% 62% at 50% 36%, rgba(255,214,120,.26), rgba(226,182,89,.08) 55%, transparent 75%)',
              animation: anim('glowpulse 6s ease-in-out infinite'),
            }}
          />
          <div
            className="absolute left-1/2 top-0 h-[70%] w-[46%] -translate-x-1/2 transition-opacity duration-[2500ms]"
            style={{
              opacity: stage >= 2 ? 0.55 : 0,
              clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
              background: 'linear-gradient(180deg, rgba(255,226,150,.28), transparent)',
            }}
          />
          {!reduced &&
            stage >= 1 &&
            DUST.map((d, i) => (
              <span
                key={i}
                className="absolute bottom-0 text-gold"
                style={{
                  left: d.left,
                  width: d.glyph ? undefined : d.size,
                  height: d.glyph ? undefined : d.size,
                  fontSize: 9,
                  borderRadius: 9,
                  background: d.glyph ? undefined : 'rgba(255,224,150,.8)',
                  animation: `dustfloat ${d.dur} linear ${d.delay} infinite`,
                }}
              >
                {d.glyph ? '✦' : null}
              </span>
            ))}
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 150px 30px rgba(0,0,0,.65)' }} />
        </div>

        <Film />
        <p className={`mt-5 font-display text-[10px] uppercase tracking-[.5em] text-gold/70 ${fade(stage >= 1)}`}>{eyebrow}</p>

        {/* the pause: two quiet lines, one after the other */}
        {!revealed && (
          <div className="mx-auto mt-6 flex min-h-[7.5rem] max-w-md flex-col items-center justify-center gap-2 sm:min-h-[8.5rem]" aria-live="polite">
            <p className={`font-hand text-3xl text-cream transition-opacity duration-1000 sm:text-4xl ${stage >= 2 ? 'opacity-45' : stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>{pause[0]}</p>
            <p className={`font-hand text-4xl text-gold [text-shadow:0_0_26px_rgba(226,182,89,.55)] sm:text-5xl ${fade(stage >= 2)}`}>{pause[1]}</p>
          </div>
        )}

        {/* the gift: only the doorway to the finale */}
        <div
          className={`relative mx-auto transition-all duration-[1400ms] ease-out ${stage >= 2 ? 'opacity-100' : 'pointer-events-none opacity-0'} ${
            revealed ? 'mt-3 h-28 w-32 sm:h-32 sm:w-36' : 'h-44 w-48 sm:h-52 sm:w-56'
          }`}
        >
          <div
            className="absolute left-1/2 top-[58%] h-36 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-opacity duration-700"
            style={{
              background: 'radial-gradient(closest-side, rgba(255,214,120,.8), rgba(226,182,89,.2) 60%, transparent)',
              opacity: revealed ? 0.9 : near ? 0.75 : 0.45,
              animation: anim('glowpulse 4.5s ease-in-out infinite'),
            }}
            aria-hidden
          />
          {SPARKS.map((s, i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[55%] text-lg text-[#ffe9a0] transition-opacity duration-500"
              style={{
                marginLeft: s.x * (revealed ? 0.6 : 1),
                marginTop: s.y * (revealed ? 0.6 : 1),
                opacity: lit ? 1 : 0,
                animation: lit && !reduced ? `sparkup 2.4s ease-in-out ${s.d}s infinite` : undefined,
                textShadow: '0 0 10px rgba(255,224,130,.9)',
              }}
            >
              ✦
            </span>
          ))}
          <button
            type="button"
            onClick={openGift}
            onMouseEnter={() => setNear(true)}
            onMouseLeave={() => setNear(false)}
            onFocus={() => setNear(true)}
            onBlur={() => setNear(false)}
            tabIndex={stage >= 2 ? 0 : -1}
            aria-label={revealed ? 'the gift is open' : 'open the gift'}
            className="absolute inset-0 cursor-pointer rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-blush/60"
          >
            <span className="block h-full w-full transition-transform duration-500 ease-out" style={{ transform: lit ? 'translateY(-6px) scale(1.04)' : 'none' }}>
              <span className="block h-full w-full" style={{ animation: anim('floaty 3.6s ease-in-out infinite') }}>
                <GiftArt open={revealed} reduced={reduced} />
              </span>
            </span>
          </button>
        </div>
        {!revealed && <p className={`mt-1 h-5 font-hand text-xl text-cream/55 ${fade(stage === 2)}`}>{hint}</p>}

        {/* the premiere */}
        <div className={`grid transition-[grid-template-rows] duration-[1600ms] ease-out ${revealed ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className={`pt-6 ${fade(revealed)}`} style={{ transitionDelay: revealed ? '500ms' : '0ms' }} inert={!revealed}>
              <p className="font-display text-[10px] uppercase tracking-[.32em] text-gold/80 sm:text-xs sm:tracking-[.4em]">✦ {premiere} ✦</p>
              <p className="mt-5 text-3xl" aria-hidden>
                🎬
              </p>
              <h3 className="mt-2 font-display text-[2.1rem] font-bold italic leading-tight text-gold [text-shadow:0_0_34px_rgba(226,182,89,.65)] sm:text-6xl">{title}</h3>
              <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-display text-[10px] uppercase tracking-[.28em] text-cream/65 sm:text-xs">
                {meta.map((m, i) => (
                  <span key={m} className="flex items-center gap-3">
                    {i > 0 && (
                      <span aria-hidden className="text-gold/60">
                        ·
                      </span>
                    )}
                    {m}
                  </span>
                ))}
              </p>

              <div className="relative mx-auto mt-8 max-w-md">
                <div
                  className="pointer-events-none absolute -inset-4 rounded-[2.5rem] blur-xl"
                  style={{
                    background: 'radial-gradient(closest-side, rgba(255,214,120,.6), transparent)',
                    animation: calm ? undefined : anim('glowpulse 3.2s ease-in-out infinite'),
                    opacity: calm ? 0.75 : undefined,
                  }}
                  aria-hidden
                />
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    setCalm(true)
                    playSound('ctaHover')
                  }}
                  onFocus={() => {
                    setCalm(true)
                    playSound('ctaHover')
                  }}
                  onClick={() => {
                    playSound('ctaGo') // the link opens immediately; this just plays alongside it
                    setClicked(true)
                    onOpen()
                  }}
                  className="group relative inline-flex min-h-16 w-full items-center justify-center overflow-hidden rounded-full px-7 py-4 font-display text-base font-bold uppercase tracking-[.14em] text-[#2a1405] outline-none transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97] focus-visible:ring-4 focus-visible:ring-blush/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c0b15] sm:text-lg"
                  style={{
                    background: 'linear-gradient(180deg, #f8e19a 0%, #e2b659 48%, #bf8d2c 100%)',
                    boxShadow: 'inset 0 2px 0 rgba(255,255,255,.6), inset 0 -3px 6px rgba(120,70,0,.35), 0 0 52px rgba(226,182,89,.6)',
                  }}
                >
                  <span className="relative z-10">{button}</span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/50 blur-md"
                    style={{ animation: anim('sheen 5.5s ease-in-out 1.5s infinite') }}
                  />
                </a>
                <p className="relative mt-4 min-h-6 text-sm text-cream/65" aria-live="polite">
                  {clicked ? <span className="text-gold">{thanks}</span> : note}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <Film />
        </div>
      </div>
    </div>
  )
}

/** Hand-drawn gift in the site's palette: swaying bow, lid that pops, warm light from inside. */
function GiftArt({ open, reduced }: { open: boolean; reduced: boolean }) {
  const t = reduced ? 'none' : 'transform .6s cubic-bezier(.3,1.5,.5,1)'
  return (
    <svg viewBox="0 0 160 150" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="vg-box" x1="0" x2="1">
          <stop offset="0" stopColor="#c42a3b" />
          <stop offset="1" stopColor="#8c1c2c" />
        </linearGradient>
        <linearGradient id="vg-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#f3d27e" />
          <stop offset="1" stopColor="#c9962f" />
        </linearGradient>
        <linearGradient id="vg-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffe9a0" stopOpacity=".95" />
          <stop offset="1" stopColor="#ffe9a0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="140" rx="52" ry="6" fill="#000" opacity=".3" />
      {/* light from inside */}
      <g style={{ opacity: open ? 1 : 0, transition: 'opacity .5s' }}>
        <polygon points="40,72 120,72 150,-20 10,-20" fill="url(#vg-beam)" />
      </g>
      {/* box */}
      <rect x="30" y="70" width="100" height="66" rx="4" fill="url(#vg-box)" />
      <rect x="72" y="70" width="16" height="66" fill="url(#vg-gold)" />
      <rect x="30" y="70" width="100" height="6" fill="#000" opacity=".18" />
      <ellipse cx="80" cy="72" rx="48" ry="3" fill="#ffe9a0" style={{ opacity: open ? 0.9 : 0, transition: 'opacity .4s' }} />
      {/* lid + bow */}
      <g style={{ transformBox: 'fill-box', transformOrigin: '12% 100%', transform: open ? 'translate(14px,-30px) rotate(22deg)' : 'none', transition: t }}>
        <rect x="24" y="50" width="112" height="22" rx="4" fill="#a31f31" />
        <rect x="72" y="50" width="16" height="22" fill="url(#vg-gold)" />
        <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: reduced ? undefined : 'sway 3.2s ease-in-out infinite' }}>
          <path d="M80 50 C 62 22, 36 30, 48 46 C 56 54, 72 50, 80 50Z" fill="url(#vg-gold)" />
          <path d="M80 50 C 98 22, 124 30, 112 46 C 104 54, 88 50, 80 50Z" fill="url(#vg-gold)" />
          <circle cx="80" cy="49" r="6" fill="#c9962f" />
        </g>
      </g>
    </svg>
  )
}
