# Easter eggs — developer notes (SPOILERS)

Not linked from the site and not part of the build. If this repo is public, anyone can read this file, so
delete it or keep the repo private before sharing the link.

Where they live: components in `src/components/EasterEggs/` (`Eggs.tsx` = first batch, `SecretEggs.tsx` = second
batch), names/reactions/journal notes in `src/data/easterEggs.ts`, copy you may want to edit in
`src/data/birthdayContent.ts` (marked ✏️). Found secrets are saved in `localStorage` (`ishita-world-v1`);
clear that key to reset. Every discovery plays a melody (different per egg) and the cat comments; chain
finishes also play the longer `secretChord`.

The opening hint is `content.welcome.hidden` (under the lines on the first scene).
The journal: tap the tiny green book on the cosy-corner shelf → the "discoveries" panel becomes
"the little journal" and shows a one-line note under each secret found.

## Second layer (new)

| # | ID | Name | Where | Trigger | Difficulty | What happens | Chain |
|---|----|------|-------|---------|-----------|--------------|-------|
| 1 | `moon` | The moon blinked | Welcome scene, the moon | tap 3× | Easy | moon squishes ("blinks"), chime, caption | – |
| 2 | `balloons` | Pop. Pop. Pop. | Town, island 1 | pop all 3 balloons | Easy | confetti pops; a folded note falls into the grass | **B1** → note |
| 3 | `nickname` | So many names | Welcome scene, the giant name | tap 3× | Easy | the big "Ishu ❤️" cycles Ishu → Chhotu → Ishita → Ishu | – |
| 4 | `sign` | The tired sign | Town, island 2 wooden arrow sign | tap 6× | Easy | the sign gets progressively more annoyed | – |
| 5 | `ticket` | Admit one (forever) | Cinema, the paper ticket | tap 3× | Easy | ticket text becomes "VALID / forever / no refunds ♡" | – |
| 6 | `gateLamp` | The streetlight | Landing screen (before "Enter my little world") | tap the lamp 5× | Easy | it talks back, then flickers | – |
| 7 | `idle` | Still there? | anywhere | no input for 45s (tab visible) | Medium | cat peeks: "are you still there?" | – |
| 8 | `lamp` | Lights out | Cosy corner, hanging lamp | tap lamp (off) | Medium | room dims, glowing "shh... the cat is dreaming." | **A1** → dream |
| 9 | `bouquet` | A tiny bouquet | Town island 1 | tap all 3 flowers | Medium | heart confetti | – |
| 10 | `doodles` | Margin doodles | Scrapbook margins (✦ ♡ ~ ~ ~) | tap all 3 doodles | Medium | they darken; cat comments | – |
| 11 | `return` | Back again | Welcome scene | after the movie (final unlocked), scroll back to the top and stay 1.5s | Medium | cat: "back already?" | – |
| 12 | `whiff` | Whiffed it | Cosy corner, Gameshame (🎮) card | flip it 6× | Medium | "ting" + a teasing line (her own "whiff" joke) | – |
| 13 | `repeat` | On repeat | Cosy corner, Mooojic (🎵) card | flip it 5× | Medium | screen shake + pop; "currently on repeat" | – |
| 14 | `journal` | A tiny book | Cosy corner shelf, next to right flower | tap the book | Medium | opens "FIELD NOTES, vol. 1"; **journal unlocks** in the discoveries panel | – |
| 15 | `dream` | What the cat dreams about | Cosy corner, sleeping cat | tap her **while the lamp is off** | Hard | thought bubble 🐟 🎮 🎵 🐈‍⬛ 🎂; moon starts glowing | **A2** (needs lamp off) → moonLetter |
| 16 | `note` | A note in the grass | Town island 1 (appears after `balloons`) | tap the little folded paper | Hard | riddle: "where the tree meets the grass…" | **B2** → mouse |
| 17 | `mouse` | The mouse | Town island 2, tiny hole left of the rawr/grass | tap the hole **after reading the note** (hole glows gold) | Hard | 🐭 pops out: "NOT TODAY." + chord | **B3** (end) |
| 18 | `resident` | Somebody IS home | Town island 3, the little house | knock 6× (3rd knock lights the window, `house`) | Hard | "who is it?… come in. quietly." + chord | extends existing `house` |
| 19 | `moonLetter` | A letter from the moon | Welcome scene, the moon | after `dream`: tap the glowing moon | Hard | a small letter from the moon + chord | **A3** (end) |
| 20 | `ps` | P.S. | Final scene, the gold "rawr." under the sign-off | tap 3× | Hard | a P.S. appears: "look at the cat." | **C1** → ending |
| 21 | `squirtle` | Squirtle squad | anywhere (keyboard) | type `squirtle` | How-did-you-find-that | water-splash confetti + sound | – |
| 23 | `cake` | The first wish | Welcome scene, the cake under "Happy Birthday, Ishu" | tap the cake | Easy | candles flare, cake bounces, music-box Happy Birthday (~15s, cannot overlap itself), floating notes | – |
| 24 | `catEmergency` | Emergency level: maximum | Scrapbook, yellow "Black Cat Emergency" card | tap the cat 5× | Easy | cat speech bubbles, then a cat rain | – |
| 25 | `knock` | Who is it? | Scrapbook, "knock knock" door card | tap the door, wait, tap again | Medium | knock sound, "Who's there?", door opens, reply + a black cat | – |
| 26 | `tape` | Reusable tape | Scrapbook, tape on the first polaroid | tap the tape | Medium | tape peels off; tiny writing appears on the polaroid border | – |
| 27 | `underside` | The underside | Scrapbook, tiny faint text under the quote card | tap it | Hard | the line changes to "hi. nobody looks down here." | – |
| 28 | `cakeThief` | The cake thief | Area 08 party, the black cat on the table | tap 3× | Medium | cat mutters, crunch, a slice vanishes from the cake | – |
| 29 | `hangingOut` | Just hanging out | Area 08, the guest hanging upside down from the lights | tap him | Easy | flips, "just hanging out." | – |
| 30 | `squirtleDance` | Squirtle squad dance | Area 08, the little blue turtle | tap 5× | Medium | spins, puts on sunglasses, splash | – |
| 31 | `partyRawr` | A flag with a secret | Area 08, one bunting flag has a faint "rawr" | tap the flag | Hard | meow + screen shake | – |
| 32 | `partyBmth` | Turn it up | Area 08, the small speaker with a BMTH sticker | tap it | Medium | a low guitar chug, "turn it down. no. turn it UP." | – |
| 33 | `partyReyna` | Dismissed | Area 08, a faint purple orb in the sky | tap it | Hard | the eye closes with a little sound | – |
| 34 | `gateCat` | Under the lamp | Landing scene, the cat under the streetlamp | tap the cat 3× | Medium | it eyes the lamp (the lamp flickers), mutters "it is just a lamp. I checked." | – |
| 22 | `ending` | The actual last thing | Final scene, the cat | blow out the candle, find the P.S., then tap the (sleeping) cat | How-did-you-find-that | a small card slides out: "the actual last thing…" + chord | **C2** (end) |

