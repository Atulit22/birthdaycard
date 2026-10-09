import { useWorld } from '../state/DiscoveryContext'
import { useSound } from './useSound'

/** A small 🔊 / 🔇 in the corner. Sound is never required — this is just the off switch. */
export function SoundToggle() {
  const { entered } = useWorld()
  const { muted, unlocked, toggleMuted } = useSound()
  if (!entered || !unlocked) return null
  return (
    <button
      type="button"
      onClick={toggleMuted}
      aria-pressed={muted}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      title={muted ? 'sound off' : 'sound on'}
      className="fixed bottom-3 right-3 z-[75] grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-ink/70 text-lg shadow-lg backdrop-blur-md transition hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:bottom-5 sm:right-5"
    >
      <span aria-hidden className={muted ? 'opacity-60' : ''}>
        {muted ? '🔇' : '🔊'}
      </span>
    </button>
  )
}
