import { AnimatePresence, motion } from 'motion/react'
import { playSound } from '../../audio/useSound'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { eggText } from '../../data/easterEggs'
import { fx } from '../../fx'
import { useWorld } from '../../state/DiscoveryContext'
import { Cat } from '../Cat/Cat'
import { Lantern, Present, Rock } from '../BirthdayWorld/art'
import { pos, type Pos } from '../BirthdayWorld/spot'
import { Poppable } from '../UI/Poppable'

/* Every little secret object lives here. Positions are passed in by the scene. */

/** Secret: the rock. */
export function SecretRock({ className = '', style, size = 100 }: { className?: string; style?: CSSProperties; size?: number }) {
  const { discover } = useWorld()
  const [n, setN] = useState(0)
  return (
    <Poppable
      label="a rock"
      className={className}
      style={style}
      lines={eggText.rock}
      onPop={(c) => {
        setN(c)
        if (c === 4) discover('rock')
      }}
    >
      <Rock size={size} mood={n >= 4 ? 'cry' : 'plain'} className={n >= 4 ? 'animate-pulse' : ''} />
    </Poppable>
  )
}

/** Secret: the suspicious present. Shake → open → the cat was inside. */
export function MysteryPresent({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const { discover } = useWorld()
  const [stage, setStage] = useState<0 | 1 | 2>(0)
  const [text, setText] = useState<string | null>(null)
  const [shaking, setShaking] = useState(0)

  const click = () => {
    if (stage === 0) {
      setStage(1)
      setShaking((s) => s + 1)
      setText(eggText.present.first)
    } else if (stage === 1) {
      setStage(2)
      setText(eggText.present.second)
      fx.confetti({ x: 0.5, y: 0.6, count: 70 })
      window.setTimeout(() => setText(eggText.present.third), 1700)
      discover('present')
    }
  }

  return (
    <div className={`absolute ${className}`} style={style}>
      <Poppable
        label="a suspicious present"
        inline
        text={text}
        ms={2200}
        onPop={click}
        disabled={stage === 2}
      >
        <div className="relative">
          {stage === 2 && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: -34, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.1 }}
              className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden"
              style={{ zIndex: 0 }}
            >
              <Cat pose="peek" size={84} mood="happy" hat look={false} autoYawn={false} />
            </motion.div>
          )}
          <div
            key={shaking}
            className="relative z-10"
            style={{ animation: stage === 1 ? 'rattle .5s ease-in-out 3' : undefined, transformOrigin: '50% 100%' }}
          >
            <Present size={86} box="#2b1a3a" lid="#1b0f26" ribbon="#b3202f" open={stage === 2} />
            {stage === 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold font-hand text-sm leading-none text-ink">
                ?
              </span>
            )}
          </div>
        </div>
      </Poppable>
    </div>
  )
}

/** Secret: a very small gold star in the sky. */
export function TinyStar({ className = '' }: { className?: string }) {
  const { discover, found } = useWorld()
  const [open, setOpen] = useState(false)
  const done = found.includes('star')
  return (
    <div className={`absolute ${className}`}>
      <button
        aria-label="a tiny star"
        onClick={() => {
          setOpen((o) => !o)
          playSound('sparkle')
          discover('star')
        }}
        className="grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
      >
        <span
          className="glowpulse block h-2 w-2 rotate-45 bg-gold"
          style={{ boxShadow: '0 0 8px 2px #e2b659', clipPath: 'polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%)', transform: 'scale(2.2)' }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute left-1/2 top-9 z-30 w-56 -translate-x-1/2 rounded-xl bg-paper p-3 text-center text-ink shadow-2xl"
            style={{ rotate: -2 }}
            onClick={() => setOpen(false)}
          >
            <p className="font-hand text-2xl leading-none text-wine">{eggText.tinyStar.found}</p>
            {done && (
              <>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-ink/50">{eggText.tinyStar.memoryTitle}</p>
                <p className="mt-1 text-sm leading-snug">{eggText.tinyStar.memory}</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Secret: the word "rawr" camouflaged in the grass. */
export function HiddenRawr({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const { discover } = useWorld()
  const [roar, setRoar] = useState(0)
  const [text, setText] = useState<string | null>(null)
  return (
    <Poppable
      label="a faint word in the grass"
      className={className}
      style={style}
      text={text}
      onPop={() => {
        setRoar((r) => r + 1)
        setText(eggText.rawr.bubble)
        fx.shake()
        playSound('catMeow')
        discover('rawr')
      }}
    >
      <span key={roar} className="flex font-hand text-3xl font-bold tracking-wide text-[#8cb58f]/25 transition-colors hover:text-[#cfe9cf]/70 sm:text-4xl">
        {'rawr'.split('').map((ch, i) => (
          <span
            key={i}
            className="inline-block"
            style={roar ? { animation: `hop .5s ${i * 0.07}s ease-out 2`, color: '#f6ead6' } : undefined}
          >
            {ch}
          </span>
        ))}
      </span>
    </Poppable>
  )
}

/** Secret: three lanterns to light. All lit → the path glows. */
export function Lanterns({ spots }: { spots: Pos[] }) {
  const { discover } = useWorld()
  const [lit, setLit] = useState<boolean[]>(() => spots.map(() => false))
  useEffect(() => {
    if (lit.every(Boolean)) discover('lanterns')
  }, [lit, discover])
  return (
    <>
      {spots.map((spot, i) => (
        <Poppable
          key={i}
          label={lit[i] ? 'a glowing lantern' : 'a dark lantern'}
          {...pos(spot)}
          onPop={() => {
            if (!lit[i]) {
              setLit((l) => l.map((v, j) => (j === i ? true : v)))
              if (lit.filter(Boolean).length === spots.length - 1) fx.confetti({ x: 0.5, y: 0.7, count: 40, shapes: ['star', 'dot'], power: 9 })
            }
          }}
        >
          <Lantern lit={lit[i]} size={60} />
        </Poppable>
      ))}
    </>
  )
}

/** Secret: a cat peeking from behind a bush. Clicking reveals it. */
export function HiddenCat({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const { discover, found } = useWorld()
  const done = found.includes('hiddenCat')
  return (
    <Poppable
      label="something peeking from behind the bush"
      className={className}
      style={style}
      text={done ? eggText.hiddenCat : null}
      onPop={() => discover('hiddenCat')}
    >
      <motion.div
        initial={false}
        animate={{ y: done ? -14 : 24, rotate: done ? [0, -6, 6, 0] : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
      >
        <Cat pose="peek" size={78} mood={done ? 'happy' : 'calm'} blinkDelay={1.2} />
      </motion.div>
    </Poppable>
  )
}

/** Typing "meow" anywhere summons cats. */
export function KeywordListener() {
  const { discover, entered } = useWorld()
  const buf = useRef('')
  useEffect(() => {
    if (!entered) return
    const h = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return
      buf.current = (buf.current + e.key.toLowerCase()).slice(-8)
      if (buf.current.endsWith('squirtle')) {
        playSound('splash')
        for (const x of [0.25, 0.5, 0.75]) fx.confetti({ x, y: 0.85, count: 22, power: 13, shapes: ['dot'], spread: 0.9 })
        discover('squirtle')
        buf.current = ''
      } else if (buf.current.endsWith('meow')) {
        fx.catRain()
        playSound('catMeow')
        discover('meow')
        buf.current = ''
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [discover, entered])
  return null
}
