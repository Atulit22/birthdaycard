import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { EGGS } from '../../data/easterEggs'
import { useWorld } from '../../state/DiscoveryContext'

/** "Birthday discoveries: ✦✦✦ ?" — never says how many there are. */
export function DiscoveryHUD() {
  const { found, lastFound, entered } = useWorld()
  const [open, setOpen] = useState(false)
  if (!entered) return null
  const shown = Math.min(found.length, 7)
  const extra = found.length - shown

  return (
    <div className="fixed right-3 top-3 z-[75] flex flex-col items-end gap-2 sm:right-5 sm:top-5">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Birthday discoveries"
        className="flex items-center gap-2 rounded-full border border-gold/40 bg-ink/70 px-3 py-1.5 text-sm shadow-lg backdrop-blur-md transition hover:border-gold"
      >
        <span className="hidden font-hand text-lg leading-none text-cream/80 sm:inline">discoveries</span>
        <span className="flex items-center text-gold" aria-hidden>
          {found.length === 0 && <span className="opacity-40">✧</span>}
          {Array.from({ length: shown }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14 }}
              className="drop-shadow-[0_0_6px_rgba(226,182,89,.9)]"
            >
              ✦
            </motion.span>
          ))}
          {extra > 0 && <span className="ml-1 text-xs">+{extra}</span>}
          <span className="ml-1 text-cream/50">?</span>
        </span>
      </button>

      <AnimatePresence>
        {lastFound && !open && (
          <motion.div
            key={lastFound + found.length}
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: [0, 1, 1, 0], y: [-8, 0, 0, -4], scale: 1 }}
            transition={{ duration: 3.4, times: [0, 0.1, 0.85, 1] }}
            className="pointer-events-none rounded-full bg-gold px-3 py-1 font-hand text-lg leading-none text-ink shadow-lg"
          >
            ✦ new discovery
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-[min(18rem,86vw)] rounded-2xl border border-gold/30 bg-ink/90 p-4 shadow-2xl backdrop-blur-md"
          >
            <p className="font-hand text-xl text-gold">things you've found</p>
            <ul className="mt-2 space-y-1 text-sm text-cream/90">
              {found.length === 0 && <li className="text-cream/50">nothing yet. keep looking.</li>}
              {found.map((id) => (
                <li key={id} className="flex gap-2">
                  <span className="text-gold">✦</span>
                  {EGGS[id].title}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-hand text-lg text-cream/60">there's more. probably.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
