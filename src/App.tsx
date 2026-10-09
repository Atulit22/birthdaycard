import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { SoundScape } from './audio/SoundScape'
import { SoundToggle } from './audio/SoundToggle'
import { SecretWatchers } from './components/EasterEggs/SecretEggs'
import { KeywordListener } from './components/EasterEggs/Eggs'
import { CatWhisper } from './components/UI/CatWhisper'
import { CatRain, ConfettiLayer } from './components/UI/Confetti'
import { DiscoveryHUD } from './components/UI/DiscoveryHUD'
import { Cinema } from './sections/Cinema/Cinema'
import { PartyScene } from './sections/Party/PartyScene'
import { FinalMessage } from './sections/FinalMessage/FinalMessage'
import { BirthdayTown } from './sections/BirthdayTown/BirthdayTown'
import { Gate } from './sections/Intro/Gate'
import { Welcome } from './sections/Intro/Welcome'
import { IshitaCorner } from './sections/IshitaCorner/IshitaCorner'
import { ScrapbookSection } from './sections/Scrapbook/ScrapbookSection'
import { useWorld } from './state/DiscoveryContext'

export default function App() {
  const { entered, finalUnlocked } = useWorld()

  // Always start at the top, and keep the page still until she presses "Go explore".
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('locked', !entered)
  }, [entered])

  // little tab-title easter egg
  useEffect(() => {
    const original = document.title
    const h = () => {
      document.title = document.hidden ? 'come back 🥺' : original
    }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [])

  return (
    <>
      <AnimatePresence>{!entered && <Gate key="gate" />}</AnimatePresence>

      <motion.main initial={false} animate={{ opacity: entered ? 1 : 0 }} transition={{ duration: 1.2, delay: 0.3 }}>
        <Welcome />
        <BirthdayTown />
        <IshitaCorner />
        <ScrapbookSection />
        <PartyScene />
        <Cinema />
        {finalUnlocked && <FinalMessage />}
      </motion.main>

      <SoundScape />
      <SoundToggle />
      <DiscoveryHUD />
      <CatWhisper />
      <ConfettiLayer />
      <CatRain />
      <KeywordListener />
      <SecretWatchers />
    </>
  )
}
