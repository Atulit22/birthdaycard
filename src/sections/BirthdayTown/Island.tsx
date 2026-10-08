import type { ReactNode } from 'react'

/** A floating island: grass top, soil + rock underneath. Items stand on the `--g` line. */
export function Island({
  children,
  tone = 'dusk',
  align = 'center',
  id,
}: {
  children: ReactNode
  tone?: 'dusk' | 'night'
  align?: 'left' | 'center' | 'right'
  id?: string
}) {
  const grass = tone === 'dusk' ? ['#6f9a6a', '#5a8559', '#4a7050'] : ['#3f6650', '#345a47', '#2b4a3c']
  const rock = tone === 'dusk' ? '#5b3a45' : '#3a2845'
  const rock2 = tone === 'dusk' ? '#46303c' : '#2a1d36'
  return (
    <div
      id={id}
      className={`relative w-full max-w-[1000px] [--g:176px] md:[--g:222px] ${
        align === 'left' ? 'mx-auto md:-translate-x-[12%]' : align === 'right' ? 'mx-auto md:translate-x-[12%]' : 'mx-auto'
      }`}
      style={{ height: 'calc(var(--g) + 340px)' }}
    >
      <div className="absolute bottom-0 left-0 w-full" style={{ height: 'calc(var(--g) + 76px)' }}>
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.45)]" aria-hidden>
          {/* underside */}
          <path d="M6 82 C 20 150, 150 170, 270 200 C 360 224, 430 262, 500 296 C 570 262, 640 224, 730 200 C 850 170, 980 150, 994 82 Z" fill={rock} />
          <path d="M120 150 C 220 180, 300 200, 340 236 C 400 250, 440 270, 500 296 C 460 240, 380 200, 300 160Z" fill={rock2} opacity=".55" />
          <path d="M610 190 C 660 222, 690 236, 720 262 C 760 230, 800 200, 840 176Z" fill={rock2} opacity=".5" />
          {/* roots / hanging bits */}
          <path d="M300 190 q-8 26 -2 44 M640 200 q10 24 4 42 M420 250 q-4 18 0 30" stroke={rock2} strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* grass lip + top */}
          <path d="M0 76 C 0 110 40 126 120 136 C 300 156 700 156 880 136 C 960 126 1000 110 1000 76 Z" fill={grass[2]} />
          <ellipse cx="500" cy="76" rx="500" ry="42" fill={grass[0]} />
          <ellipse cx="500" cy="70" rx="470" ry="30" fill={grass[1]} opacity=".7" />
        </svg>
      </div>
      {children}
    </div>
  )
}
