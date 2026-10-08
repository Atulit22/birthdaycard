import { motion, useScroll, useTransform } from 'motion/react'
import { useMemo, useRef, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useCursor'
import { Cloud } from './art'

/** Moves its children vertically at a different speed than the page → depth. */
export function Parallax({ children, amount = 60, className = '', style }: { children: ReactNode; amount?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount])
  return (
    <motion.div ref={ref} style={{ y: reduced ? 0 : y, ...style }} className={className}>
      {children}
    </motion.div>
  )
}

/** A few drifting fireflies — pure CSS, 12 elements. */
export function Fireflies({ count = 12, seed = 3 }: { count?: number; seed?: number }) {
  const flies = useMemo(() => {
    let s = seed
    const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
    return Array.from({ length: count }, () => ({
      x: r() * 100,
      y: 20 + r() * 70,
      dx: (r() - 0.5) * 140,
      dy: (r() - 0.5) * 100,
      dur: 7 + r() * 8,
      delay: -r() * 12,
    }))
  }, [count, seed])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {flies.map((f, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#ffe9a0]"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            boxShadow: '0 0 10px 3px rgba(255,224,130,.8)',
            animation: `firefly ${f.dur}s ${f.delay}s infinite ease-in-out`,
            ['--dx' as string]: `${f.dx}px`,
            ['--dy' as string]: `${f.dy}px`,
          }}
        />
      ))}
    </div>
  )
}

/** Slow-drifting clouds. */
export function Clouds({ tone = '#f6ead6', rows = [8, 22, 40], opacity = 0.5 }: { tone?: string; rows?: number[]; opacity?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden style={{ opacity }}>
      {rows.map((top, i) => (
        <div
          key={i}
          className="absolute left-0"
          style={{
            top: `${top}%`,
            animation: `drift ${90 + i * 40}s linear infinite`,
            animationDelay: `${-i * 38}s`,
          }}
        >
          <Cloud size={130 + ((i * 53) % 90)} tone={tone} />
        </div>
      ))}
    </div>
  )
}
