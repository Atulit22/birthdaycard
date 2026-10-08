const BODY = '#17101c'
const RIM = '#4a3456'

/** Side-view cat. Legs move only while `walking` is true. */
export function CatWalk({ walking, size = 110, flip = false }: { walking: boolean; size?: number; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 150 90"
      width={size}
      height={(size * 90) / 150}
      aria-hidden
      style={{
        display: 'block',
        overflow: 'visible',
        transform: flip ? 'scaleX(-1)' : undefined,
        ['--walk' as string]: walking ? 'running' : 'paused',
      }}
    >
      <ellipse cx="72" cy="86" rx="48" ry="4" fill="#000" opacity=".25" />
      <g className="cat-tail" style={{ animationDuration: walking ? '1.2s' : '3s' }}>
        <path d="M34 42 C 8 40, 6 14, 22 8" stroke={BODY} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      <g style={{ animation: walking ? 'bobwalk .35s ease-in-out infinite' : undefined }}>
        <rect className="leg b" x="38" y="52" width="9" height="30" rx="4.5" fill={BODY} stroke={RIM} strokeWidth="1" />
        <rect className="leg" x="52" y="52" width="9" height="30" rx="4.5" fill={BODY} stroke={RIM} strokeWidth="1" />
        <ellipse cx="72" cy="46" rx="42" ry="19" fill={BODY} stroke={RIM} strokeWidth="1.4" />
        <rect className="leg" x="86" y="52" width="9" height="30" rx="4.5" fill={BODY} stroke={RIM} strokeWidth="1" />
        <rect className="leg b" x="98" y="52" width="9" height="30" rx="4.5" fill={BODY} stroke={RIM} strokeWidth="1" />
        <path d="M104 22 L106 4 L118 14 Z" fill={BODY} stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M130 22 L130 4 L118 14 Z" fill={BODY} stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
        <ellipse cx="119" cy="29" rx="19" ry="16" fill={BODY} stroke={RIM} strokeWidth="1.4" />
        <ellipse cx="127" cy="26" rx="3.4" ry="4.6" fill="#e6c84f" />
        <ellipse cx="128" cy="26" rx="1.3" ry="3.6" fill="#09050b" />
        <path d="M135 33 h5 l-2.5 3 Z" fill="#e58fa8" />
      </g>
    </svg>
  )
}
