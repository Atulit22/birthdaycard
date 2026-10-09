import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { playSound } from '../../audio/useSound'

/** Tap to flip. Both faces share one grid cell so the card is as tall as its tallest face. */
export function FlipCard({
  front,
  back,
  label,
  tilt = 0,
  onFlip,
  className = '',
}: {
  front: ReactNode
  back: ReactNode
  label: string
  tilt?: number
  onFlip?: (open: boolean) => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`[perspective:1100px] ${className}`} style={{ rotate: `${tilt}deg` }}>
      <motion.button
        type="button"
        aria-label={label}
        aria-pressed={open}
        onClick={() => {
          setOpen((o) => !o)
          playSound('paperFlip')
          onFlip?.(!open)
        }}
        whileHover={{ y: -6, rotate: open ? 0 : tilt > 0 ? -1.5 : 1.5 }}
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 18 }}
        className="grid h-full w-full text-left outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold [transform-style:preserve-3d]"
      >
        <div className="[backface-visibility:hidden]" style={{ gridArea: '1 / 1' }}>
          {front}
        </div>
        <div className="[backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ gridArea: '1 / 1' }}>
          {back}
        </div>
      </motion.button>
    </div>
  )
}
