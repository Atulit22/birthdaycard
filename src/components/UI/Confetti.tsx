import { useEffect, useRef, useState } from 'react'
import { fx, type ConfettiOpts } from '../../fx'
import { usePrefersReducedMotion } from '../../hooks/useCursor'

interface P {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  vr: number
  size: number
  color: string
  shape: 'rect' | 'heart' | 'star' | 'dot'
  life: number
}

const COLORS = ['#f4b6c8', '#e2b659', '#b3202f', '#f6ead6', '#8a6aa8', '#ff8fa8']

function heart(c: CanvasRenderingContext2D, s: number) {
  c.beginPath()
  c.moveTo(0, s * 0.35)
  c.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.35)
  c.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.35)
  c.fill()
}
function star(c: CanvasRenderingContext2D, s: number) {
  c.beginPath()
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rad = i % 2 ? s * 0.45 : s
    c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad)
  }
  c.closePath()
  c.fill()
}

/** Full-screen confetti canvas (hearts + stars too). Only runs a loop while particles exist. */
export function ConfettiLayer() {
  const ref = useRef<HTMLCanvasElement>(null)
  const parts = useRef<P[]>([])
  const raf = useRef(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      cv.width = window.innerWidth * dpr
      cv.height = window.innerHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const ps = parts.current
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.vy += 0.16
        p.vx *= 0.992
        p.x += p.vx
        p.y += p.vy
        p.r += p.vr
        p.life -= 1
        if (p.life <= 0 || p.y > window.innerHeight + 30) {
          ps.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.r)
        ctx.globalAlpha = Math.min(1, p.life / 40)
        ctx.fillStyle = p.color
        if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6)
        else if (p.shape === 'dot') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2.4, 0, 7)
          ctx.fill()
        } else if (p.shape === 'heart') heart(ctx, p.size * 0.7)
        else star(ctx, p.size * 0.7)
        ctx.restore()
      }
      raf.current = ps.length ? requestAnimationFrame(tick) : 0
      if (!ps.length) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }

    const off = fx.onConfetti((o: ConfettiOpts) => {
      const count = Math.round((o.count ?? 90) * (reduced ? 0.25 : 1))
      const ox = (o.x ?? 0.5) * window.innerWidth
      const oy = (o.y ?? 0.55) * window.innerHeight
      const spread = o.spread ?? Math.PI * 1.3
      const power = o.power ?? 13
      const shapes = o.shapes ?? ['rect', 'rect', 'heart', 'star', 'dot']
      for (let i = 0; i < count; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * spread
        const v = power * (0.45 + Math.random() * 0.7)
        parts.current.push({
          x: ox,
          y: oy,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          r: Math.random() * 6,
          vr: (Math.random() - 0.5) * 0.35,
          size: 8 + Math.random() * 9,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          life: 110 + Math.random() * 90,
        })
      }
      if (!raf.current) raf.current = requestAnimationFrame(tick)
    })

    return () => {
      off()
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf.current)
    }
  }, [reduced])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[80] h-full w-full" aria-hidden />
}

/** 🐈‍⬛ rain, triggered by typing "meow" anywhere. */
export function CatRain() {
  const [drops, setDrops] = useState<{ id: number; x: number; d: number; s: number; delay: number }[]>([])
  useEffect(
    () =>
      fx.onCatRain(() => {
        const base = Date.now()
        setDrops(
          Array.from({ length: 16 }, (_, i) => ({
            id: base + i,
            x: Math.random() * 100,
            d: 2.2 + Math.random() * 1.6,
            s: 28 + Math.random() * 28,
            delay: Math.random() * 1.2,
          })),
        )
        window.setTimeout(() => setDrops([]), 5200)
      }),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-[79] overflow-hidden" aria-hidden>
      {drops.map((d) => (
        <span
          key={d.id}
          className="absolute -top-16"
          style={{
            left: `${d.x}%`,
            fontSize: d.s,
            animation: `catfall ${d.d}s ${d.delay}s ease-in forwards`,
          }}
        >
          🐈‍⬛
        </span>
      ))}
      <style>{`@keyframes catfall{to{transform:translateY(115vh) rotate(260deg)}}`}</style>
    </div>
  )
}
