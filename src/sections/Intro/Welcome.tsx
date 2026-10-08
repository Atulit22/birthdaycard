import { motion } from 'motion/react'
import { Moon, PawPrint } from '../../components/BirthdayWorld/art'
import { Fireflies } from '../../components/BirthdayWorld/Ambient'
import { ClickyCat } from '../../components/Cat/ClickyCat'
import { Reveal } from '../../components/UI/Reveal'
import { StarField } from '../../components/UI/StarField'
import { content } from '../../data/birthdayContent'

/** AREA 01 — the cat introduces the world. */
export function Welcome() {
  const w = content.welcome
  return (
    <section id="welcome" className="relative flex min-h-[100svh] flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-ink via-[#1b0f26] to-[#2a1540] px-6 pb-16 pt-24 text-center">
      <StarField count={110} seed={5} height={900} />
      <Moon size={150} className="absolute -right-8 top-16 opacity-70 md:right-[12%]" />
      <Fireflies count={8} seed={2} />

      <div className="relative z-10">
        <Reveal as="p" className="font-display text-sm uppercase tracking-[.4em] text-blush/80">
          area 01
        </Reveal>
        <Reveal as="p" delay={0.15} className="mt-5 font-hand text-3xl text-cream/80 sm:text-4xl">
          {w.eyebrow}
        </Reveal>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-1 font-display text-[clamp(4.5rem,18vw,11rem)] font-bold italic leading-none text-cream [text-shadow:0_0_40px_rgba(226,182,89,.55),0_4px_0_#8c1c2c]"
        >
          {content.name}
        </motion.h1>
      </div>

      <div className="relative z-10 mt-10 flex flex-col items-center gap-3">
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
