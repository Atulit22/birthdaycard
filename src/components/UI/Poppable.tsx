import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** What it says on each click (cycles). Can be empty if you handle text yourself. */
  lines?: string[]
  /** Called with the click count (1-based). */
  onPop?: (n: number) => void
  label: string
  className?: string
  style?: CSSProperties
  bubbleClass?: string
  /** Show bubble below instead of above */
  below?: boolean
  /** extra text controlled from outside (overrides lines) */
  text?: string | null
  ms?: number
  disabled?: boolean
  /** render in normal flow (relative) instead of absolutely positioned */
  inline?: boolean
}

/** A clickable object that answers with a little speech bubble. */
export function Poppable({
  children,
  lines = [],
  onPop,
  label,
  className = '',
  style,
  bubbleClass = '',
  below,
  text,
  ms = 2400,
  disabled,
  inline,
}: Props) {
  const [shown, setShown] = useState<{ t: string; k: number } | null>(null)
  const count = useRef(0)
  const timer = useRef(0)

  const show = useCallback(
    (t: string) => {
      window.clearTimeout(timer.current)
      setShown({ t, k: Math.random() })
      timer.current = window.setTimeout(() => setShown(null), ms)
    },
    [ms],
  )

  useEffect(() => {
    if (text) show(text)
    return () => window.clearTimeout(timer.current)
  }, [text, show])

  const click = () => {
    count.current += 1
    if (lines.length) show(lines[Math.min(count.current - 1, lines.length - 1)] ?? lines[(count.current - 1) % lines.length])
    onPop?.(count.current)
  }

  return (
    <div className={`${inline ? 'relative' : 'absolute'} ${className}`} style={style}>
      <button
        type="button"
        aria-label={label}
        onClick={click}
        disabled={disabled}
        className="relative block touch-manipulation rounded-xl outline-offset-4 transition-transform duration-200 hover:scale-[1.06] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        {children}
      </button>
      <AnimatePresence>
        {shown && (
          <motion.div
            key={shown.k}
            initial={{ opacity: 0, y: below ? -6 : 6, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className={`pointer-events-none absolute left-1/2 z-30 w-max max-w-[min(15rem,70vw)] -translate-x-1/2 ${
              below ? 'top-full mt-2' : 'bottom-full mb-2'
            }`}
          >
            <div className={`rounded-2xl bg-cream px-3 py-1.5 text-center font-hand text-xl leading-tight text-ink shadow-lg ${bubbleClass}`}>
              {shown.t}
            </div>
            <div
              className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-cream ${below ? '-top-1.5' : '-bottom-1.5'}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
