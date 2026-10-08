# Ishita's Birthday World

A scroll-based, interactive birthday world. React + TypeScript + Vite + Tailwind v4 + Motion.

```
npm install
npm run dev      # develop
npm run build    # production build into /dist
```

## Edit the content (no UI code needed)

| What | Where |
| --- | --- |
| Messages, cards, scrapbook, letter, video link | `src/data/birthdayContent.ts` |
| Secret names, the cat's reactions, rock/present/star text | `src/data/easterEggs.ts` |
| Video link | the video is hosted on Google Drive; change `content.video.url` |
| Scrapbook photos | add to `/public/photos/` and set `image: '/photos/x.jpg'` on a polaroid item |

## Secrets (spoilers!)
cat (poke x5) · tiny gold star in the sky · suspicious dark present (x2) · faint "rawr" in the grass ·
the rock (x4) · cat hiding behind the bush · light all 3 lanterns · knock on the little house (x3) ·
type "meow" anywhere · catch 5 wishing stars (optional game) · sleeping cat in the corner (x3) ·
popcorn in the cinema (x3) · blow out the candle at the very end.

Her progress is saved in `localStorage` (key `ishita-world-v1`). Clear it to replay from scratch.
