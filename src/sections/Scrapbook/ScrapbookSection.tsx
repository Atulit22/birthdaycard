import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { playSound } from '../../audio/useSound'
import { Flower, Heart } from '../../components/BirthdayWorld/art'
import { Cat } from '../../components/Cat/Cat'
import { Doodles } from '../../components/EasterEggs/SecretEggs'
import { FlipCard } from '../../components/Scrapbook/FlipCard'
import { Reveal } from '../../components/UI/Reveal'
import { content, type ScrapItem } from '../../data/birthdayContent'
import { fx } from '../../fx'
import { useWhisperOnView } from '../../hooks/useWhisperOnView'
import { usePrefersReducedMotion } from '../../hooks/useCursor'
import { useWorld } from '../../state/DiscoveryContext'

// soft, layered paper shadows (a tight contact shadow + two long soft ones)
const SHADOW = 'shadow-[0_1px_1px_rgba(70,30,20,.22),0_8px_14px_-6px_rgba(70,30,20,.4),0_22px_28px_-16px_rgba(70,30,20,.35)]'
const RULED = 'repeating-linear-gradient(#fffaf0 0 27px, #dccdb3 27px 28px)'
// fine paper grain, drawn once as an SVG turbulence filter
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .36  0 0 0 0 .26  0 0 0 0 .2  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