Tooltips (hover only, not tracked): area labels 02/03/04 have a `title` that hints at the balloons, the grass/tree
riddle, and "knock louder".

### Chains

- **A (lamp → dream → moon):** switch the cosy-corner lamp off → tap the sleeping cat in the dark → go back to the
  top of the page, the moon glows, tap it.
- **B (balloons → note → mouse):** pop the three balloons on the first island → read the note in the grass → find
  the glowing hole on the second island.
- **C (P.S. → cat):** tap "rawr." three times at the end → blow out the candle → tap the cat.

## First batch (already existed)

| ID | Name | Where | Trigger | Difficulty |
|----|------|-------|---------|-----------|
| `cat` | The cat has limits | any `ClickyCat` | poke 5× (it storms off, returns in sunglasses) | Easy |
| `star` | A very small star | Town sky | tap the tiny gold star | Medium |
| `present` | The suspicious present | Town island 2 | tap twice | Easy |
| `rawr` | A hidden rawr | Town island 2 grass | tap the faint word | Hard |
| `rock` | The rock | Town island 2 | tap 4× | Easy |
| `hiddenCat` | Hide and seek | Town island 2 bush | tap the peeking cat | Medium |
| `lanterns` | All the lanterns | Town island 2 | light all 3 | Easy |
| `house` | Somebody is home | Town island 3 | knock 3× | Easy |
| `meow` | A very polite word | anywhere | type `meow` | Medium |
| `wishes` | Wishing stars | Town | catch 5 shooting stars | Medium |
| `sleepy` | Do not wake the cat | Cosy corner | tap the cat 3× | Easy |
| `popcorn` | Popcorn thief | Cinema | tap the popcorn 3× | Easy |
| `wish` | A wish | Final scene | blow out the candle | Easy |

Totals: 13 original + 34 new = 47 secrets (rows 23-27: cake + scrapbook; rows 28-33: the party scene).

## Area 08 — the party (not a secret, but good to know)

Sticky stage, 340svh tall. Scroll = camera: wide → push in → hold on Ishu → at 66% everybody celebrates (confetti, cheer, claps, banner) → pull back → at ~90% the button "one last little thing... 🎬" appears and scrolls to the movie. Music: a synthesised party tune (partyMusic.ts) that starts when the scene is mostly in view and levels up with the scene (tune → build → celebration → softer). Reduced motion: no camera; it celebrates once after she has been looking at it for a moment.
Order on the page: … scrapbook (06) → party (08) → movie ("now showing") → epilogue letter. There is no area 07 any more — rename the labels if that bugs you. (The new set is 6 easy · 8 medium · 6 hard · 2 "how did you find that" —
a little over the 5/7/5/2 target.)

## The letter (Area 08)

A small envelope (tag: "for Ishu") leans on the cake at the party. It glows softly after the celebration until it has been opened once. Tap it: the party blurs/darkens and its music drops to a whisper (`setPartyLevel(4)`), the envelope lifts toward the camera, opens, and the letter unfolds. Text: `content.final` → `letterGreeting`, `letter` (the first line, "Dear Ishita,", is skipped), `letterPs`, `letterSign`. Close with the button, Esc, or by tapping outside: the party comes back with a fresh cheer and confetti. The old letter card in the epilogue (after the movie) was removed so the letter is not shown twice; the epilogue now only has the envelope, sign-off and the candle.
