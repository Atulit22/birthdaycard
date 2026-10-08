import { useRef } from 'react'
import { Heart } from '../../components/BirthdayWorld/art'
import { Cat } from '../../components/Cat/Cat'
import { FlipCard } from '../../components/Scrapbook/FlipCard'
import { Reveal } from '../../components/UI/Reveal'
import { content, type ScrapItem } from '../../data/birthdayContent'
import { useWhisperOnView } from '../../hooks/useWhisperOnView'

const TILTS = [-3, 2.5, -1.5, 3, -2.5, 1.5]

function Tape({ className = '' }: { className?: string }) {
  return <span className={`absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 rotate-[-4deg] bg-gold/60 shadow-sm backdrop-blur-sm ${className}`} />
}

function Front({ item }: { item: ScrapItem }) {
  switch (item.kind) {
    case 'polaroid':
      return (
        <div className="relative rounded-sm bg-white p-3 pb-4 shadow-[0_12px_24px_-8px_rgba(60,20,40,.55)]">
          <Tape />
          <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#e9c0d0] via-[#c9a6e8] to-[#7a4a8a]">
            {item.image ? (
              <img src={item.image} alt={item.caption ?? ''} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="grid h-full place-items-center">
                <Cat pose="sit" size={96} look={false} autoYawn={false} />
              </div>
            )}
          </div>
          <p className="mt-2 text-center font-hand text-2xl leading-none text-ink">{item.teaser}</p>
          {item.caption && <p className="text-center text-[10px] uppercase tracking-widest text-ink/40">{item.caption}</p>}
        </div>
      )
    case 'note':
      return (
        <div className="relative aspect-square bg-[#ffe9a0] p-5 shadow-[0_12px_24px_-8px_rgba(60,20,40,.5)]">
          <Tape className="bg-blush/70" />
          <p className="font-hand text-3xl leading-tight text-ink">{item.teaser}</p>
          <p className="absolute bottom-3 right-4 text-xs text-ink/40">tap ↻</p>
        </div>
      )
    case 'quote':
      return (
        <div className="relative flex aspect-[4/5] flex-col justify-center rounded-lg bg-ink p-6 text-cream shadow-[0_12px_24px_-8px_rgba(60,20,40,.6)]">
          <span className="font-display text-7xl leading-none text-gold">“</span>
          <p className="-mt-3 font-display text-xl italic">{item.teaser}</p>
        </div>
      )
    case 'joke':
      return (
        <div className="relative flex aspect-[5/4] flex-col items-center justify-center rounded-lg border-2 border-dashed border-wine/60 bg-blush p-5 text-center shadow-[0_12px_24px_-8px_rgba(60,20,40,.5)]">
          <Heart size={22} color="#8c1c2c" />
          <p className="mt-1 font-hand text-3xl leading-none text-wine">{item.teaser}</p>
        </div>
      )
    default:
      return (
        <div
          className="relative aspect-[4/5] rounded-md p-5 shadow-[0_12px_24px_-8px_rgba(60,20,40,.5)]"
          style={{ background: 'repeating-linear-gradient(#fffaf0 0 27px, #d9c9b0 27px 28px)' }}
        >
          <Tape className="bg-wine/40" />
          <p className="mt-2 font-hand text-3xl text-ink">{item.teaser}</p>
          <span className="absolute bottom-3 right-4 text-xs text-ink/40">open ↻</span>
        </div>
      )
  }
}

function Back({ item }: { item: ScrapItem }) {
  const dark = item.kind === 'quote'
  return (
    <div
      className={`flex h-full min-h-full flex-col justify-center rounded-lg p-6 shadow-[0_12px_24px_-8px_rgba(60,20,40,.55)] ${
        dark ? 'bg-ink text-cream' : item.kind === 'note' ? 'bg-[#ffe9a0] text-ink' : item.kind === 'joke' ? 'bg-blush text-ink' : 'bg-white text-ink'
      }`}
    >
      <p className={`text-[10px] uppercase tracking-[.3em] ${dark ? 'text-gold' : 'text-wine/70'}`}>{item.title}</p>
      <p className={`mt-2 font-hand text-[1.55rem] leading-[1.15] ${item.kind === 'quote' ? 'italic' : ''}`}>{item.body}</p>
      {item.caption && item.kind === 'quote' && <p className="mt-3 text-sm text-gold">{item.caption}</p>}
    </div>
  )
}

/** "A few things worth remembering..." — a paper scrapbook. Content comes from birthdayContent.ts */
export function ScrapbookSection() {
  const ref = useRef<HTMLElement>(null)
  useWhisperOnView(ref, content.areaWhispers.scrapbook)
  const s = content.scrapbook
  return (
    <section
      ref={ref}
      id="scrapbook"
      className="relative overflow-hidden bg-paper px-5 pb-28 pt-24 text-ink sm:px-8"
      style={{
        backgroundImage:
          'radial-gradient(#d9c3a1 1px, transparent 1.3px), radial-gradient(#e8d5b8 1px, transparent 1.3px)',
        backgroundSize: '26px 26px, 26px 26px',
        backgroundPosition: '0 0, 13px 13px',
      }}
    >
      {/* torn paper edge */}
      <svg className="absolute -top-px left-0 w-full text-[#3a1a3f]" viewBox="0 0 1440 60" preserveAspectRatio="none" height="50" aria-hidden>
        <path fill="currentColor" d="M0 0H1440V20 L1400 34 1352 18 1300 38 1248 22 1190 40 1130 20 1070 36 1010 18 950 38 890 22 830 40 770 20 710 38 650 18 590 36 530 22 470 40 410 20 350 38 290 20 230 38 170 22 110 36 50 18 0 34Z" />
      </svg>

      {/* doodles */}
      <span className="pointer-events-none absolute left-[6%] top-32 rotate-12 font-hand text-5xl text-wine/25">✦</span>
      <span className="pointer-events-none absolute right-[8%] top-44 -rotate-12 font-hand text-6xl text-mauve/30">♡</span>
      <span className="pointer-events-none absolute bottom-24 left-[10%] -rotate-6 font-hand text-4xl text-wine/20">~ ~ ~</span>

      <div className="relative mx-auto max-w-5xl">
        <Reveal className="mt-8 text-center">
          <p className="font-display text-xs uppercase tracking-[.4em] text-wine/60">area 06</p>
          <h2 className="mt-3 font-display text-4xl font-bold italic leading-tight text-wine sm:text-6xl">{s.title}</h2>
          <p className="mt-2 font-hand text-2xl text-ink/60">{s.sub}</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-start gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.12} className={i % 3 === 1 ? 'lg:mt-10' : ''}>
              <div className="mx-auto max-w-[280px]">
                <FlipCard label={`${item.title}: ${item.teaser}`} tilt={TILTS[i % TILTS.length]} front={<Front item={item} />} back={<Back item={item} />} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
