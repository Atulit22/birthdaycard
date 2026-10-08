import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

/** Fades/slides in once when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  style,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  style?: CSSProperties
  as?: 'div' | 'h2' | 'p' | 'span'
}) {
  const M = motion[as]
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </M>
  )
}