/** Washi tape. It shifts a little when you hover the paper it holds. */
function Tape({ className = '', color = 'bg-gold/60' }: { className?: string; color?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 rotate-[-4deg] ${color} shadow-sm backdrop-blur-sm transition-transform duration-500 [clip-path:polygon(2%_0,98%_6%,100%_100%,0_92%)] group-hover:-rotate-[8deg] group-hover:translate-x-[-45%] ${className}`}
    />
  )
}

function Back({ item, tone = 'paper' }: { item: ScrapItem; tone?: 'paper' | 'dark' | 'pink' }) {
  const dark = tone === 'dark'
  return (
    <div
      className={`relative flex h-full min-h-full flex-col justify-center rounded-md p-6 ${SHADOW} ${dark ? 'bg-ink text-cream' : tone === 'pink' ? 'bg-[#ffd9e3] text-ink' : 'text-ink'}`}
      style={!dark && tone === 'paper' ? { background: RULED } : undefined}
    >
      <p className={`text-[10px] uppercase tracking-[.3em] ${dark ? 'text-gold' : 'text-wine/70'}`}>{item.title}</p>
      <p className="mt-2 font-hand text-[1.5rem] leading-[1.15] sm:text-[1.6rem]">{item.body}</p>
    </div>
  )
}

/** A polaroid. The tape on top is real: peel it. */
function Polaroid({ item, tilt, peelable = false, art }: { item: ScrapItem; tilt: number; peelable?: boolean; art: ReactNode }) {
  const { discover } = useWorld()
  const [peeled, setPeeled] = useState(false)
  const reduced = usePrefersReducedMotion()
  return (
    <div className="group relative">
      <FlipCard
        label={`${item.title}: ${item.teaser}`}
        tilt={tilt}
        front={
          <div className={`relative rounded-[3px] bg-white p-3 pb-4 ${SHADOW}`}>
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#e9c0d0] via-[#c9a6e8] to-[#7a4a8a]">
              {item.image ? <img src={item.image} alt={item.caption ?? ''} className="h-full w-full object-cover" loading="lazy" /> : <div className="grid h-full place-items-center">{art}</div>}
            </div>
            <p className="mt-2 text-center font-hand text-[1.7rem] leading-none text-ink">{item.teaser}</p>
            {item.caption && <p className="text-center text-[10px] uppercase tracking-widest text-ink/40">{item.caption}</p>}
            {peelable && (
              <p aria-hidden className="absolute inset-x-0 top-1 text-center font-hand text-sm text-ink/45 transition-opacity duration-700" style={{ opacity: peeled ? 1 : 0 }}>
                {content.scrapbook.extra.tape}
              </p>
            )}
          </div>
        }
        back={<Back item={item} />}
      />
      {peelable ? (
        <motion.button
          type="button"
          aria-label="a piece of tape"
          onClick={() => {
            if (peeled) return
            setPeeled(true)
            playSound('tapeRip')
            discover('tape')
          }}
          animate={peeled && !reduced ? { rotate: 38, y: 46, x: 24, opacity: 0 } : { rotate: -4, y: 0, x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeIn' }}
          className="absolute -top-3 left-1/2 z-20 h-7 w-20 -translate-x-1/2 touch-manipulation bg-gold/65 shadow-sm backdrop-blur-sm [clip-path:polygon(2%_0,98%_6%,100%_100%,0_92%)] hover:bg-gold/80"
          style={peeled && reduced ? { opacity: 0 } : undefined}
        />
      ) : (
        <Tape />
      )}
    </div>
  )
}

/** Having a bad day? A real emergency black cat. Poke it. */
function CatEmergency({ item }: { item: ScrapItem }) {
  const x = content.scrapbook.extra.catEmergency
  const { discover } = useWorld()
  const [n, setN] = useState(0)
  const [slip, setSlip] = useState(false)
  const poke = () => {
    const c = n + 1
    setN(c)
    playSound('catPoke')
    if (c === 5) {
      fx.catRain()
      discover('catEmergency')
    }
  }
  return (
    <div className="group relative rotate-[2deg]">
      <div className={`relative overflow-hidden rounded-[3px] bg-[#ffe9a0] pb-5 text-center text-ink ${SHADOW}`}>
        <div
          className="flex h-6 items-center justify-center font-display text-[10px] font-bold tracking-[.5em] text-cream"
          style={{ background: 'repeating-linear-gradient(-45deg,#b3202f 0 12px,#8c1c2c 12px 24px)' }}
        >
          {x.label}
        </div>
        <div className="px-5 pt-4">
          <p className="font-hand text-[2rem] leading-none text-wine">{x.ask}</p>
          <p className="mt-2 font-display text-[15px] italic leading-snug">
            {x.lines[0]} <span className="not-italic">{x.lines[1]}</span>
          </p>
        </div>
        <div className="relative mx-auto mt-2 w-fit">
          <AnimatePresence mode="wait">
            {n > 0 && (
              <motion.p
                key={n}
                initial={{ opacity: 0, y: 6, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute -top-2 left-1/2 z-10 w-max max-w-[14rem] -translate-x-1/2 rounded-xl bg-white px-2.5 py-1 font-hand text-xl leading-none shadow-md"
              >
                {x.taps[Math.min(n - 1, x.taps.length - 1)]}
              </motion.p>
            )}
          </AnimatePresence>
          <button type="button" aria-label="an emergency black cat" onClick={poke} className="mt-6 block touch-manipulation outline-offset-4">
            <Cat pose="sit" size={112} mood={n >= 5 ? 'happy' : 'calm'} autoYawn={false} />
          </button>
        </div>
        <button type="button" onClick={() => { setSlip((s) => !s); playSound('paperFlip') }} aria-expanded={slip} className="mt-3 font-hand text-lg text-ink/55 underline decoration-dotted underline-offset-4 hover:text-wine">
          {x.slip}
        </button>
        <AnimatePresence>
          {slip && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <p className="mx-4 mt-2 rotate-[-1deg] rounded-sm bg-white/70 px-3 py-2 text-left font-hand text-[1.25rem] leading-[1.1]">{item.body}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Tape color="bg-blush/75" />
    </div>
  )
}

/** knock knock → who's there → a small surprise. Tap the door. */
function KnockCard({ item }: { item: ScrapItem }) {
  const x = content.scrapbook.extra.knock
  const { discover } = useWorld()
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0)
  const [rattle, setRattle] = useState(0)
  const timer = useRef(0)
  const reduced = usePrefersReducedMotion()
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const knock = () => {
    if (stage === 1) return
    if (stage === 2) {
      setStage(3)
      playSound('sparkle')
      discover('knock')
      return
    }
    setStage(1)
    setRattle((r) => r + 1)
    playSound('knock')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setStage(2)
      playSound('moonChime')
    }, 1900)
  }
  const open = stage >= 2

  return (
    <div className="group relative -rotate-[2deg]">
      <div className={`relative rounded-[3px] border-2 border-dashed border-wine/50 bg-blush px-5 pb-5 pt-6 text-center text-ink ${SHADOW}`}>
        <div className="relative mx-auto h-[168px] w-[124px] [perspective:600px]">
          {/* what's behind the door */}
          <div className="absolute inset-0 rounded-t-[62px] bg-gradient-to-b from-[#ffe9a0] to-[#f6c76a] shadow-[inset_0_0_26px_rgba(140,28,44,.35)]" />
          <button
            type="button"
            aria-label="a little door"
            onClick={knock}
            className="absolute inset-0 touch-manipulation outline-offset-4"
            style={{ transformOrigin: '0% 50%', transform: open ? 'rotateY(-72deg)' : 'none', transition: reduced ? 'none' : 'transform .9s cubic-bezier(.3,1.2,.5,1)' }}
          >
            <span
              key={rattle}
              className="absolute inset-0 block rounded-t-[62px] border-4 border-[#4d2418] bg-[#7a3b2e]"
              style={{ animation: stage === 1 && !reduced ? 'rattle .45s ease-in-out 3' : undefined }}
            >
              <span className="absolute inset-x-4 top-5 h-[52px] rounded-t-[40px] border-2 border-[#4d2418]/60" />
              <span className="absolute inset-x-4 bottom-4 h-[62px] rounded border-2 border-[#4d2418]/60" />
              <span className="absolute right-3 top-[62%] h-3 w-3 rounded-full bg-gold shadow" />
              <span className="absolute left-1/2 top-[14px] h-2 w-5 -translate-x-1/2 rounded-b-full bg-gold/90" />
            </span>
          </button>
        </div>
        <div className="mt-3 min-h-[5.5rem]" aria-live="polite">
          {stage === 0 && (
            <>
              <p className="font-hand text-[2rem] leading-none text-wine">{x.idle}</p>
              <p className="mt-1 font-hand text-lg text-ink/55">{x.hint}</p>
            </>
          )}
          {stage === 1 && <p className="font-hand text-[2rem] leading-none text-wine">{x.who}</p>}
          {stage >= 2 && (
            <>
              <p className="font-hand text-[1.55rem] leading-[1.05]">{x.reply}</p>
              {stage === 3 && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-hand text-xl leading-none text-wine">
                  {x.cat}
                </motion.p>
              )}
              {stage === 2 && <p className="mt-1 font-hand text-base text-ink/45">(tap the door)</p>}
              {stage === 3 && (
                <button type="button" onClick={() => setStage(0)} className="mt-1 font-hand text-base text-ink/45 underline decoration-dotted underline-offset-4">
                  {x.again}
                </button>
              )}
            </>
          )}
        </div>
        <span className="sr-only">{item.body}</span>
      </div>
      <Tape color="bg-[#c9a6e8]/70" />
    </div>
  )
}

