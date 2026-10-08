import type { CSSProperties } from 'react'

/** Where something stands on an island: [x%, lift in px above the grass]. */
export interface Pos {
  m: [number, number] // phones
  d: [number, number] // md and up
  hm?: boolean // hide on phones to avoid clutter
}

export function pos(p: Pos): { className: string; style: CSSProperties } {
  return {
    className: `spot ${p.hm ? 'hidden md:block' : ''}`,
    style: {
      ['--mx' as string]: `${p.m[0]}%`,
      ['--mb' as string]: `${p.m[1]}px`,
      ['--dx' as string]: `${p.d[0]}%`,
      ['--db' as string]: `${p.d[1]}px`,
    },
  }
}
