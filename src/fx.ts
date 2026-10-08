// Tiny event bus for screen-wide effects, so any component can trigger them
// without prop drilling or context re-renders.

export interface ConfettiOpts {
  x?: number // 0..1 of viewport width (default centre)
  y?: number // 0..1 of viewport height
  count?: number
  spread?: number
  power?: number
  shapes?: Array<'rect' | 'heart' | 'star' | 'dot'>
}

type Listener<T> = (arg: T) => void
const confettiL = new Set<Listener<ConfettiOpts>>()
const rainL = new Set<Listener<void>>()

export const fx = {
  confetti(opts: ConfettiOpts = {}) {
    confettiL.forEach((l) => l(opts))
  },
  shake() {
    const b = document.body
    b.classList.remove('screen-shake')
    void b.offsetWidth
    b.classList.add('screen-shake')
    window.setTimeout(() => b.classList.remove('screen-shake'), 650)
  },
  catRain() {
    rainL.forEach((l) => l())
  },
  onConfetti(l: Listener<ConfettiOpts>) {
    confettiL.add(l)
    return () => void confettiL.delete(l)
  },
  onCatRain(l: Listener<void>) {
    rainL.add(l)
    return () => void rainL.delete(l)
  },
}
