import { useEffect, useState } from 'react'

// One shared pointer listener for every cat / light effect on the page.
type Sub = (x: number, y: number) => void
const subs = new Set<Sub>()
let started = false
let raf = 0
let px = 0
let py = 0
let last = 0

function start() {
  if (started) return
  started = true
  const move = (e: PointerEvent) => {
    px = e.clientX
    py = e.clientY
    last = Date.now()
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      subs.forEach((s) => s(px, py))
    })
  }
  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointerdown', move, { passive: true })
}

export function onPointer(s: Sub) {
  start()
  subs.add(s)
  return () => void subs.delete(s)
}

export const lastPointerAt = () => last

export function usePrefersReducedMotion() {
  const [r, setR] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const h = () => setR(m.matches)
    m.addEventListener('change', h)
    return () => m.removeEventListener('change', h)
  }, [])
  return r
}
