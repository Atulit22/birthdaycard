// ✏️ Secret messages + the cat's reactions. Titles only show up in the
// discovery list AFTER that secret has been found.

export const EGGS = {
  cat: { title: 'The cat has limits', reaction: 'okay fine. you win. sunglasses on.' },
  star: { title: 'A very small star', reaction: 'did you see that?' },
  present: { title: 'The suspicious present', reaction: 'that was supposed to be a surprise.' },
  rawr: { title: 'A hidden rawr', reaction: 'ok that was a good one.' },
  rock: { title: 'The rock', reaction: 'it has feelings now. thanks.' },
  hiddenCat: { title: 'Hide and seek', reaction: '...how did you see me.' },
  lanterns: { title: 'All the lanterns', reaction: 'ooh. pretty.' },
  house: { title: 'Somebody is home', reaction: "they're shy. leave them be." },
  meow: { title: 'A very polite word', reaction: 'you speak cat?!' },
  wishes: { title: 'Wishing stars', reaction: 'Achievement unlocked: Birthday Girl 🏆' },
  sleepy: { title: 'Do not wake the cat', reaction: '...five more minutes.' },
  popcorn: { title: 'Popcorn thief', reaction: "that's mine." },
  wish: { title: 'A wish', reaction: 'I heard it. I won’t tell.' },
} as const

export type EggId = keyof typeof EGGS

export const eggText = {
  catClicks: ['hmm.', 'hey.', 'stop.', 'I said stop.', 'okay bro 😭'],
  catAfter: ['...', 'deal with it.', 'rawr.'],

  tinyStar: {
    found: 'You found me.',
    memoryTitle: 'a tiny memory', // ✏️
    memory: 'Placeholder: a small memory that only the two of you would get.',
  },

  rock: ["It's a rock.", 'Still a rock.', 'Why are you doing this?', '😭', 'ok. it is a rock with feelings.', 'leave him alone.'],

  present: {
    first: '...did it just move?',
    second: 'SURPRISE.',
    third: '...it was me. I was the present.',
  },

  rawr: { bubble: '(a cat rawr, not a dinosaur one.)' },

  house: { knock: ['*knock*', '*knock knock*', "...we're closed!"] },

  hiddenCat: 'You found me. I was winning.',
  sleepy: ['zzz...', 'five more minutes.', '...fine. I am awake. barely.'],
  popcorn: ['crunch.', 'hey. that is mine.', '...okay you can have one.'],
}
