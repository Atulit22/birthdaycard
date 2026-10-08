import { AnimatePresence, motion } from 'motion/react'
import { Cat } from '../Cat/Cat'
import { useWorld } from '../../state/DiscoveryContext'

/** The companion that lives at the bottom edge of the screen and pops up to comment on things. */
export function CatWhisper() {
  const { whisper, entered } = useWorld()
  if (!entered) return null
  return (
    <div className="pointer-events-none fixed bottom-0 left-2 z-[70] flex items-end gap-1 sm:left-5" aria-live="polite">
      <AnimatePresence>
        {whisper && (
          <motion.div
            key="cat"
            initial={{ y: 80 }}
            animate={{ y: 6 }}
            exit={{ y: 90 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative h-[58px] w-[72px] overflow-hidden"
          >
            <Cat pose="peek" size={72} mood="happy" look={false} autoYawn={false} className="absolute left-0 top-0" />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {whisper && (
          <motion.div
            key={whisper.key}
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24, delay: 0.12 }}
            className="relative mb-5 max-w-[min(17rem,62vw)] rounded-2xl rounded-bl-sm bg-cream px-3.5 py-2 font-hand text-[1.3rem] leading-[1.1] text-ink shadow-xl"
          >
            {whisper.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
