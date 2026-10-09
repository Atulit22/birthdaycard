import type { CSSProperties } from 'react'

/** A two-tier cake with three candles. `playing` makes the flames dance faster and flare. */
export function BirthdayCake({ size = 230, playing = false, reduced = false, lit = true }: { size?: number; playing?: boolean; reduced?: boolean; lit?: boolean }) {
  const candles = [
    { x: 84, c: '#f4b6c8' },
    { x: 110, c: '#e2b659' },
    { x: 136, c: '#f4b6c8' },
  ]
  const flame = (i: number): CSSProperties => ({
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    transform: playing ? 'scale(1.3)' : 'scale(1)',
    transition: 'transform .4s ease',
    animation: reduced ? undefined : `flicker ${playing ? 0.4 + i * 0.07 : 2.6}s ease-in-out ${i * 0.3}s infinite`,
  })
  return (
    <svg viewBox="0 0 220 190" width={size} height={(size * 190) / 220} aria-hidden className="overflow-visible">
      <defs>
        <linearGradient id="bc-bottom" x1="0" x2="1">
          <stop offset="0" stopColor="#f6a9c0" />
          <stop offset="1" stopColor="#e48fae" />
        </linearGradient>
        <linearGradient id="bc-top" x1="0" x2="1">
          <stop offset="0" stopColor="#fbf3e4" />
          <stop offset="1" stopColor="#ecd9bd" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="176" rx="96" ry="9" fill="#000" opacity=".3" />
      <ellipse cx="110" cy="168" rx="92" ry="9" fill="#e9d6c0" />
      {/* bottom tier */}
      <rect x="22" y="112" width="176" height="56" rx="9" fill="url(#bc-bottom)" />
      <path d="M22 124 q11 14 22 0 t22 0 t22 0 t22 0 t22 0 t22 0 t22 0 t22 0" fill="#fbf3e4" />
      {[44, 88, 132, 176].map((x) => (
        <circle key={x} cx={x} cy="148" r="3.5" fill="#8c1c2c" />
      ))}
      {/* top tier */}
      <rect x="48" y="72" width="124" height="44" rx="9" fill="url(#bc-top)" />
      <path d="M48 84 q10.3 13 20.6 0 t20.6 0 t20.6 0 t20.6 0 t20.6 0 t20.6 0" fill="#b3202f" />
      <circle cx="110" cy="64" r="0" fill="none" />
      {/* a tiny heart on the front */}
      <path d="M110 108 c-7 -6 -12 -10 -8 -14 c3 -3 7 -1 8 2 c1 -3 5 -5 8 -2 c4 4 -1 8 -8 14Z" fill="#b3202f" opacity=".8" />
      {/* candles */}
      {candles.map((c, i) => (
        <g key={c.x}>
          <rect x={c.x - 4} y="42" width="8" height="32" rx="2" fill={c.c} />
          <path d={`M${c.x - 4} 50 l8 5 M${c.x - 4} 59 l8 5`} stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
          {lit && (
          <g style={flame(i)}>
            <ellipse cx={c.x} cy="32" rx={playing ? 14 : 11} ry={playing ? 17 : 13} fill="#ffd98a" opacity={playing ? 0.42 : 0.28} />
            <path d={`M${c.x} 20 C ${c.x - 7} 29, ${c.x - 7} 38, ${c.x} 40 C ${c.x + 7} 38, ${c.x + 7} 29, ${c.x} 20Z`} fill="#ffb347" />
            <path d={`M${c.x} 28 C ${c.x - 3} 33, ${c.x - 3} 37, ${c.x} 38 C ${c.x + 3} 37, ${c.x + 3} 33, ${c.x} 28Z`} fill="#fff3cf" />
          </g>
          )}
        </g>
      ))}
    </svg>
  )
}