/** The quote. Tiny writing hides under the edge of the card, on the table. */
function QuoteCard({ item }: { item: ScrapItem }) {
  const { discover } = useWorld()
  const lines = content.scrapbook.extra.underside
  const [seen, setSeen] = useState(false)
  return (
    <div className="group relative">
      <FlipCard
        label={`${item.title}: ${item.teaser}`}
        tilt={-1.5}
        front={
          <div className={`relative flex aspect-[4/5] flex-col justify-center rounded-md bg-ink p-6 text-cream ${SHADOW}`}>
            <span className="font-display text-7xl leading-none text-gold">“</span>
            <p className="-mt-3 font-display text-2xl italic">{item.teaser}</p>
            <p className="mt-4 text-[10px] uppercase tracking-[.3em] text-cream/35">turn over ↻</p>
          </div>
        }
        back={<Back item={item} tone="dark" />}
      />
      <Tape color="bg-wine/45" />
      {/* a paper clip */}
      <svg aria-hidden viewBox="0 0 24 60" className="absolute -right-1 -top-4 z-10 h-14 w-6 rotate-6 text-[#9aa0a6]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M8 6v38a6 6 0 0 0 12 0V12a4 4 0 0 0-8 0v30" />
      </svg>
      <button
        type="button"
        onClick={() => {
          setSeen(true)
          playSound('paperRustle')
          discover('underside')
        }}
        className="absolute -bottom-6 left-3 rotate-[-2deg] touch-manipulation p-2 font-hand text-sm text-wine/35 transition-colors hover:text-wine/70"
      >
        {seen ? lines[1] : lines[0]}
      </button>
    </div>
  )
}

/** Where each of the six pieces sits. On phones they simply stack, each leaning a different way. */
const SPOT = [
  'mx-auto w-[min(80vw,290px)] md:col-span-5 md:col-start-1 md:mx-0 md:-ml-4 md:w-auto md:max-w-[310px] lg:-ml-14',
  'mx-auto w-[min(82vw,300px)] translate-x-2 md:col-span-4 md:col-start-7 md:mx-0 md:mt-10 md:w-auto md:max-w-[320px] md:translate-x-0',
  'mx-auto w-[min(76vw,270px)] -translate-x-2 md:col-span-4 md:col-start-2 md:mx-0 md:-mt-2 md:w-auto md:max-w-[290px] md:translate-x-0',
  'mx-auto w-[min(70vw,250px)] translate-x-1 md:col-span-3 md:col-start-7 md:mx-0 md:-mt-10 md:ml-6 md:w-auto md:max-w-[260px] md:translate-x-0',
  'mx-auto w-[min(86vw,330px)] md:col-span-5 md:col-start-1 md:mx-0 md:mt-2 md:w-auto md:max-w-[340px] md:ml-6',
  'mx-auto w-[min(80vw,290px)] -translate-x-2 md:col-span-5 md:col-start-7 md:mx-0 md:mt-8 md:w-auto md:max-w-[300px] md:translate-x-0 lg:-mr-14',
]

