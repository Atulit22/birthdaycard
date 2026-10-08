import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { Cake, Heart, Moon } from '../../components/BirthdayWorld/art'
import { Fireflies } from '../../components/BirthdayWorld/Ambient'
import { Cat } from '../../components/Cat/Cat'
import { StarField } from '../../components/UI/StarField'
import { content } from '../../data/birthdayContent'
import { fx } from '../../fx'
import { usePrefersReducedMotion } from '../../hooks/useCursor'
import { useWorld } from '../../state/DiscoveryContext'

function Envelope({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Open the envelope: For Ishita"
      className="group relative block h-[150px] w-[230px] outline-offset-8 [perspective:900px] sm:h-[190px] sm:w-[290px]"
    >
      <div className={`glowpulse absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(255,217,138,.55),transparent_65%)] transition-opacity duration-700 ${open ? 'opacity-30' : ''}`} />
      <div className="absolute inset-0 rounded-md bg-[#cfae8a] shadow-[0_20px_40px_-10px_rgba(0,0,0,.8)]" />
      <motion.div
        animate={{ y: open ? -96 : 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 16, delay: open ? 0.45 : 0 }}
        className="absolute inset-x-3 bottom-3 top-3 rounded-sm bg-paper px-4 pt-4"
      >
        <div className="space-y-2 opacity-30">
          <div className="h-1 w-2/3 rounded bg-ink" />
          <div className="h-1 w-full rounded bg-ink" />
          <div className="h-1 w-5/6 rounded bg-ink" />
        </div>
      </motion.div>
      <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#f6ead6] to-[#e8d5b8] [clip-path:polygon(0_0,50%_54%,100%_0,100%_100%,0_100%)]" />
      <motion.div
        initial={false}
        animate={{ rotateX: open ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformOrigin: 'top', clipPath: 'polygon(0 0,100% 0,50% 100%)', height: '56%', zIndex: open ? 0 : 20 }}
        className="absolute inset-x-0 top-0 bg-gradient-to-b from-blush to-[#e48fae]"
      />
      <div className={`absolute left-1/2 top-[44%] z-30 -translate-x-1/2 transition-opacity ${open ? 'opacity-0' : ''}`}>
        <Heart size={30} color="#b3202f" className="drop-shadow-lg" />
      </div>
      <p className="absolute inset-x-0 bottom-3 z-30 text-center font-hand text-3xl text-wine sm:text-4xl">{content.final.envelopeLabel}</p>
    </button>
  )
}

