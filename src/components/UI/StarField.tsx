import { memo, useMemo } from 'react'

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/**
 * Hundreds of stars for the price of three DOM nodes:
 * each layer is one 1px element whose box-shadow draws every star.
 */
export const StarField = memo(function StarField({
  count = 120,
  seed = 7,
  height = 1000,
  className = '',
}: {
  count?: number
  seed?: number
  height?: number
  className?: string
}) {
  const layers = useMemo(() => {
    const r = rng(seed)
    const palette = ['#fff7e6', '#f6ead6', '#f4b6c8', '#e2b659', '#c9b2e6']
    const make = (n: number, big: boolean) =>
      Array.from({ length: n }, () => {
        const x = (r() * 100).toFixed(2)
        const y = Math.round(r() * height)
        const c = palette[Math.floor(r() * palette.length)]
        return `${x}vw ${y}px 0 ${big ? '0.5px' : '0'} ${c}`
      }).join(',')
    return [
      { s: make(Math.floor(count * 0.6), false), d: '4.5s', size: 1.5 },
      { s: make(Math.floor(count * 0.3), true), d: '3.2s', size: 2 },
      { s: make(Math.floor(count * 0.1), true), d: '5.8s', size: 3 },
    ]
  }, [count, seed, height])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {layers.map((l, i) => (
        <div
          key={i}
          className="twinkle absolute left-0 top-0 rounded-full"
          style={{ width: l.size, height: l.size, boxShadow: l.s, animationDuration: l.d, animationDelay: `${i * -1.3}s` }}
        />
      ))}
    </div>
  )
})
