import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { Balloon, Bush, Cloud, Flower, GrassTuft, House, Moon, PawPrint, Present, Tree } from '../../components/BirthdayWorld/art'
import { Clouds, Fireflies, Parallax } from '../../components/BirthdayWorld/Ambient'
import { pos, type Pos } from '../../components/BirthdayWorld/spot'
import { CatWalk } from '../../components/Cat/CatWalk'
import { ClickyCat } from '../../components/Cat/ClickyCat'
import { HiddenCat, HiddenRawr, Lanterns, MysteryPresent, SecretRock, TinyStar } from '../../components/EasterEggs/Eggs'
import { WishStars } from '../../components/EasterEggs/WishStars'
import { Poppable } from '../../components/UI/Poppable'
import { StarField } from '../../components/UI/StarField'
import { content } from '../../data/birthdayContent'
import { eggText } from '../../data/easterEggs'
import { useWhisperOnView } from '../../hooks/useWhisperOnView'
import { useWorld } from '../../state/DiscoveryContext'
import { Island } from './Island'

/** A wooden sign on a post. */
function Board({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`flex flex-col items-center ${className}`} style={style}>
      <div className="rounded-md border-2 border-[#3b2418] bg-[#c9985a] px-3 py-1.5 text-center font-hand text-xl leading-[1.05] text-[#3b2418] shadow-[0_3px_0_#3b2418]">
        {children}
      </div>
      <div className="h-14 w-2.5 bg-[#3b2418]" />
    </div>
  )
}

/** Something that stands on the island, with no interaction. */
function Prop({ at, children, z }: { at: Pos; children: ReactNode; z?: number }) {
  const p = pos(at)
  return (
    <div className={p.className} style={{ ...p.style, zIndex: z }}>
      {children}
    </div>
  )
}

