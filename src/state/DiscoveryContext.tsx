import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { playSound } from '../audio/useSound'
import { EGGS, type EggId } from '../data/easterEggs'

interface Whisper {
  text: string
  key: number
}

interface World {
  entered: boolean
  enter: () => void
  found: EggId[]
  lastFound: EggId | null
  discover: (id: EggId) => void
  say: (text: string, ms?: number) => void
  whisper: Whisper | null
  videoDone: boolean
  markVideoDone: () => void
  finalUnlocked: boolean
  unlockFinal: () => void
}

const KEY = 'ishita-world-v1'
const Ctx = createContext<World | null>(null)

function load(): { found: EggId[]; videoDone: boolean } {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw)
      return {
        found: (p.found ?? []).filter((id: string) => id in EGGS),
        videoDone: !!p.videoDone,
      }
    }
  } catch {
    /* storage can be blocked — the world still works without it */
  }
  return { found: [], videoDone: false }
}

export function WorldProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(load, [])
  const [entered, setEntered] = useState(false)
  const [found, setFound] = useState<EggId[]>(initial.found)
  const [lastFound, setLastFound] = useState<EggId | null>(null)
  const [videoDone, setVideoDone] = useState(initial.videoDone)
  const [finalUnlocked, setFinalUnlocked] = useState(initial.videoDone)
  const [whisper, setWhisper] = useState<Whisper | null>(null)
  const timer = useRef<number>(0)
  const keyRef = useRef(0)
  const foundRef = useRef(found)
  foundRef.current = found

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ found, videoDone }))
    } catch {
      /* ignore */
    }
  }, [found, videoDone])

  const say = useCallback((text: string, ms = 3600) => {
    window.clearTimeout(timer.current)
    setWhisper({ text, key: ++keyRef.current })
    timer.current = window.setTimeout(() => setWhisper(null), ms)
  }, [])

  const discover = useCallback(
    (id: EggId) => {
      if (foundRef.current.includes(id)) return
      foundRef.current = [...foundRef.current, id]
      playSound('discover', { variant: Object.keys(EGGS).indexOf(id) })
      setFound(foundRef.current)
      setLastFound(id)
      window.setTimeout(() => say(EGGS[id].reaction, 4200), 700)
    },
    [say],
  )

  const value = useMemo<World>(
    () => ({
      entered,
      enter: () => setEntered(true),
      found,
      lastFound,
      discover,
      say,
      whisper,
      videoDone,
      markVideoDone: () => setVideoDone(true),
      finalUnlocked,
      unlockFinal: () => setFinalUnlocked(true),
    }),
    [entered, found, lastFound, discover, say, whisper, videoDone, finalUnlocked],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWorld() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useWorld outside WorldProvider')
  return c
}
