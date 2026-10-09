import type { CSSProperties } from 'react'

/* The guests at the party. Flat vector people in the same soft style as the rest of the world.
   Every character takes `celebrating` (arms up, big grin) and reads `--lk` (-1…1) from its parent:
   how far the eyes glance toward the middle of the party. All motion is plain CSS keyframes (index.css). */

interface P {
  celebrating?: boolean
  className?: string
  style?: CSSProperties
}

/** a limb that swings around a pivot — angles are set through CSS variables */
const arm = (ox: number, oy: number, a0: number, a1: number, sec: number, delay = 0): CSSProperties =>
  ({
    transformOrigin: `${ox}px ${oy}px`,
    ['--a0' as string]: `${a0}deg`,
    ['--a1' as string]: `${a1}deg`,
    animation: `armSwing ${sec}s ease-in-out ${delay}s infinite`,
  }) as CSSProperties
const wave = (ox: number, oy: number, side: 1 | -1, sec: number, delay = 0): CSSProperties => ({
  transformOrigin: `${ox}px ${oy}px`,
  animation: `${side === 1 ? 'waveBurstL' : 'waveBurstR'} ${sec}s ease-in-out ${delay}s infinite`,
})
const look = (n: number): CSSProperties => ({ transform: `translateX(calc(var(--lk, 0) * ${n}px))` })
const blink = (sec: number, delay = 0): CSSProperties => ({ transformBox: 'fill-box', transformOrigin: 'center', animation: `blink ${sec}s ease-in-out ${delay}s infinite` })

const SKIN = '#d99f7c'

