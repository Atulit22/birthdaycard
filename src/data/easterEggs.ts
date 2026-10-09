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

  // ——— the second layer (see docs/EASTER_EGGS.md) ———
  moon: { title: 'The moon blinked', reaction: "(it's not made of cheese. I checked.)", note: 'the moon has opinions.' },
  balloons: { title: 'Pop. Pop. Pop.', reaction: 'a little note fell out of the last one. it landed in the grass.', note: 'three balloons. one of them was carrying something.' },
  nickname: { title: 'So many names', reaction: 'Ishita. Chhotu. Ishu. same menace.', note: 'one person, several names, all of them said fondly.' },
  sign: { title: 'The tired sign', reaction: 'ok. the sign has filed a complaint.', note: 'signs have feelings too. apparently.' },
  ticket: { title: 'Admit one (forever)', reaction: 'valid forever. no refunds.', note: 'the ticket never expires.' },
  idle: { title: 'Still there?', reaction: '...are you still there? I was just sitting here.', note: 'sometimes doing nothing is the secret.' },
  lamp: { title: 'Lights out', reaction: 'shh. the cat is dreaming.', note: 'turn the light off in the cosy corner. then listen.' },
  dream: { title: 'What the cat dreams about', reaction: 'she was dreaming of a very good birthday. the moon heard.', note: 'the moon heard it. maybe go say hi.' },
  bouquet: { title: 'A tiny bouquet', reaction: 'ok that is a bouquet now. you made a bouquet.', note: 'three flowers, tapped by the right person.' },
  doodles: { title: 'Margin doodles', reaction: 'you read all the way down to the doodles. of course you did.', note: 'the doodles in the margins were not decoration.' },
  return: { title: 'Back again', reaction: 'back already? ok. I missed you too.', note: 'coming back to the start feels different.' },
  whiff: { title: 'Whiffed it', reaction: '...you whiffed the flip. (affectionately.)', note: 'a very specific kind of miss.' },
  repeat: { title: 'On repeat', reaction: 'currently on repeat. get it?', note: 'some songs you just play again.' },
  gateLamp: { title: 'The streetlight', reaction: 'okay okay. the lamp is fine.', note: 'the very first thing you could have touched.' },
  journal: { title: 'A tiny book', reaction: 'a journal. it fills itself in. I only write the true things.', note: 'this page fills itself in.' },
  note: { title: 'A note in the grass', reaction: 'a riddle. cats love riddles.', note: 'something small is holding its breath where the tree meets the grass.' },
  resident: { title: 'Somebody IS home', reaction: 'okay. you can come in. quietly.', note: 'knock a few more times than you think you should.' },
  mouse: { title: 'The mouse', reaction: 'NOT TODAY.', note: 'the cat has a rivalry. it is not going well.' },
  ps: { title: 'P.S.', reaction: 'I told you there was more.', note: 'the end of a letter is not always the end.' },
  moonLetter: { title: 'A letter from the moon', reaction: 'the moon says happy birthday too.', note: 'lamp, then dream, then the moon.' },
  squirtle: { title: 'Squirtle squad', reaction: 'squirtle squad. 🐢💦', note: 'some words only work if you type them.' },
  cake: { title: 'The first wish', reaction: 'make a wish. I will be quiet.', note: 'a cake that plays a song if you ask nicely.' },
  catEmergency: { title: 'Emergency level: maximum', reaction: 'the emergency cats have been dispatched.', note: 'stare at the cat. five times. trust the process.' },
  knock: { title: 'Who is it?', reaction: 'someone who wanted you to smile. mission: ongoing.', note: 'knock, wait, then answer the door.' },
  tape: { title: 'Reusable tape', reaction: 'the tape was reusable. nobody tell the scrapbook.', note: 'tape is never just tape.' },
  underside: { title: 'The underside', reaction: 'nobody looks down there. except you.', note: 'I wrote on the table too.' },
  cakeThief: { title: 'The cake thief', reaction: 'that slice was there a second ago.', note: 'the cat is innocent. allegedly.' },
  hangingOut: { title: 'Just hanging out', reaction: 'just hanging out. like a normal guest.', note: 'one of the guests prefers the ceiling.' },
  squirtleDance: { title: 'Squirtle squad dance', reaction: 'okay that was a LOT of spinning.', note: 'five taps, one very dizzy turtle.' },
  partyRawr: { title: 'A flag with a secret', reaction: 'the bunting said rawr. the bunting was right.', note: 'one flag out of many is not like the others.' },
  partyBmth: { title: 'Turn it up', reaction: 'turn it down. no. turn it UP.', note: 'there is a speaker. it has a sticker.' },
  partyReyna: { title: 'Dismissed', reaction: 'dismissed.', note: 'something purple is watching the party.' },
  gateCat: { title: 'Under the lamp', reaction: 'it was just a lamp. the cat is fine. the cat is not fine.', note: 'the very first cat, the very first secret.' },
  ending: { title: 'The actual last thing', reaction: 'okay. NOW it is the end. ✦', note: 'the cat was sitting on it the whole time.' },
} as const

/** the short line the journal shows for a found secret (older secrets don't have one) */
export const noteOf = (id: EggId): string | undefined => (EGGS[id] as { note?: string }).note

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

  moonBlink: '(it blinked. did you see that?)',
  mouse: 'NOT TODAY.',
  moonLetter: ['A letter from the moon', 'Dear Ishita,', 'I have been up here all night, watching over this whole little world. You did a very good job exploring it.', 'Happy birthday. Get some sleep. (You will not.)', '— the moon'],
  nickname: ['Ishu', 'Chhotu', 'Ishita'],
  sign: ["You're going the right way.", 'Still the right way.', "Trust me. I'm a sign.", 'Okay now you are just poking me.', 'I have a union, you know.', 'OKAY. I AM TIRED.'],
  houseKnock: ['*knock*', '*knock knock*', "...we're closed!", '...who is it?', "...oh. it's you.", 'come in. quietly.'],
  note: ['a tiny note', 'where the tree meets the grass,', 'something small is holding its breath.', '(say hi. or do not. the cat will.)'],
  book: ['FIELD NOTES, vol. 1', 'everything I noticed about Ishita.', '(this book fills itself in. only the true things go in.)'],
  gateCat: ['meow.', '(is the lamp staring at me?)', 'it is just a lamp. I checked.'],
  gateLamp: ['careful. it is hot.', 'hey.', 'stop poking the lamp.', 'it flickers when it is nervous.', 'okay. okay. it is fine.'],
  ticket: ['VALID', 'forever', 'no refunds ♡'],
  idle: '...are you still there?',
  dream: ['🐟', '🎮', '🎵', '🐈‍⬛', '🎂'],
  lamp: 'shh... the cat is dreaming.',
  whiff: '...you whiffed the flip.',
  squirtle: 'squirtle squad. 🐢💦',
}
