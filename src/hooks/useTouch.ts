import { useEffect, useState } from 'react'

/** true on phones/tablets (no hover) — so hints can say "tap" instead of "click" */
export function useIsTouch() {
  const [touch, setTouch] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches)
  useEffect(() => {
    const m = window.matchMedia('(hover: none)')
    const h = () => setTouch(m.matches)
    m.addEventListener('change', h)
    return () => m.removeEventListener('change', h)
  }, [])
  return touch
}

/** a very small buzz where the browser allows it (never relied on) */
export function haptic(ms = 8) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* not supported */
  }
}
