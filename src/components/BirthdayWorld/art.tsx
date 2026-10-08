import type { CSSProperties } from 'react'

/* Hand-drawn-ish SVG props for the world. Everything is a small inline SVG. */

interface S {
  size?: number
  className?: string
  style?: CSSProperties
}

export function Flower({ color = '#f4b6c8', center = '#e2b659', size = 54, className = '', style }: S & { color?: string; center?: string }) {
  return (
    <svg viewBox="0 0 60 90" width={size} height={size * 1.5} className={`sway ${className}`} style={style} aria-hidden>
      <path d="M30 88 C 28 70, 32 56, 30 40" stroke="#4d7a58" strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <path d="M30 72 C 18 68, 13 60, 13 55 C 24 55, 29 61, 30 72Z" fill="#5d9468" />
      <path d="M30 63 C 42 59, 47 51, 47 47 C 36 47, 31 53, 30 63Z" fill="#4d7a58" />
      <g transform="translate(30 28)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="0" cy="-12" rx="8.5" ry="12" fill={color} transform={`rotate(${r})`} />
        ))}
        <circle r="7" fill={center} />
      </g>
    </svg>
  )
}

export function Tree({
  canopy = '#4f7a5e',
  light = '#648f72',
  trunk = '#3a2630',
  size = 170,
  className = '',
  style,
}: S & { canopy?: string; light?: string; trunk?: string }) {
  return (
    <svg viewBox="0 0 120 160" width={size} height={size * 1.33} className={className} style={style} aria-hidden>
      <path d="M53 158 L55 90 L66 90 L68 158Z" fill={trunk} />
      <circle cx="60" cy="58" r="38" fill={canopy} />
      <circle cx="33" cy="82" r="26" fill={canopy} />
      <circle cx="88" cy="82" r="27" fill={canopy} />
      <circle cx="60" cy="34" r="24" fill={canopy} />
      <circle cx="48" cy="48" r="16" fill={light} opacity=".75" />
      <circle cx="78" cy="74" r="13" fill={light} opacity=".6" />
      <circle cx="30" cy="80" r="10" fill={light} opacity=".55" />
    </svg>
  )
}

export function Bush({ size = 110, className = '', style, color = '#4a7358', light = '#5f8d6c' }: S & { color?: string; light?: string }) {
  return (
    <svg viewBox="0 0 120 70" width={size} height={size * 0.58} className={className} style={style} aria-hidden>
      <circle cx="30" cy="44" r="26" fill={color} />
      <circle cx="62" cy="34" r="32" fill={color} />
      <circle cx="94" cy="46" r="24" fill={color} />
      <circle cx="52" cy="28" r="12" fill={light} opacity=".7" />
      <circle cx="26" cy="38" r="8" fill={light} opacity=".6" />
      <circle cx="84" cy="40" r="7" fill="#f4b6c8" />
      <circle cx="44" cy="52" r="5" fill="#f4b6c8" />
      <circle cx="70" cy="22" r="5" fill="#f4b6c8" />
    </svg>
  )
}

export function House({
  wall = '#e8d5b8',
  roof = '#8c1c2c',
  lit = false,
  size = 170,
  className = '',
  style,
  smoke = true,
}: S & { wall?: string; roof?: string; lit?: boolean; smoke?: boolean }) {
  return (
    <svg viewBox="0 0 160 150" width={size} height={size * 0.94} className={className} style={style} aria-hidden>
      {smoke && (
        <g fill="#f6ead6">
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="118" cy="22" r="5" style={{ animation: `smoke 4s ${i * 1.3}s infinite ease-out`, opacity: 0 }} />
          ))}
        </g>
      )}
      <rect x="108" y="22" width="16" height="34" fill="#5b2230" />
      <rect x="20" y="64" width="120" height="80" rx="3" fill={wall} />
      <path d="M8 70 L80 12 L152 70 Z" fill={roof} />
      <path d="M18 66 L80 18 L142 66" stroke="#00000022" strokeWidth="3" fill="none" />
      <rect x="66" y="98" width="28" height="46" rx="14" fill="#3a1f2a" />
      <circle cx="87" cy="124" r="2.4" fill="#e2b659" />
      <rect x="106" y="82" width="26" height="26" rx="4" fill={lit ? '#ffd98a' : '#33233f'} stroke="#5b2230" strokeWidth="3" />
      <rect x="28" y="82" width="26" height="26" rx="4" fill="#ffd98a" opacity=".85" stroke="#5b2230" strokeWidth="3" />
      <path d="M119 82 V108 M106 95 H132 M41 82 V108 M28 95 H54" stroke="#5b2230" strokeWidth="2" />
      {lit && <circle cx="119" cy="95" r="34" fill="#ffd98a" opacity=".18" />}
    </svg>
  )
}

