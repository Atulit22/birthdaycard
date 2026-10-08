import { useEffect, type RefObject } from 'react'
import { useWorld } from '../state/DiscoveryContext'

/** The first time an element scrolls into view, the cat says something about it. */
export function useWhisperOnView(ref: RefObject<Element | null>, text: string) {
  const { say, entered } = useWorld()
  useEffect(() => {
    const el = ref.current
    if (!el || !entered) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          say(text, 4200)
          io.disconnect()
        }
      },
      { threshold: 0.45 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, text, say, entered])
}
