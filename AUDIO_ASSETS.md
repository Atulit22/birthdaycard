# Audio assets

**There are no external audio files in this project.** Every sound is synthesised at runtime with the
Web Audio API (oscillators + filtered noise) in [`src/audio/sounds.ts`](src/audio/sounds.ts) and
[`src/audio/synth.ts`](src/audio/synth.ts). That means:

- nothing was downloaded from Mixkit, Pixabay, Freesound or anywhere else;
- there is no third-party licence to track, and no copyrighted game / film / music material;
- the audio footprint in the repository and in the build is 0 bytes.

| Asset | Source | URL | License | Where used |
| --- | --- | --- | --- | --- |
| tap, toggle | synthesised in code | – | original work | sound toggle, small UI taps |
| pop | synthesised in code | – | original work | every tappable object (`Poppable`) |
| sparkle, confettiPop | synthesised in code | – | original work | welcome shimmer, wishing stars, tiny star, confetti |
| whoosh, whooshSoft | synthesised in code | – | original work | opening the gate, "follow the cat", cat storming off |
| paperFlip, paperRustle, envelope | synthesised in code | – | original work | scrapbook cards, entering the scrapbook, opening the letter |
| shutter | synthesised in code | – | original work | reserved (not wired to anything yet) |
| catPoke, catMeow, catPeek | synthesised in code | – | original work | poking the cat, the sleepy cat, `meow` keyword, the cat peeking up with a whisper |
| discover | synthesised in code | – | original work | every Easter egg (a different melody per egg) |
| success, blow | synthesised in code | – | original work | finishing the movie, blowing out the candle |
| gateOpen | synthesised in code | – | original work | "Go explore" |
| cakeTap, flame, happyBirthday | synthesised in code (a music-box rendition of the traditional, public-domain Happy Birthday melody) | – | original work | tapping the cake |
| knock, tapeRip | synthesised in code | – | original work | scrapbook door card, peeling the tape |
| cheer, clap, giggle, popper, crunch, leer, riff | synthesised in code | – | original work | the party scene (celebration, tiny reactions, speaker sticker, purple orb) |
| party tune (partyMusic.ts) | synthesised in code, an original 8-bar tune | – | original work | the party scene, looping while it is on screen |
| curtain, projector | synthesised in code | – | original work | cinema curtains opening |
| finaleLights, giftAppear, giftOpen, riser, impact, ctaShimmer, ctaHover, ctaGo | synthesised in code | – | original work | the final movie section (see below) |
| ambience: room, wind, birds, shimmer, hum, drone | synthesised in code | – | original work | per-section background layers |

## If you want to swap in recorded sounds later

Prefer Mixkit or Pixabay (simple licences), or Freesound items that are CC0 / CC-BY. Add a row to the table
above for every file (asset name, source site, URL, licence, where used), keep the files small (OGG/MP3, WAV only
for very short effects), and play them from `AudioManager` through the same `sfx` bus so mute, volume and
voice limits keep working.