/** The last place. Quiet, night, one envelope. */
export function FinalMessage() {
  const f = content.final
  const { found, discover, say } = useWorld()
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)
  const [out, setOut] = useState(false)
  const secRef = useRef<HTMLElement>(null)
  const conRef = useRef<HTMLDivElement>(null)

  const track = (e: React.PointerEvent) => {
    const el = conRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const blow = () => {
    if (out) return
    setOut(true)
    discover('wish')
    fx.confetti({ x: 0.5, y: 0.6, count: 110, shapes: ['star', 'heart', 'dot'], power: 14 })
    window.setTimeout(() => say(f.wishDone, 5000), 600)
  }

  const secrets = found.length + (out ? 0 : 0)

  return (
    <section
      ref={secRef}
      id="final"
      onPointerMove={track}
      onPointerDown={track}
      className="relative overflow-hidden bg-gradient-to-b from-[#120a14] via-[#0a0614] to-[#05030a] px-5 pb-40 pt-32 text-center"
    >
      <StarField count={260} seed={77} height={3000} />
      <Moon size={110} className="absolute right-[8%] top-16 opacity-80" />
      <Fireflies count={10} seed={5} />

      {/* a cat-shaped constellation that only shows near your cursor */}
      <div
        ref={conRef}
        className="pointer-events-none absolute left-1/2 top-24 w-[min(480px,86vw)] -translate-x-1/2"
        style={{ ['--mx' as string]: '-999px', ['--my' as string]: '-999px' }}
        aria-hidden
      >
        {[0.1, 1].map((o, i) => (
          <svg
            key={i}
            viewBox="0 0 300 240"
            className={i ? 'absolute inset-0' : ''}
            style={{
              opacity: o,
              maskImage: i ? 'radial-gradient(circle 150px at var(--mx) var(--my), #000 0%, transparent 100%)' : undefined,
              WebkitMaskImage: i ? 'radial-gradient(circle 150px at var(--mx) var(--my), #000 0%, transparent 100%)' : undefined,
            }}
          >
            <path
              d="M70 120 L58 38 L112 82 L188 82 L242 38 L230 120 C 240 170, 200 210, 150 214 C 100 210, 60 170, 70 120 Z M115 140 L150 165 L185 140"
              stroke="#e2b659"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3 4"
            />
            {[[70, 120], [58, 38], [112, 82], [188, 82], [242, 38], [230, 120], [150, 214], [115, 140], [185, 140], [150, 165]].map(([x, y], j) => (
              <circle key={j} cx={x} cy={y} r="3" fill="#fff3cf" />
            ))}
          </svg>
        ))}
      </div>

      <div className="relative mx-auto max-w-2xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="font-display text-xs uppercase tracking-[.4em] text-cream/50"
        >
          area 08 · the quiet part
        </motion.p>

        {/* cat + envelope */}
        <div className="mt-[22vh] flex flex-col-reverse items-center justify-center gap-6 sm:mt-[26vh] sm:flex-row sm:items-end sm:gap-14">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
            <Cat pose={out ? 'sleep' : 'sit'} size={out ? 170 : 130} blinkDelay={2} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }}>
            <Envelope open={open} onOpen={() => setOpen(true)} />
          </motion.div>
        </div>
        {!open && <p className="mt-10 font-hand text-2xl text-cream/60">{f.envelopeHint}</p>}

        {/* the letter */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 1.2, delay: 0.7 }}
              className="overflow-hidden"
            >
              <div className="pt-24">
                <div
                  className="mx-auto max-w-lg rotate-[-0.8deg] rounded-sm px-7 py-10 text-left text-ink shadow-[0_30px_60px_-10px_rgba(0,0,0,.85)] sm:px-12"
                  style={{ background: 'repeating-linear-gradient(#fbf3e4 0 35px, #e3d3b6 35px 36px)' }}
                >
                  {f.letter.map((p, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 1, delay: reduced ? 0 : 0.1 }}
                      className={`font-hand text-[1.65rem] leading-[36px] ${i === 0 ? 'text-wine' : ''}`}
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 1.6 }}
                className="pt-24"
              >
                <h2 className="font-display text-[clamp(2.4rem,9vw,5rem)] font-bold italic leading-tight text-cream [text-shadow:0_0_40px_rgba(244,182,200,.7),0_0_90px_rgba(226,182,89,.4)]">
                  {f.signoff}
                </h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2.2, duration: 1.2 }}
                  className="mt-3 font-hand text-4xl text-gold"
                >
                  {f.rawr}
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col items-center pt-28"
              >
                <p className="mb-2 max-w-xs font-hand text-2xl text-cream/70">{out ? f.wishDone : f.wishPrompt}</p>
                <button onClick={blow} aria-label="Blow out the candle" disabled={out} className="relative transition-transform hover:scale-105">
                  <Cake lit={!out} size={160} />
                  {out && (
                    <>
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="absolute left-1/2 top-3 h-3 w-3 rounded-full bg-cream/50 blur-[2px]"
                          style={{ animation: `smoke 2.6s ${i * 0.5}s ease-out forwards` }}
                        />
                      ))}
                    </>
                  )}
                </button>

                {out && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }} className="mt-16">
                    <p className="font-hand text-2xl text-cream/70">{f.secretsLine.replace('{n}', String(secrets))}</p>
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
                      className="mt-5 rounded-full border border-cream/30 px-6 py-2.5 font-display text-cream/80 transition hover:border-gold hover:text-gold"
                    >
                      {f.restart}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