/** ISHU — the birthday girl. Long dark hair, a gold tiara, a pink dress. Always the brightest thing in the scene. */
export function Ishu({ celebrating, className, style }: P) {
  return (
    <svg viewBox="0 0 120 160" className={className} style={style} aria-hidden>
      {/* hair behind */}
      <path d="M26 60 C22 20 44 6 60 6 C78 6 98 20 94 60 C97 92 101 120 93 142 L27 142 C19 120 23 92 26 60Z" fill="#1b0f1f" />
      <path d="M34 40 C40 24 52 18 60 18" stroke="#3b2548" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".7" />
      {/* arms (behind the dress so the sleeves overlap) */}
      <g style={celebrating ? arm(34, 120, 128, 152, 0.55) : arm(34, 120, 5, 11, 3.4)}>
        <rect x="29" y="118" width="10" height="34" rx="5" fill={SKIN} />
        <circle cx="34" cy="153" r="6.5" fill={SKIN} />
      </g>
      <g style={celebrating ? arm(86, 120, -128, -152, 0.55, 0.12) : wave(86, 120, -1, 14, 3)}>
        <rect x="81" y="118" width="10" height="34" rx="5" fill={SKIN} />
        <circle cx="86" cy="153" r="6.5" fill={SKIN} />
      </g>
      {/* dress */}
      <path d="M26 160 L28 128 C30 112 44 106 60 106 C76 106 90 112 92 128 L94 160Z" fill="#e86f9a" />
      <circle cx="34" cy="120" r="9.5" fill="#e86f9a" />
      <circle cx="86" cy="120" r="9.5" fill="#e86f9a" />
      <path d="M46 107 Q60 128 74 107Z" fill={SKIN} />
      <path d="M46 107 Q60 128 74 107" stroke="#c9507c" strokeWidth="2" fill="none" />
      <path d="M60 134 c-5 -4 -8 -7 -5.5 -10 c2 -2 4.5 -1 5.5 1 c1 -2 3.5 -3 5.5 -1 c2.5 3 -0.5 6 -5.5 10Z" fill="#e2b659" />
      {/* neck + head */}
      <rect x="53" y="90" width="14" height="20" fill={SKIN} />
      <g style={arm(60, 96, -2, 2, 5.5)}>
        <circle cx="36" cy="62" r="4" fill={SKIN} />
        <circle cx="84" cy="62" r="4" fill={SKIN} />
        <circle cx="36" cy="68" r="2" fill="#e2b659" />
        <circle cx="84" cy="68" r="2" fill="#e2b659" />
        <ellipse cx="60" cy="58" rx="24" ry="26" fill={SKIN} />
        {/* hair front */}
        <path d="M34 58 C31 30 46 19 62 21 C80 22 91 36 86 58 C80 44 70 37 58 38 C48 40 39 47 34 58Z" fill="#1b0f1f" />
        <path d="M33 54 C27 74 27 94 31 114 L38 114 C36 94 37 74 40 58Z" fill="#1b0f1f" />
        <path d="M87 54 C93 74 93 94 89 114 L82 114 C84 94 83 74 80 58Z" fill="#1b0f1f" />
        {/* tiara */}
        <path d="M43 26 L47 12 L53 21 L60 8 L67 21 L73 12 L77 26Z" fill="#e2b659" />
        <circle cx="60" cy="14" r="2.4" fill="#fff3cf" />
        {/* face */}
        <g style={blink(5.2, 0.8)}>
          <g style={look(2)}>
            <ellipse cx="50" cy="60" rx="4.3" ry="5.2" fill="#2a1420" />
            <ellipse cx="70" cy="60" rx="4.3" ry="5.2" fill="#2a1420" />
            <circle cx="51.6" cy="58" r="1.5" fill="#fff" />
            <circle cx="71.6" cy="58" r="1.5" fill="#fff" />
          </g>
        </g>
        <path d="M44 55 l-3 -2 M76 55 l3 -2" stroke="#2a1420" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M45 50 Q50 47 55 50 M65 50 Q70 47 75 50" stroke="#1b0f1f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="71" r="5" fill="#ff8fa8" opacity=".5" />
        <circle cx="77" cy="71" r="5" fill="#ff8fa8" opacity=".5" />
        {celebrating ? (
          <>
            <path d="M51 71 Q60 86 69 71Z" fill="#8c1c2c" />
            <path d="M55 79 Q60 76 65 79 Q60 84 55 79Z" fill="#f08fa6" />
          </>
        ) : (
          <path d="M52 72 Q60 80 68 72" stroke="#8c1c2c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        )}
      </g>
    </svg>
  )
}

/** ME — the guy who made all this. Hoodie, messy hair, a paper party hat, applauding. */
export function Me({ celebrating, className, style }: P) {
  const skin = '#cf9670'
  return (
    <svg viewBox="0 -16 130 181" className={className} style={style} aria-hidden>
      {/* hood behind the neck */}
      <path d="M30 120 C32 100 48 94 65 94 C82 94 98 100 100 120Z" fill="#2a375c" />
      {/* arms */}
      <g style={celebrating ? arm(26, 124, 122, 150, 0.4) : wave(26, 124, 1, 11, 1.2)}>
        <rect x="19" y="120" width="14" height="40" rx="7" fill="#3c4f7c" />
        <circle cx="26" cy="162" r="7.5" fill={skin} />
      </g>
      <g style={celebrating ? arm(104, 124, -122, -150, 0.4, 0.1) : arm(104, 124, -7, -2, 4)}>
        <rect x="97" y="120" width="14" height="40" rx="7" fill="#3c4f7c" />
        <circle cx="104" cy="162" r="7.5" fill={skin} />
      </g>
      {/* hoodie */}
      <path d="M16 165 L18 134 C20 114 40 106 65 106 C90 106 110 114 112 134 L114 165Z" fill="#3c4f7c" />
      <path d="M52 106 Q65 122 78 106Z" fill={skin} />
      <path d="M52 106 Q65 122 78 106" stroke="#2a375c" strokeWidth="3" fill="none" />
      <path d="M55 112 L53 134 M75 112 L77 134" stroke="#f6ead6" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 150 L90 150" stroke="#2a375c" strokeWidth="2" opacity=".5" />
      {/* neck + head */}
      <rect x="56" y="82" width="18" height="26" fill={skin} />
      <g style={arm(65, 90, -2.5, 2.5, 4.6, 0.3)}>
        <circle cx="42" cy="56" r="4.5" fill={skin} />
        <circle cx="88" cy="56" r="4.5" fill={skin} />
        <path d="M41 52 C41 34 52 28 65 28 C78 28 89 34 89 52 C89 71 80 84 65 84 C50 84 41 71 41 52Z" fill={skin} />
        {/* messy hair */}
        <path d="M39 54 C35 28 50 15 66 15 C84 15 95 30 91 54 C88 43 82 37 74 35 C68 40 56 39 50 35 C44 39 40 45 39 54Z" fill="#1b1220" />
        <path d="M50 24 L47 12 L60 19Z M64 19 L67 7 L76 19Z M77 23 L90 14 L88 29Z M42 34 L36 26 L48 28Z" fill="#1b1220" />
        {/* paper party hat */}
        <g transform="rotate(-12 66 22)">
          <path d="M52 24 L66 -14 L80 24Z" fill="#b3202f" />
          <path d="M58 12 L74 14 M55 20 L77 22" stroke="#e2b659" strokeWidth="3" />
          <circle cx="66" cy="-14" r="4" fill="#e2b659" />
        </g>
        {/* face */}
        <g style={blink(4.6, 1.6)}>
          <g style={look(2)}>
            <circle cx="56" cy="58" r="3.6" fill="#241418" />
            <circle cx="76" cy="58" r="3.6" fill="#241418" />
            <circle cx="57.2" cy="56.6" r="1.2" fill="#fff" />
            <circle cx="77.2" cy="56.6" r="1.2" fill="#fff" />
          </g>
        </g>
        <path d="M50 50 L61 52 M81 50 L71 52" stroke="#1b1220" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="62" cy="66" r="1.1" fill="#a8704c" />
        <circle cx="72" cy="66" r="1.1" fill="#a8704c" />
        {[52, 56, 60, 74, 78, 82].map((x, i) => (
          <circle key={i} cx={x} cy={74 + (i % 3) * 2.2} r=".8" fill="#2a1a14" opacity=".45" />
        ))}
        {celebrating ? (
          <>
            <path d="M54 70 Q66 88 78 70Z" fill="#7a1f2c" />
            <path d="M56 70 L76 70 L75 73 L57 73Z" fill="#fff" />
          </>
        ) : (
          <path d="M55 72 Q66 82 77 72" stroke="#7a1f2c" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        )}
      </g>
    </svg>
  )
}

/** A small blue turtle with a brown shell and a squad's worth of energy. (An original character in the spirit of the one she loves.) */
export function Turtle({ celebrating, shades, className, style }: P & { shades?: boolean }) {
  const blue = '#72c6dd'
  return (
    <svg viewBox="0 -8 130 158" className={className} style={style} aria-hidden>
      {/* tail */}
      <g style={{ transformOrigin: '96px 116px', animation: 'tailWag 1.1s ease-in-out infinite' }}>
        <path d="M92 118 C112 120 124 102 112 90 C108 100 102 104 92 106Z" fill={blue} />
      </g>
      {/* shell */}
      <ellipse cx="65" cy="98" rx="35" ry="37" fill="#a96b2f" />
      <path d="M40 90 Q65 80 90 90 M44 112 Q65 122 86 112" stroke="#7d4a1d" strokeWidth="2" fill="none" />
      {/* legs */}
      <ellipse cx="46" cy="136" rx="13" ry="9" fill={blue} />
      <ellipse cx="84" cy="136" rx="13" ry="9" fill={blue} />
      {[38, 46, 54, 76, 84, 92].map((x) => (
        <circle key={x} cx={x} cy="143" r="2.2" fill="#f6e7a3" />
      ))}
      {/* body + belly */}
      <ellipse cx="65" cy="100" rx="26" ry="31" fill={blue} />
      <ellipse cx="65" cy="106" rx="18" ry="22" fill="#f6e7a3" />
      <path d="M50 100 H80 M49 110 H81 M52 120 H78" stroke="#dcc97b" strokeWidth="1.6" />
      {/* arms */}
      <g style={celebrating ? arm(42, 90, 120, 160, 0.3) : arm(42, 90, 20, 50, 1.2)}>
        <rect x="35" y="88" width="11" height="26" rx="5.5" fill={blue} />
        <circle cx="40.5" cy="115" r="6" fill={blue} />
      </g>
      <g style={celebrating ? arm(88, 90, -120, -160, 0.3, 0.1) : arm(88, 90, -20, -50, 1.2, 0.35)}>
        <rect x="84" y="88" width="11" height="26" rx="5.5" fill={blue} />
        <circle cx="89.5" cy="115" r="6" fill={blue} />
      </g>
      {/* head */}
      <circle cx="65" cy="52" r="29" fill={blue} />
      <g style={blink(4.4, 0.5)}>
        <g style={look(2.4)}>
          <ellipse cx="52" cy="52" rx="7" ry="9" fill="#2a1a2c" />
          <ellipse cx="78" cy="52" rx="7" ry="9" fill="#2a1a2c" />
          <circle cx="54" cy="48.5" r="2.6" fill="#fff" />
          <circle cx="80" cy="48.5" r="2.6" fill="#fff" />
        </g>
      </g>
      {shades && (
        <g>
          <rect x="41" y="43" width="22" height="16" rx="5" fill="#120a14" />
          <rect x="67" y="43" width="22" height="16" rx="5" fill="#120a14" />
          <path d="M63 50 H67" stroke="#120a14" strokeWidth="3" />
          <path d="M44 46 l8 0 M70 46 l8 0" stroke="#fff" strokeOpacity=".4" strokeWidth="1.5" />
        </g>
      )}
      <circle cx="42" cy="66" r="5" fill="#ff9fb4" opacity=".6" />
      <circle cx="88" cy="66" r="5" fill="#ff9fb4" opacity=".6" />
      {celebrating ? <path d="M52 68 Q65 86 78 68Z" fill="#7a1f2c" /> : <path d="M54 68 Q65 78 76 68" stroke="#2a1a2c" strokeWidth="2.4" strokeLinecap="round" fill="none" />}
      {/* party hat */}
      <g transform="rotate(10 70 26)">
        <path d="M58 28 L70 -4 L84 28Z" fill="#f4b6c8" />
        <path d="M63 14 L79 16" stroke="#fff" strokeWidth="3" opacity=".7" />
        <circle cx="70" cy="-4" r="3.6" fill="#e2b659" />
      </g>
    </svg>
  )
}

/** The wall-crawling guest. Drawn upright; the scene hangs him upside-down from the string lights. */
export function Hero({ celebrating, className, style }: P) {
  const red = '#c4202f'
  const blue = '#2b4ba8'
  return (
    <svg viewBox="0 -8 110 180" className={className} style={style} aria-hidden>
      {/* legs + boots */}
      <path d="M38 110 L52 110 L50 158 L36 158Z" fill={blue} />
      <path d="M58 110 L72 110 L74 158 L60 158Z" fill={blue} />
      <path d="M33 156 L51 156 L52 170 L30 170Z M59 156 L77 156 L80 170 L58 170Z" fill={red} />
      {/* arms */}
      <g style={celebrating ? arm(30, 76, 130, 158, 0.4) : arm(30, 76, 6, 14, 2.6)}>
        <rect x="23" y="72" width="11" height="40" rx="5.5" fill={red} />
        <path d="M23 100 H34" stroke="#7d1020" strokeWidth="1.4" />
        <circle cx="28.5" cy="114" r="6.5" fill={red} />
      </g>
      <g style={celebrating ? arm(80, 76, -130, -158, 0.4, 0.1) : wave(80, 76, -1, 9, 0.5)}>
        <rect x="76" y="72" width="11" height="40" rx="5.5" fill={red} />
        <path d="M76 100 H87" stroke="#7d1020" strokeWidth="1.4" />
        <circle cx="81.5" cy="114" r="6.5" fill={red} />
      </g>
      {/* torso */}
      <path d="M28 72 L82 72 L74 114 L36 114Z" fill={red} />
      <path d="M28 72 L40 72 L42 114 L36 114Z M82 72 L70 72 L68 114 L74 114Z" fill={blue} />
      <path d="M55 72 V114 M42 82 Q55 92 68 82 M44 96 Q55 104 66 96" stroke="#7d1020" strokeWidth="1.3" fill="none" />
      <rect x="36" y="108" width="38" height="8" rx="2" fill={blue} />
      {/* head */}
      <circle cx="55" cy="44" r="25" fill={red} />
      <path d="M55 20 V68 M30 44 H80 M37 28 L73 60 M73 28 L37 60" stroke="#7d1020" strokeWidth="1.1" opacity=".75" />
      <circle cx="55" cy="44" r="10" fill="none" stroke="#7d1020" strokeWidth="1.1" opacity=".7" />
      <circle cx="55" cy="44" r="18" fill="none" stroke="#7d1020" strokeWidth="1.1" opacity=".6" />
      <g style={blink(6, 2)}>
        <path d="M35 40 Q46 32 53 46 Q45 52 36 46Z" fill="#fff" stroke="#120a14" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M75 40 Q64 32 57 46 Q65 52 74 46Z" fill="#fff" stroke="#120a14" strokeWidth="2.4" strokeLinejoin="round" />
      </g>
      {/* tiny party hat on the mask */}
      <g transform="rotate(-8 55 20)">
        <path d="M44 22 L55 -2 L66 22Z" fill="#e2b659" />
        <path d="M49 12 L62 12" stroke="#b3202f" strokeWidth="3" />
        <circle cx="55" cy="-2" r="3.4" fill="#f4b6c8" />
      </g>
    </svg>
  )
}