/** A balloon that hovers above the island. */
function Floater({ at, delay = 0, dur = 6, children }: { at: Pos; delay?: number; dur?: number; children: ReactNode }) {
  const p = pos(at)
  return (
    <div className={`${p.className} pointer-events-none`} style={p.style}>
      <div className="floaty" style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` }}>
        {children}
      </div>
    </div>
  )
}

const AreaLabel = ({ n }: { n: string }) => (
  <div className="absolute inset-x-0 top-5 text-center font-display text-xs uppercase tracking-[.4em] text-cream/55">area {n}</div>
)

/** A little cat that trots along island #1, but only while you scroll. */
function WalkingCat({ target }: { target: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start 85%', 'end 35%'] })
  const left = useTransform(scrollYProgress, [0, 1], ['4%', '76%'])
  const [walking, setWalking] = useState(false)
  const t = useRef(0)
  useMotionValueEvent(scrollYProgress, 'change', () => {
    setWalking(true)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setWalking(false), 160)
  })
  return (
    <motion.div className="pointer-events-none absolute z-20" style={{ left, bottom: 'calc(var(--g) - 24px)' }}>
      <CatWalk walking={walking} size={92} />
    </motion.div>
  )
}

/** Secret: knock three times and somebody's home. */
function CozyHouse() {
  const { discover } = useWorld()
  const [knocks, setKnocks] = useState(0)
  const lit = knocks >= 3
  return (
    <Poppable
      label="a little house with a door — knock?"
      {...pos({ m: [36, 6], d: [30, 6] })}
      text={knocks > 0 ? eggText.house.knock[Math.min(knocks - 1, 2)] : null}
      onPop={(n) => {
        setKnocks(n)
        if (n === 3) discover('house')
      }}
    >
      <div className="relative">
        <House size={160} lit={lit} wall="#d9c3c9" roof="#5d3a78" />
        {lit && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute right-[15%] top-[53%]">
            {/* a tiny silhouette in the window, waving */}
            <div className="relative h-4 w-3.5 rounded-t-full bg-ink">
              <span className="absolute -left-px -top-1 h-2 w-1 rotate-[-12deg] bg-ink [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
              <span className="absolute -right-px -top-1 h-2 w-1 rotate-[12deg] bg-ink [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
            </div>
          </motion.div>
        )}
      </div>
    </Poppable>
  )
}

export function BirthdayTown() {
  const ref = useRef<HTMLElement>(null)
  const isle1 = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.08 })
  useWhisperOnView(isle1, content.areaWhispers.town)
  const { town } = content
  const prints = [6, 13, 20, 27, 34, 41, 48, 55]

  return (
    <section
      ref={ref}
      id="town"
      className="relative overflow-hidden pb-28 pt-10"
      style={{
        background:
          'linear-gradient(to bottom, #2a1540 0%, #6b3470 5%, #d9738b 11%, #f3a98f 15%, #c9688a 21%, #6a3270 32%, #3a1a4a 48%, #221030 68%, #170b24 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[18%] [mask-image:linear-gradient(to_bottom,transparent,black_30%)]">
        <StarField count={170} seed={21} height={2200} />
      </div>
      <Clouds tone="#ffd6c9" rows={[3, 9, 20]} opacity={0.55} />
      <Parallax amount={90} className="pointer-events-none absolute right-[7%] top-[52%] hidden md:block">
        <Moon size={120} className="opacity-90" />
      </Parallax>
      <Parallax amount={40} className="pointer-events-none absolute -left-8 top-[33%] opacity-50">
        <Cloud size={220} tone="#caa6d8" />
      </Parallax>
      <Fireflies count={14} seed={9} />

      <div className="relative z-10 flex flex-col">
        {/* ───────── ISLAND 1 — sunset, a house, balloons ───────── */}
        <div ref={isle1}>
          <Island align="left" tone="dusk">
            <AreaLabel n="02" />
            <Prop at={{ m: [16, 4], d: [10, 2] }}>
              <Board>
                {town.welcomeSign[0]}
                <div className="text-base opacity-80">{town.welcomeSign[1]}</div>
              </Board>
            </Prop>

            <Prop at={{ m: [62, 8], d: [29, 8] }}>
              <House size={170} wall="#ecd9bd" roof="#8c1c2c" />
            </Prop>
            <Floater at={{ m: [74, 122], d: [34, 158] }} dur={5}>
              <Balloon color="#b3202f" size={34} />
            </Floater>
            <Floater at={{ m: [81, 138], d: [37, 176] }} delay={0.8} dur={6}>
              <Balloon color="#e2b659" size={34} />
            </Floater>
            <Floater at={{ m: [88, 118], d: [40, 150] }} delay={1.4} dur={7}>
              <Balloon color="#f4b6c8" size={34} />
            </Floater>

            <Prop at={{ m: [0, 0], d: [50, 6], hm: true }}>
              <Tree canopy="#e89ab4" light="#f6bfd0" trunk="#4a2c3a" size={130} />
            </Prop>

            {[
              { c: '#f4b6c8', p: { m: [30, 4], d: [61, 2] } },
              { c: '#e2b659', p: { m: [40, -8], d: [66, -8] } },
              { c: '#c9a6e8', p: { m: [24, -6], d: [71, 5] } },
            ].map((f, i) => (
              <Poppable key={i} label="a flower" lines={town.flowerLines} {...pos(f.p as Pos)}>
                <Flower color={f.c} size={46} style={{ animationDelay: `${i * 0.7}s` }} />
              </Poppable>
            ))}

            <Poppable label="a present" lines={town.presentLines} {...pos({ m: [88, 4], d: [83, 4] })}>
              <Present size={66} />
            </Poppable>

            <Prop at={{ m: [8, -2], d: [91, -8] }}>
              <GrassTuft size={34} />
            </Prop>
            <Prop at={{ m: [52, -12], d: [19, -12] }}>
              <GrassTuft size={30} color="#7aad78" />
            </Prop>

            <WalkingCat target={isle1} />
          </Island>
        </div>

        <p className="mx-auto -mt-4 max-w-xs px-6 text-center font-hand text-2xl text-cream/70 md:-mt-10">...keep going. it gets weirder.</p>

        {/* ───────── ISLAND 2 — the path: lanterns & secrets ───────── */}
        <div className="mt-4 md:mt-8">
          <Island align="right" tone="dusk">
            <AreaLabel n="03" />

            {prints.map((x, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 0.5, scale: 1 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ delay: i * 0.18 }}
                className="absolute z-0 hidden md:block"
                style={{ left: `${x}%`, bottom: `calc(var(--g) - ${i % 2 ? 26 : 14}px)`, rotate: '72deg' }}
              >
                <PawPrint size={16} />
              </motion.span>
            ))}

            <Lanterns spots={[{ m: [10, 2], d: [10, 2] }, { m: [46, -10], d: [41, -8] }, { m: [95, 2], d: [97, 2] }]} />

            <Prop at={{ m: [0, 8], d: [52, 10], hm: true }}>
              <Tree size={150} canopy="#3f6650" light="#55806a" />
            </Prop>

            <Poppable label="a wooden sign" lines={town.signLines} {...pos({ m: [27, 6], d: [24, 6] })}>
              <Board>
                <span className="block text-2xl">→</span>
              </Board>
            </Poppable>

            <SecretRock {...pos({ m: [56, -6], d: [57, -6] })} size={84} />

            <HiddenCat {...pos({ m: [68, 10], d: [69, 12] })} />
            <Prop at={{ m: [72, 2], d: [72, 4] }} z={12}>
              <Bush size={120} color="#3f6a50" light="#55806a" />
            </Prop>

            <MysteryPresent {...pos({ m: [86, 2], d: [84, 2] })} />

            <HiddenRawr {...pos({ m: [44, -24], d: [36, -24] })} />
            <Prop at={{ m: [14, -16], d: [17, -16] }}>
              <GrassTuft size={30} color="#5f9060" />
            </Prop>
          </Island>
        </div>

        {/* ───────── ISLAND 3 — night, a quiet house, the way down ───────── */}
        <div className="mt-4 md:mt-8">
          <Island align="left" tone="night">
            <AreaLabel n="04" />
            <CozyHouse />
            <Prop at={{ m: [0, 0], d: [14, 6], hm: true }}>
              <Tree size={140} canopy="#2f5a47" light="#43745c" trunk="#2a1d36" />
            </Prop>
            {[
              { c: '#f4b6c8', p: { m: [10, 2], d: [8, -6] } },
              { c: '#e2b659', p: { m: [17, -8], d: [53, -6] } },
            ].map((f, i) => (
              <Poppable key={i} label="a flower" lines={['pretty.', 'still pretty.']} {...pos(f.p as Pos)}>
                <Flower color={f.c} size={44} />
              </Poppable>
            ))}
            <Prop at={{ m: [62, 4], d: [64, 4] }}>
              <ClickyCat size={118} />
            </Prop>
            <Poppable label="signpost" lines={[town.cornerSign, 'down. that way. go.']} {...pos({ m: [88, 2], d: [87, 2] })}>
              <Board>
                <span className="block text-base leading-none">{town.cornerSign}</span>
              </Board>
            </Poppable>
            <Floater at={{ m: [20, 150], d: [78, 170] }} dur={6.5}>
              <Balloon color="#e2b659" size={30} />
            </Floater>
            <Floater at={{ m: [26, 176], d: [82, 196] }} delay={1.2} dur={7.5}>
              <Balloon color="#f4b6c8" size={30} />
            </Floater>
          </Island>
        </div>
      </div>

      {/* a very small gold star in the sky — easy to miss on purpose */}
      <TinyStar className="left-[68%] top-[36%] z-20 md:left-[60%] md:top-[35%]" />

      <WishStars active={inView} />
    </section>
  )
}
