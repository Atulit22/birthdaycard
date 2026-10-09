import { useEffect } from 'react'
import { useWorld } from '../state/DiscoveryContext'
import { audio, playSound } from './useSound'
import type { Section } from './AudioManager'

const IDS: Section[] = ['welcome', 'town', 'corner', 'scrapbook', 'party', 'cinema', 'final']

/** Tells the audio system which part of the world she is standing in, so the ambience can follow her. */
export function SoundScape() {
  const { entered } = useWorld()

  useEffect(() => {
    if (!entered) return
    let raf = 0
    let seenScrapbook = false
    const update = () => {
      raf = 0
      const mid = window.innerHeight * 0.5
      let now: Section = 'none'
      for (const id of IDS) {
        const r = document.getElementById(id)?.getBoundingClientRect()
        if (r && r.top <= mid && r.bottom > mid) now = id
      }
      audio.setSection(now)
      audio.setParty(now === 'party')
      if (now === 'scrapbook' && !seenScrapbook) {
        seenScrapbook = true
        playSound('paperRustle')
      }
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    // a tiny sparkle as the world fades in behind the gate
    const t = window.setTimeout(() => playSound('sparkle'), 1500)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      window.clearTimeout(t)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [entered])

  return null
}