/** "A few things worth remembering..." — a handmade scrapbook. Text comes from birthdayContent.ts */
export function ScrapbookSection() {
  const ref = useRef<HTMLElement>(null)
  useWhisperOnView(ref, content.areaWhispers.scrapbook)
  const s = content.scrapbook
  const it = (id: string) => s.items.find((i) => i.id === id) as ScrapItem

  const pieces: ReactNode[] = [
    <Polaroid key="s1" item={it('s1')} tilt={-3} peelable art={<Cat pose="sit" size={110} look={false} autoYawn={false} />} />,
    <CatEmergency key="s2" item={it('s2')} />,
    <QuoteCard key="s3" item={it('s3')} />,
    <KnockCard key="s4" item={it('s4')} />,
    <div key="s5" className="group relative">
      <FlipCard
        label={`${it('s5').title}: ${it('s5').teaser}`}
        tilt={1.5}
        front={
          <div className={`relative rounded-[3px] p-6 pl-8 text-ink ${SHADOW}`} style={{ background: RULED }}>
            <span aria-hidden className="absolute inset-y-0 left-6 w-px bg-wine/25" />
            <p className="font-hand text-[2.1rem] leading-none text-wine">{it('s5').teaser}</p>
            <ul className="mt-3 space-y-0.5 font-hand text-[1.45rem] leading-[28px]">
              {s.extra.dontForget.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p className="mt-3 text-right font-hand text-base text-ink/40">{s.extra.dontForgetHint}</p>
          </div>
        }
        back={<Back item={it('s5')} />}
      />
      <Tape color="bg-[#8fb391]/70" />
    </div>,
    <Polaroid
      key="s6"
      item={it('s6')}
      tilt={2.5}
      art={
        <div className="relative">
          <Flower size={86} color="#f4b6c8" />
          <Heart size={26} color="#b3202f" className="absolute -right-5 -top-2 rotate-12" />
        </div>
      }
    />,
  ]

  return (
    <section ref={ref} id="scrapbook" className="relative overflow-hidden bg-paper px-5 pb-32 pt-24 text-ink sm:px-8" style={{ backgroundImage: 'radial-gradient(#d9c3a1 1px, transparent 1.3px), radial-gradient(#e8d5b8 1px, transparent 1.3px)', backgroundSize: '26px 26px, 26px 26px', backgroundPosition: '0 0, 13px 13px' }}>
      {/* paper grain + a soft vignette so it reads as a sheet on a desk */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50 mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_55%,rgba(110,60,40,.18))]" />

      {/* torn paper edge */}
      <svg className="absolute -top-px left-0 w-full text-[#3a1a3f]" viewBox="0 0 1440 60" preserveAspectRatio="none" height="50" aria-hidden>
        <path fill="currentColor" d="M0 0H1440V20 L1400 34 1352 18 1300 38 1248 22 1190 40 1130 20 1070 36 1010 18 950 38 890 22 830 40 770 20 710 38 650 18 590 36 530 22 470 40 410 20 350 38 290 20 230 38 170 22 110 36 50 18 0 34Z" />
      </svg>

      {/* desk clutter */}
      <div aria-hidden className="pointer-events-none absolute right-[6%] top-28 hidden h-24 w-24 rounded-full border-[6px] border-[#8b5a3c]/10 md:block" style={{ boxShadow: 'inset 0 0 8px rgba(139,90,60,.15)' }} />
      <span aria-hidden className="pointer-events-none absolute left-[3%] top-[44%] hidden rotate-[-8deg] border-2 border-wine/25 px-3 py-1 font-display text-[11px] tracking-[.3em] text-wine/30 lg:block">
        HANDMADE · WITH ♡
      </span>
      <Flower size={48} color="#e2b659" className="pointer-events-none absolute bottom-24 right-[7%] hidden rotate-[24deg] opacity-70 md:block" />
      <Doodles />

      <div className="relative mx-auto max-w-5xl">
        <Reveal className="mt-8 text-center">
          <p className="font-display text-xs uppercase tracking-[.4em] text-wine/60">area 06</p>
          <h2 className="mt-3 font-display text-4xl font-bold italic leading-tight text-wine sm:text-6xl">{s.title}</h2>
          <p className="mt-2 font-hand text-2xl text-ink/60">{s.sub}</p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 items-start gap-y-16 md:grid-cols-12 md:gap-x-4 md:gap-y-6">
          {pieces.map((p, i) => (
            <Reveal key={i} delay={(i % 2) * 0.12} className={SPOT[i]}>
              {p}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