export function Lantern({ lit = false, size = 70, className = '', style }: S & { lit?: boolean }) {
  return (
    <svg viewBox="0 0 60 150" width={size} height={size * 2.5} className={className} style={style} aria-hidden>
      <path d="M22 150 V16 Q22 6 36 6" stroke="#3a2630" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="38" cy="38" r={lit ? 42 : 0} fill="url(#lg)" style={{ transition: 'all .6s' }} />
      <defs>
        <radialGradient id="lg">
          <stop offset="0" stopColor="#ffd98a" stopOpacity=".75" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M38 6 V14" stroke="#3a2630" strokeWidth="2.5" />
      <rect x="28" y="12" width="20" height="5" rx="2" fill="#5b2230" />
      <rect
        x="29"
        y="17"
        width="18"
        height="30"
        rx="7"
        fill={lit ? '#ffd98a' : '#7a5a66'}
        stroke="#5b2230"
        strokeWidth="2"
        className={lit ? 'flicker' : ''}
        style={{ transition: 'fill .5s' }}
      />
      <path d="M38 17 V47" stroke="#5b223066" strokeWidth="1.5" />
      <rect x="31" y="46" width="14" height="4" rx="2" fill="#5b2230" />
    </svg>
  )
}

export function Balloon({ color = '#b3202f', size = 46, className = '', style }: S & { color?: string }) {
  return (
    <svg viewBox="0 0 40 100" width={size} height={size * 2.5} className={className} style={style} aria-hidden>
      <path d="M20 46 C 14 62, 26 70, 20 98" stroke="#f6ead688" strokeWidth="1.5" fill="none" />
      <ellipse cx="20" cy="24" rx="17" ry="21" fill={color} />
      <path d="M17 45 L20 50 L23 45 Z" fill={color} />
      <ellipse cx="13" cy="16" rx="4" ry="7" fill="#fff" opacity=".28" transform="rotate(20 13 16)" />
    </svg>
  )
}

export function Present({
  box = '#b3202f',
  lid = '#8c1c2c',
  ribbon = '#e2b659',
  size = 80,
  open = false,
  className = '',
  style,
}: S & { box?: string; lid?: string; ribbon?: string; open?: boolean }) {
  return (
    <svg viewBox="0 0 80 90" width={size} height={size * 1.12} className={className} style={style} aria-hidden>
      <ellipse cx="40" cy="86" rx="32" ry="4" fill="#000" opacity=".25" />
      <rect x="8" y="40" width="64" height="44" rx="3" fill={box} />
      <rect x="34" y="40" width="12" height="44" fill={ribbon} />
      <g style={{ transformBox: 'fill-box', transformOrigin: '10% 100%', transform: open ? 'translate(18px,-26px) rotate(28deg)' : 'none', transition: 'transform .45s cubic-bezier(.3,1.6,.5,1)' }}>
        <rect x="4" y="28" width="72" height="16" rx="3" fill={lid} />
        <rect x="34" y="28" width="12" height="16" fill={ribbon} />
        <path d="M40 28 C 28 8, 14 14, 22 26 C 28 30, 36 28, 40 28Z" fill={ribbon} />
        <path d="M40 28 C 52 8, 66 14, 58 26 C 52 30, 44 28, 40 28Z" fill={ribbon} />
        <circle cx="40" cy="27" r="4.5" fill="#c9962f" />
      </g>
    </svg>
  )
}

export function Rock({ size = 100, mood = 'plain', className = '', style }: S & { mood?: 'plain' | 'cry' }) {
  return (
    <svg viewBox="0 0 100 70" width={size} height={size * 0.7} className={className} style={style} aria-hidden>
      <ellipse cx="50" cy="66" rx="42" ry="4" fill="#000" opacity=".25" />
      <path d="M8 62 C2 40 16 18 42 14 C 62 8 86 22 92 44 C 97 57 95 63 88 64 Z" fill="#8a7e92" />
      <path d="M14 56 C10 40 22 24 42 20 C 36 30 30 44 34 62 Z" fill="#a396ab" opacity=".7" />
      <path d="M70 18 C84 24 90 36 90 46" stroke="#6e6378" strokeWidth="3" fill="none" strokeLinecap="round" />
      {mood === 'cry' && (
        <g>
          <circle cx="42" cy="38" r="2.6" fill="#1b0f26" />
          <circle cx="62" cy="38" r="2.6" fill="#1b0f26" />
          <path d="M45 52 q5 -5 12 0" stroke="#1b0f26" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M42 41 v10 M62 41 v10" stroke="#8fd3ff" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  )
}

export function Cloud({ size = 160, className = '', style, tone = '#f6ead6' }: S & { tone?: string }) {
  return (
    <svg viewBox="0 0 160 60" width={size} height={size * 0.375} className={className} style={style} aria-hidden>
      <path
        d="M30 56 C8 56 6 32 28 30 C28 12 54 6 66 22 C74 8 104 10 108 30 C130 22 150 40 138 56 Z"
        fill={tone}
        opacity=".9"
      />
    </svg>
  )
}

export function Moon({ size = 110, className = '', style }: S) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id="mg">
          <stop offset="0.45" stopColor="#f6ead6" stopOpacity=".35" />
          <stop offset="1" stopColor="#f6ead6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="60" fill="url(#mg)" />
      <circle cx="60" cy="60" r="34" fill="#f8efdc" />
      <circle cx="48" cy="52" r="6" fill="#e5d6bb" />
      <circle cx="72" cy="70" r="8" fill="#e5d6bb" />
      <circle cx="68" cy="46" r="3.5" fill="#e5d6bb" />
    </svg>
  )
}

export function Streetlight({ size = 90, className = '', style }: S) {
  return (
    <svg viewBox="0 0 90 260" width={size} height={size * 2.9} className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd98a" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M42 40 L-10 258 L100 258 Z" fill="url(#cone)" />
      <rect x="42" y="30" width="6" height="226" fill="#2a1d33" />
      <rect x="34" y="248" width="22" height="10" rx="2" fill="#2a1d33" />
      <path d="M26 34 L64 34 L58 18 L32 18 Z" fill="#2a1d33" />
      <rect x="32" y="34" width="26" height="12" rx="3" fill="#ffd98a" className="flicker" />
    </svg>
  )
}

export function PawPrint({ size = 22, className = '', style }: S) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} aria-hidden>
      <g fill="#f6ead6">
        <ellipse cx="12" cy="16.5" rx="5.2" ry="4.4" />
        <ellipse cx="5" cy="10" rx="2.2" ry="2.9" />
        <ellipse cx="9.5" cy="5.8" rx="2.2" ry="3" />
        <ellipse cx="14.5" cy="5.8" rx="2.2" ry="3" />
        <ellipse cx="19" cy="10" rx="2.2" ry="2.9" />
      </g>
    </svg>
  )
}

