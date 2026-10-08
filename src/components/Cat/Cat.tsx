import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { lastPointerAt, onPointer } from '../../hooks/useCursor'

export type CatPose = 'sit' | 'peek' | 'sleep'
export type CatMood = 'calm' | 'annoyed' | 'happy'

interface Props {
  pose?: CatPose
  size?: number // rendered width in px
  mood?: CatMood
  shades?: boolean
  hat?: boolean
  yawn?: boolean // force a yawn
  autoYawn?: boolean
  look?: boolean // eyes follow the cursor
  blinkDelay?: number
  className?: string
  style?: CSSProperties
  label?: string
}

const BODY = '#17101c'
const RIM = '#4a3456'
const GOLD = '#e6c84f'

/** The companion. Pure SVG: blinks, yawns, breathes, wags, and looks at your cursor. */
export function Cat({
  pose = 'sit',
  size = 140,
  mood = 'calm',
  shades = false,
  hat = false,
  yawn = false,
  autoYawn = true,
  look = true,
  blinkDelay = 0,
  className,
  style,
  label = 'a black cat',
}: Props) {
  const headRef = useRef<SVGGElement>(null)
  const pupilL = useRef<SVGGElement>(null)
  const pupilR = useRef<SVGGElement>(null)
  const [autoY, setAutoY] = useState(false)

  const aim = (x: number, y: number, tilt = 0) => {
    const t = `translate(${x}px, ${y}px)`
    if (pupilL.current) pupilL.current.style.transform = t
    if (pupilR.current) pupilR.current.style.transform = t
    if (headRef.current) headRef.current.style.transform = `rotate(${tilt}deg)`
  }

  useEffect(() => {
    if (!look || pose === 'sleep') return
    const off = onPointer((px, py) => {
      const el = headRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = px - (r.left + r.width / 2)
      const dy = py - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(d, 320) / 320
      aim((dx / d) * 5.5 * k, (dy / d) * 4 * k, Math.max(-5, Math.min(5, dx / 140)))
    })
    // when nobody is moving a mouse (phones!) the cat glances around on its own
    const idle = window.setInterval(() => {
      if (Date.now() - lastPointerAt() > 3500) {
        aim((Math.random() - 0.5) * 9, (Math.random() - 0.4) * 5, (Math.random() - 0.5) * 6)
      }
    }, 2800)
    return () => {
      off()
      window.clearInterval(idle)
    }
  }, [look, pose])

  useEffect(() => {
    if (!autoYawn || pose !== 'sit') return
    let t: number
    const loop = () => {
      t = window.setTimeout(() => {
        setAutoY(true)
        window.setTimeout(() => setAutoY(false), 2000)
        loop()
      }, 14000 + Math.random() * 14000)
    }
    loop()
    return () => window.clearTimeout(t)
  }, [autoYawn, pose])

  const yawning = yawn || autoY
  const happy = mood === 'happy'
  const annoyed = mood === 'annoyed'
  const closed = yawning || happy

  if (pose === 'sleep') return <SleepingCat size={size} className={className} style={style} label={label} />

  const vb = pose === 'peek' ? '0 -30 200 142' : '0 -30 200 255'
  const h = pose === 'peek' ? (size * 142) / 200 : (size * 255) / 200

  const eye = (cx: number, side: 1 | -1) => {
    const cy = 82
    if (closed) {
      return (
        <path
          d={`M${cx - 11} ${cy + 4} Q${cx} ${cy - 10} ${cx + 11} ${cy + 4}`}
          stroke={GOLD}
          strokeWidth="3.6"
          fill="none"
          strokeLinecap="round"
        />
      )
    }
    return (
      <g className="cat-eye" style={{ animationDelay: `${blinkDelay}s` }}>
        <ellipse cx={cx} cy={cy} rx="12.5" ry="13.5" fill={GOLD} />
        <g ref={side === 1 ? pupilL : pupilR} style={{ transition: 'transform .09s linear' }}>
          <ellipse cx={cx} cy={cy} rx="4.6" ry="10.5" fill="#09050b" />
          <circle cx={cx - 3.5} cy={cy - 5} r="2.6" fill="#fff" opacity=".9" />
        </g>
        {annoyed && (
          <polygon
            fill={BODY}
            points={
              side === 1
                ? `${cx - 14},${cy - 15} ${cx + 14},${cy - 15} ${cx + 14},${cy + 2} ${cx - 14},${cy - 8}`
                : `${cx - 14},${cy - 15} ${cx + 14},${cy - 15} ${cx + 14},${cy - 8} ${cx - 14},${cy + 2}`
            }
          />
        )}
      </g>
    )
  }

  return (
    <svg
      viewBox={vb}
      width={size}
      height={h}
      role="img"
      aria-label={label}
      className={className}
      style={{ overflow: 'visible', display: 'block', ...style }}
    >
      {pose === 'sit' && (
        <>
          <g className="cat-tail">
            <path d="M140 212 C 192 214, 198 158, 170 138" stroke={BODY} strokeWidth="15" fill="none" strokeLinecap="round" />
          </g>
          <g className="cat-breathe">
            <path d="M58 222 C 40 172, 62 126, 100 126 C 138 126, 160 172, 142 222 Z" fill={BODY} stroke={RIM} strokeWidth="1.6" />
            <path d="M82 222 C 80 190, 86 160, 100 150 C 114 160, 120 190, 118 222" fill="#1f1526" opacity=".8" />
            <ellipse cx="78" cy="220" rx="17" ry="9" fill={BODY} stroke={RIM} strokeWidth="1.4" />
            <ellipse cx="122" cy="220" rx="17" ry="9" fill={BODY} stroke={RIM} strokeWidth="1.4" />
          </g>
        </>
      )}
      {pose === 'peek' && (
        <>
          <ellipse cx="68" cy="108" rx="19" ry="9" fill={BODY} stroke={RIM} strokeWidth="1.4" />
          <ellipse cx="132" cy="108" rx="19" ry="9" fill={BODY} stroke={RIM} strokeWidth="1.4" />
        </>
      )}

      <g ref={headRef} style={{ transformBox: 'fill-box', transformOrigin: '50% 90%', transition: 'transform .15s' }}>
        <path d="M54 68 L58 18 L96 46 Z" fill={BODY} stroke={RIM} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M146 68 L142 18 L104 46 Z" fill={BODY} stroke={RIM} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M63 56 L65 32 L84 46 Z" fill="#c98aa6" />
        <path d="M137 56 L135 32 L116 46 Z" fill="#c98aa6" />
        <ellipse cx="100" cy="86" rx="53" ry="43" fill={BODY} stroke={RIM} strokeWidth="1.6" />

        {eye(78, 1)}
        {eye(122, -1)}

        <path d="M94 98 h12 l-6 7 Z" fill="#e58fa8" />
        {yawning ? (
          <>
            <ellipse cx="100" cy="116" rx="10" ry="12" fill="#3a1226" />
            <ellipse cx="100" cy="122" rx="6" ry="4" fill="#d6708e" />
          </>
        ) : happy ? (
          <path d="M86 106 Q100 124 114 106 Z" fill="#3a1226" stroke="#a77fb0" strokeWidth="1.5" strokeLinejoin="round" />
        ) : annoyed ? (
          <path d="M90 112 q10 -4 20 0" stroke="#a77fb0" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M100 105 q-5 8 -11 3 M100 105 q5 8 11 3" stroke="#a77fb0" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        )}

        <g stroke="#d8cce0" strokeWidth="1.3" opacity=".55" strokeLinecap="round">
          <path d="M58 98 L22 90 M58 104 L20 105 M60 110 L26 120" />
          <path d="M142 98 L178 90 M142 104 L180 105 M140 110 L174 120" />
        </g>

        {shades && (
          <g>
            <rect x="57" y="69" width="40" height="25" rx="9" fill="#06030a" stroke={GOLD} strokeWidth="1.8" />
            <rect x="103" y="69" width="40" height="25" rx="9" fill="#06030a" stroke={GOLD} strokeWidth="1.8" />
            <path d="M97 76 Q100 73 103 76" stroke={GOLD} strokeWidth="2" fill="none" />
            <path d="M64 74 l12 0 -8 14 -6 0z" fill="#fff" opacity=".22" />
            <path d="M110 74 l12 0 -8 14 -6 0z" fill="#fff" opacity=".22" />
          </g>
        )}

        {hat && (
          <g transform="rotate(-12 100 40)">
            <path d="M74 38 L100 -16 L126 38 Z" fill="#b3202f" stroke="#e2b659" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M82 22 L118 22 M78 31 L122 31" stroke="#e2b659" strokeWidth="3" />
            <circle cx="100" cy="-18" r="7" fill="#f4b6c8" />
          </g>
        )}
      </g>
    </svg>
  )
}

function SleepingCat({ size, className, style, label }: { size: number; className?: string; style?: CSSProperties; label: string }) {
  return (
    <svg
      viewBox="0 -20 240 150"
      width={size}
      height={(size * 150) / 240}
      role="img"
      aria-label={label + ' (sleeping)'}
      className={className}
      style={{ overflow: 'visible', display: 'block', ...style }}
    >
      <g className="cat-breathe">
        <ellipse cx="124" cy="96" rx="92" ry="33" fill={BODY} stroke={RIM} strokeWidth="1.6" />
        <path d="M205 100 C 238 104, 236 130, 160 128" stroke={BODY} strokeWidth="14" fill="none" strokeLinecap="round" />
      </g>
      <g>
        <path d="M38 62 L40 30 L62 48 Z" fill={BODY} stroke={RIM} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M94 62 L92 30 L70 48 Z" fill={BODY} stroke={RIM} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M44 56 L45 40 L56 49 Z" fill="#c98aa6" />
        <path d="M88 56 L87 40 L76 49 Z" fill="#c98aa6" />
        <ellipse cx="66" cy="84" rx="38" ry="32" fill={BODY} stroke={RIM} strokeWidth="1.5" />
        <path d="M45 82 q8 8 16 0 M71 82 q8 8 16 0" stroke={GOLD} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M60 94 h12 l-6 6 Z" fill="#e58fa8" />
        <ellipse cx="46" cy="116" rx="18" ry="8" fill={BODY} stroke={RIM} strokeWidth="1.3" />
        <ellipse cx="88" cy="116" rx="18" ry="8" fill={BODY} stroke={RIM} strokeWidth="1.3" />
      </g>
      <g fill="#f6ead6" fontFamily="Caveat, cursive" fontWeight="700">
        <text className="zzz" x="104" y="34" fontSize="22">z</text>
        <text className="zzz" x="118" y="20" fontSize="28" style={{ animationDelay: '1s' }}>Z</text>
        <text className="zzz" x="136" y="4" fontSize="34" style={{ animationDelay: '2s' }}>Z</text>
      </g>
    </svg>
  )
}
