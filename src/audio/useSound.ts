import { useSyncExternalStore } from 'react'
import { audio } from './AudioManager'

export { audio }
export const playSound = audio.play.bind(audio)

/** React view of the audio state, plus the mute control. */
export function useSound() {
  const state = useSyncExternalStore(audio.subscribe, audio.getState)
  return { ...state, play: playSound, toggleMuted: () => audio.toggleMuted() }
}