export function GrassTuft({ size = 36, className = '', style, color = '#6b9c6c' }: S & { color?: string }) {
  return (
    <svg viewBox="0 0 40 30" width={size} height={size * 0.75} className={`sway ${className}`} style={style} aria-hidden>
      <path d="M6 30 Q8 14 2 4 Q12 12 14 30Z M16 30 Q16 10 18 0 Q26 10 24 30Z M26 30 Q30 16 38 8 Q36 22 34 30Z" fill={color} />
    </svg>
  )
}

export function Popcorn({ size = 72, className = '', style }: S) {
  return (
    <svg viewBox="0 0 80 100" width={size} height={size * 1.25} className={className} style={style} aria-hidden>
      <g fill="#fff3cf" stroke="#e8cf8a" strokeWidth="1">
        {[[20, 26, 11], [36, 18, 13], [54, 24, 12], [66, 32, 9], [28, 36, 10], [46, 34, 11]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
      <path d="M10 38 L18 96 H62 L70 38 Z" fill="#f6ead6" />
      <path d="M22 38 L26 96 M36 38 L37 96 M50 38 L49 96 M62 38 L58 96" stroke="#b3202f" strokeWidth="9" />
      <path d="M10 38 L18 96 H62 L70 38 Z" fill="none" stroke="#8c1c2c" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export function Cake({ lit = true, size = 150, className = '', style }: S & { lit?: boolean }) {
  return (
    <svg viewBox="0 0 150 150" width={size} height={size} className={className} style={style} aria-hidden>
      <ellipse cx="75" cy="140" rx="64" ry="7" fill="#000" opacity=".3" />
      <rect x="18" y="86" width="114" height="52" rx="8" fill="#f4b6c8" />
      <path d="M18 98 q10 12 19 0 t19 0 t19 0 t19 0 t19 0 t19 0" fill="#f6ead6" stroke="none" />
      <rect x="32" y="52" width="86" height="40" rx="8" fill="#f6ead6" />
      <path d="M32 64 q10 12 17 0 t17 0 t17 0 t17 0 t17 0" fill="#b3202f" />
      <rect x="71" y="26" width="8" height="28" rx="2" fill="#e2b659" />
      <path d="M71 34 l8 6 M71 42 l8 6" stroke="#b3202f" strokeWidth="2" />
      {lit && (
        <g className="flicker">
          <ellipse cx="75" cy="16" rx="12" ry="14" fill="#ffd98a" opacity=".3" />
          <path d="M75 6 C 68 15, 68 24, 75 26 C 82 24, 82 15, 75 6Z" fill="#ffb347" />
          <path d="M75 14 C 72 19, 72 23, 75 24 C 78 23, 78 19, 75 14Z" fill="#fff3cf" />
        </g>
      )}
      <circle cx="46" cy="76" r="3" fill="#8c1c2c" />
      <circle cx="104" cy="76" r="3" fill="#8c1c2c" />
    </svg>
  )
}

export function Heart({ size = 24, color = '#f4b6c8', className = '', style }: S & { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} aria-hidden>
      <path d="M12 21 C 4 14, 2 9, 6 5.5 C 9 3.5, 11.5 5.5, 12 7 C 12.5 5.5, 15 3.5, 18 5.5 C 22 9, 20 14, 12 21Z" fill={color} />
    </svg>
  )
}

/** Hills as a wavy silhouette. `d` is a path in a 0..1440 x 0..200 box. */
export function Hills({ fill, d, className = '', style }: { fill: string; d?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <path
        d={d ?? 'M0 120 C 180 40 360 40 540 100 C 720 160 900 40 1080 70 C 1240 96 1340 60 1440 80 V200 H0Z'}
        fill={fill}
      />
    </svg>
  )
}
