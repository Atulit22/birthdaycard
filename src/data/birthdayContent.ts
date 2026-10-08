// ✏️  EDIT ME  ✏️
// Everything personal lives in this file (and easterEggs.ts for the secret lines).
// Lines marked "placeholder" are there so you can swap in real inside jokes / memories.

export type ScrapKind = 'polaroid' | 'note' | 'quote' | 'joke' | 'memory'

export interface CornerCard {
  id: string
  emoji: string
  title: string
  teaser: string
  items: string[] // shown on the back of the card
  color: 'wine' | 'plum' | 'cream' | 'blush' | 'gold' | 'sage'
}

export interface ScrapItem {
  id: string
  kind: ScrapKind
  title: string // small label on the front
  teaser: string // what you see before opening
  body: string // what's revealed
  image?: string // optional photo path, e.g. '/photos/us.jpg' (put files in /public)
  caption?: string
}

export const content = {
  name: 'Ishita',

  video: {
    // The full-quality video lives on Google Drive (too big to ship with the site).
    url: 'https://drive.google.com/file/d/1yUzfUMbcvNBkvdqZSMCfQed5Z0zdvjox/view?usp=drive_link',
    heading: 'Your birthday movie 🎬',
    eyebrow: 'a little surprise',
    title: 'One last little thing... 🎁',
    lines: ['A tiny piece of this whole birthday world,', 'made especially for you.'] as [string, string],
    button: '🎬 Get Your Birthday Video',
    note: 'The full-quality version is waiting for you.',
    badge: '✦ made just for you · full quality ✦',
    tinyEgg: 'shhh. it is a good one.',
  },

  gate: {
    lines: ['pssst...', "I think there's something here for you."],
    button: 'Go explore ✦',
  },

  welcome: {
    eyebrow: 'a tiny world, made for',
    title: 'Chhotu',
    lines: ['okay good. you came.', 'scroll slowly.', 'some things in here are hiding.'],
    scrollHint: 'psst — keep going down',
  },

  // What the little cat says the first time you reach each area
  areaWhispers: {
    town: 'welcome to town. population: you. and me.',
    corner: "this part's just yours.",
    scrapbook: 'I kept some things. nobody tell her.',
    cinema: '...oh. look at that.',
  },

  town: {
    welcomeSign: ['Birthday Town', 'pop. 1 (+ cat)'],
    flowerLines: ['pretty.', 'also pretty.', 'okay that one is just fine.', '...no. pretty.'],
    signLines: ["You're going the right way.", 'Still the right way.', "Trust me. I'm a sign."],
    presentLines: ['Not yet 👀', 'patience.', 'I said not yet.', '...ok but not yet.'],
    cornerSign: "Ishita's corner ↓",
  },

  corner: {
    eyebrow: 'a small corner of the world',
    title: 'Things that are very Ishu :>',
    sub: '(tap a card. they open.)',
    cards: [
      {
        id: 'gaming',
        emoji: '🎮',
        title: 'Gameshame',
        teaser: 'press start',
        color: 'plum',
        items: [
          'valorant: sabse zyada whiff krne wali game :>', // ✏️
          'reyna main: cuz ofc yawr util use ni krni padti',
          'ghee khatam: hone ke baad bhi game khelna',
        ],
      },
      {
        id: 'music',
        emoji: '🎵',
        title: 'Mooojic',
        teaser: 'currently on repeat',
        color: 'wine',
        items: [
          'BMTH: ye to fav hi hai kya hi bolu all i can say is so you drag me through helllllll',
          'i love arpit bala thongs 🤓',
        ],
      },
      {
        id: 'cats',
        emoji: '🐈‍',
        title: 'miau ',
        teaser: 'rawr (affectionate)',
        color: 'cream',
        items: [
          'Every cat is a good cat.',
          'Black cats are the best cats. This is science.',
          'but no cat can miau like you chhotu',
        ],
      },
      {
        id: 'chaos',
        emoji: '💅🏻',
        title: 'Divaness',
        teaser: 'handle with care',
        color: 'blush',
        items: [
          'im still traumatized by vo "thongs google crow"💅🏻',
          'ddd to yawr ese yk its either both of us or none of us xd 💅🏻',
          'and sassy hona to apse hi sikha hai so yea its wtv but also still pitti hogi ek din💅🏻',
        ],
      },
      {
        id: 'personality',
        emoji: '❤️',
        title: 'Personality',
        teaser: 'the good stuff',
        color: 'gold',
        items: [
          'yawr isme to mai kya hi bolu but all i can say is youre the peace and safeplace',
          'motherly nature ke sath jo mere ko daant padti hai apse TvT but jokes aside im really grateful for that',
          'i am so greatful ki you notice when im quiet and you make me feel like i matter and im so thankful for that and i love that',
        ],
      },
      {
        id: 'random',
        emoji: '✨',
        title: 'some famous slangs',
        teaser: 'no category fits',
        color: 'sage',
        items: [
          'bhadwe ka baccha: yea b ka b mhm',
          'beech convo me gandmasti aana xD',
        
        ],
      },
    ] satisfies CornerCard[],
  },

  scrapbook: {
    title: 'A few things worth remembering...',
    sub: 'tap the little pieces of paper',
    items: [
      {
        id: 's1',
        kind: 'polaroid',
        title: 'polaroid #1',
        teaser: 'Read this when today sucks',
        caption: 'placeholder photo',
        body: 'Hey.If today feels like absolute garbage, thats okay.You dont have to fix everything today.Drink some water.Eat something.Take a little break.Tomorrow doesnt need todays permission to be better. ♡',
        // image: '/photos/one.jpg',
      },
      {
        id: 's2',
        kind: 'note',
        title: 'sticky note',
        teaser: 'Black Cat Emergency',
        body: 'IMPORTANT CAT ANNOUNCEMENT A tiny black cat has been dispatched to your location.Its only job is to sit beside you and judge whoever ruined your mood.Unfortunately it has no idea where you live.Skill issue. 🐈‍⬛',
      },
      {
        id: 's3',
        kind: 'quote',
        title: 'a quote',
        teaser: 'A reminder',
        body: '"You dont have to be productive every second to be doing enough.Rest isnt wasting time. You are allowed to have weird days.Slow days.Sad days.Confusing days.Youre still you on all of them.',
      },
      {
        id: 's4',
        kind: 'joke',
        title: 'a joke',
        teaser: 'knock knock',
        body: "Who's there? ...A black cat. Black cat who? Rawr. (rawrnay.)",
      },
      {
        id: 's5',
        kind: 'memory',
        title: 'a memory',
        teaser: 'Dont forget…',
        body: 'Dont forget that youre allowed to be proud of yourself.Even for things nobody else noticed.Getting through something difficult.Trying again.Getting out of bed.Making someone laugh.Being there for someone.Small things count too.',
      },
      {
        id: 's6',
        kind: 'polaroid',
        title: 'polaroid #2',
        teaser: 'One last thing',
        caption: 'placeholder photo',
        body: 'I hope whenever you come back to this page,you remember that someone made this little corner of the internetjust hoping it would make you smile.Thats it.No pressure.No big speech.Just...I hope youre doing okay. ♡',
      },
    ] satisfies ScrapItem[],
  },

  cinema: {
    marquee: 'ONE LAST THING...',
    found: 'You found it.',
    ticket: ['ADMIT ONE', 'Ishita', 'Row ★ Seat 1'],
  },

  afterVideo: {
    lines: ['I hope you love your little movie.', 'Okay... I have one more thing.'],
    button: 'Follow the cat ✦',
  },

  final: {
    envelopeLabel: 'For Ishita.',
    envelopeHint: '(go on. open it.)',
    // Each string is one paragraph of the handwritten letter.
    letter: [
      'Dear Ishita,',
      'I wanted to give you something that was not just a card, so I built you a tiny world instead.', // ✏️
      'I know this might look a little silly or childish, but I just wanted to do something more than simply texting you Happy Birthday. I wanted to make something that you could actually experience and hopefully smile at',
      'I hope this made you smile and hope it was worth it:>',
      'Anyway. I hope this year is soft where it needs to be and loud where it should be.',
      'Thank you for being you. Seriously.',
    ],
    signoff: 'Happy Birthday, Ishita ❤️',
    rawr: 'rawr.',
    wishPrompt: 'one more thing — make a wish, then blow out the candle',
    wishDone: 'wish received. I will not tell anyone.',
    // {n} gets replaced with the number of secrets she found
    secretsLine: 'you found {n} secrets. there were more.',
    restart: 'Take me back to the beginning ↑',
  },
}
