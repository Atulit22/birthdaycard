import { useMemo } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useCursor'

const GLYPHS = ['❤', '✦', '★', '✿', '♥', '✧']
const COLORS = ['#f4b6c8', '#e2b659', '#ff6f91', '#f6ead6', '#c9a6e8']

/** Hearts + stars float up the whole screen, plus a soft golden flash. Re-mount (change `fireKey`) to replay. */
export function Celebration({ fireKey }: { fireKey: number }) {
  const reduced = usePrefersReducedMotion()
  const bits = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        i,
        g: GLYPHS[i % GLYPHS.length],
        c: COLORS[i % COLORS.length],
        x: Math.random() * 100,
        s: 18 + Math.random() * 26,
        d: 4 + Math.random() * 3.5,
        delay: Math.random() * 2.2,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fireKey],
  )
  if (!fireKey) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-[78] overflow-hidden" aria-hidden key={fireKey}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#ffe9a0,transparent_65%)]" style={{ animation: 'flash 1.4s ease-out forwards' }} />
      {!reduced &&
        bits.map((b) => (
          <span
            key={b.i}
            className="absolute -bottom-12"
            style={{ left: `${b.x}%`, fontSize: b.s, color: b.c, animation: `rise ${b.d}s ${b.delay}s ease-out forwards`, opacity: 0, textShadow: `0 0 12px ${b.c}` }}
          >
            {b.g}
          </span>
        ))}
    </div>
  )
}
