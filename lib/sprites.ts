// Hand-drawn 8-bit sprites. Each sprite is a pixel grid ('.' = transparent)
// plus its own little pastel palette. Rendered as crisp SVG rects by
// <PixelSprite/>, so they scale to any size without blurring.

export interface SpriteDef {
  grid: string[];
  palette: Record<string, string>;
}

const PLUM = "#4B3059";

export const SPRITES: Record<string, SpriteDef> = {
  // ---- pantry ingredients ----
  flour: {
    grid: [
      ".....oo.....",
      "....o##o....",
      "...oo##oo...",
      "..o######o..",
      ".o########o.",
      ".o##PPPP##o.",
      ".o#P#{}#P#o.",
      ".o##PPPP##o.",
      ".o########o.",
      ".o########o.",
      "..oooooooo..",
    ],
    palette: { o: PLUM, "#": "#FFF3E6", P: "#FF9EC7", "{": "#FFD6E8", "}": "#FFD6E8" },
  },
  sugar: {
    grid: [
      "..LLLLLL..",
      "..L####L..",
      ".oooooooo.",
      ".oWWWWWWo.",
      ".oWsWWsWo.",
      ".oWWWWWWo.",
      ".oWWsWWWo.",
      ".oooooooo.",
    ],
    palette: { L: "#B79CED", "#": "#CBB5F2", o: PLUM, W: "#FFFDF8", s: "#D6E9FF" },
  },
  butter: {
    grid: [
      ".BBBBBBBBBB.",
      "BYYYYYYYYYYB",
      "BYWWYYYYYYYB",
      "BYYYYYYYYYYB",
      "BYYYYYYYYYYB",
      ".BBBBBBBBBB.",
    ],
    palette: { B: "#E8B04B", Y: "#FFD68A", W: "#FFF1C9" },
  },
  egg: {
    grid: [
      "....WWWW....",
      "...WWWWWW...",
      "..WWsWWWWW..",
      ".WWsWWWWWWW.",
      ".WWWWWWWWEW.",
      ".WWWWWWWWEW.",
      ".WWWWWWWWWW.",
      "..WWWWWWWW..",
      "...WWWWWW...",
      "....WWWW....",
    ],
    palette: { W: "#FFFDF6", s: "#FFFFFF", E: "#F0E2D0" },
  },
  milk: {
    grid: [
      "...oooooo...",
      "..o######o..",
      ".o########o.",
      "o##########o",
      "o###PPPP###o",
      "o##P####P##o",
      "o###PPPP###o",
      "o##########o",
      "o##########o",
      "oooooooooooo",
    ],
    palette: { o: PLUM, "#": "#FFFFFF", P: "#8FB8FF" },
  },
  matcha: {
    grid: [
      "....gggg....",
      "...gGGGGg...",
      "..gGGGGGGg..",
      ".PPPPPPPPPP.",
      ".P########P.",
      "..P######P..",
      "...PPPPPP...",
    ],
    palette: { g: "#A8D8A0", G: "#7BC47F", P: "#E26AA5", "#": "#FF9EC7" },
  },
  chocolate: {
    grid: [
      "DDDDDDDDDDD",
      "DCWCCDCCCCD",
      "DCCCCDCCCCD",
      "DDDDDDDDDDD",
      "DCCCCDCCCCD",
      "DCCCCDCCCCD",
      "DDDDDDDDDDD",
    ],
    palette: { D: "#6B4226", C: "#8B5E3C", W: "#A87B54" },
  },
  strawberry: {
    grid: [
      "....LL......",
      "..LLLLLL....",
      ".RRRLLRRR...",
      "RRRRRRRRRR..",
      "RWRRRRsRRR..",
      "RRRRsRRRRR..",
      ".RRRRRRRR...",
      ".RsRRRsRR...",
      "..RRRRRR....",
      "...RRRR.....",
      "....RR......",
    ],
    palette: { L: "#7BC47F", R: "#FF7DA0", W: "#FFD6E8", s: "#FFD6E8" },
  },
  banana: {
    grid: [
      ".......DB.",
      "......BYYB",
      ".....BYYB.",
      "....BYYB..",
      "...BYYYB..",
      "..BYYYB...",
      ".BYYYB....",
      ".BYYB.....",
      ".BBB......",
    ],
    palette: { D: "#8B5E3C", B: "#E0B84E", Y: "#FFE28A" },
  },
  lemon: {
    grid: [
      "..o.......",
      "...LLLL...",
      "..LLLLLL..",
      ".LLwLLLLL.",
      ".LLLLLLLL.",
      "..LLLLLL..",
      "...LLLL...",
      ".......o..",
    ],
    palette: { o: "#E0B84E", L: "#FFE770", w: "#FFF6BF" },
  },
  honey: {
    grid: [
      "..LLLLLL..",
      "..LLLLLL..",
      ".HHHHHHHH.",
      ".HHWHHHHH.",
      ".HHHHHHHH.",
      ".HHHHHHHH.",
      "..HHHHHH..",
    ],
    palette: { L: "#B79CED", H: "#F2A65A", W: "#FFD9A8" },
  },
  vanilla: {
    grid: [
      "....oo....",
      "....oo....",
      "...o##o...",
      "..o####o..",
      "..o#VV#o..",
      "..o#VV#o..",
      "..o#VV#o..",
      "...oooo...",
    ],
    palette: { o: PLUM, "#": "#EDE7F5", V: "#8B5E3C" },
  },

  // ---- dessert heroes (Claude picks one per recipe) ----
  cake: {
    grid: [
      "......RR......",
      "......R.......",
      "..WWWWWWWWWW..",
      "..WWWWWWWWWW..",
      "..WPPWWPPWWP..",
      "..PPPPPPPPPP..",
      "..PsPPPPPsPP..",
      "..PPPPPPPPPP..",
      ".LLLLLLLLLLLL.",
    ],
    palette: { R: "#FF7DA0", W: "#FFFDF8", P: "#FF9EC7", s: "#FFD6E8", L: "#B79CED" },
  },
  cupcake: {
    grid: [
      ".....PP.....",
      "....PPPP....",
      "...PsPPPP...",
      "..PPPPPPsP..",
      "..PPPPPPPP..",
      ".LLLLLLLLLL.",
      ".L#L#L#L#LL.",
      "..LLLLLLLL..",
      "...LLLLLL...",
    ],
    palette: { P: "#FF9EC7", s: "#FFD6E8", L: "#B79CED", "#": "#CBB5F2" },
  },
  cookie: {
    grid: [
      "...TTTT...",
      "..TTTTTT..",
      ".TTCTTTTT.",
      ".TTTTTCTT.",
      ".TTTTTTTT.",
      ".TCTTTTCT.",
      "..TTTCTT..",
      "...TTTT...",
    ],
    palette: { T: "#E8B87F", C: "#6B4226" },
  },
  bread: {
    grid: [
      "..BBBBBB..",
      ".BBBBBBBB.",
      "BBBBBBBBBB",
      "BbbBbbBbbB",
      "BBBBBBBBBB",
      ".BBBBBBBB.",
    ],
    palette: { B: "#E8B87F", b: "#FFF3E6" },
  },
  pie: {
    grid: [
      ".CCCCCCCCCC.",
      "CFFCFFCFFCFC",
      "CFFFFFFFFFFC",
      ".CCCCCCCCCC.",
      "..CCCCCCCC..",
    ],
    palette: { C: "#E8B04B", F: "#FF7DA0" },
  },
  donut: {
    grid: [
      "...PPPPPP...",
      "..PPsPPPPP..",
      ".PPPPPPbPPP.",
      ".PPP....PPP.",
      ".PsP....PbP.",
      ".PPP....PPP.",
      "..PPPPsPPP..",
      "...PPPPPP...",
    ],
    palette: { P: "#FF9EC7", s: "#8FB8FF", b: "#FFD68A" },
  },

  // ---- decor & UI ----
  whisk: {
    grid: [
      ".....oo.....",
      ".....oo.....",
      ".....oo.....",
      "....o##o....",
      "...o####o...",
      "..o##LL##o..",
      "..o#L..L#o..",
      "..o#L..L#o..",
      "..o##LL##o..",
      "...o####o...",
      "....o##o....",
    ],
    palette: { o: PLUM, "#": "#EDE7F5", L: "#B79CED" },
  },
  heart: {
    grid: [
      ".PP..PP.",
      "PPPPPPPP",
      "PsPPPPPP",
      ".PPPPPP.",
      "..PPPP..",
      "...PP...",
    ],
    palette: { P: "#FF9EC7", s: "#FFD6E8" },
  },
  star: {
    grid: [
      "....Y....",
      "...YYY...",
      "YYYYYYYYY",
      ".YYYYYYY.",
      "..YYYYY..",
      ".YY...YY.",
    ],
    palette: { Y: "#FFD68A" },
  },
  sparkle: {
    grid: [
      "...B...",
      "..BBB..",
      ".BBWBB.",
      "..BBB..",
      "...B...",
    ],
    palette: { B: "#8FB8FF", W: "#FFFFFF" },
  },
  cloud: {
    grid: [
      "...WWWW....",
      "..WWWWWW...",
      ".WWWWWWWWW.",
      "WWWWWWWWWWW",
    ],
    palette: { W: "#FFFFFF" },
  },
};

export type SpriteName = keyof typeof SPRITES;

// The tappable pantry, in display order.
export const PANTRY: { key: SpriteName; label: string }[] = [
  { key: "flour", label: "Flour" },
  { key: "sugar", label: "Sugar" },
  { key: "butter", label: "Butter" },
  { key: "egg", label: "Eggs" },
  { key: "milk", label: "Milk" },
  { key: "matcha", label: "Matcha" },
  { key: "chocolate", label: "Chocolate" },
  { key: "strawberry", label: "Strawberry" },
  { key: "banana", label: "Banana" },
  { key: "lemon", label: "Lemon" },
  { key: "honey", label: "Honey" },
  { key: "vanilla", label: "Vanilla" },
];

// Best-effort match from a free-text ingredient name to a pantry sprite.
const KEYWORDS: [string, SpriteName][] = [
  ["flour", "flour"],
  ["sugar", "sugar"],
  ["butter", "butter"],
  ["egg", "egg"],
  ["milk", "milk"],
  ["cream", "milk"],
  ["matcha", "matcha"],
  ["chocolate", "chocolate"],
  ["cocoa", "chocolate"],
  ["strawberr", "strawberry"],
  ["berr", "strawberry"],
  ["banana", "banana"],
  ["lemon", "lemon"],
  ["citrus", "lemon"],
  ["honey", "honey"],
  ["vanilla", "vanilla"],
];

export function matchSprite(item: string): SpriteName {
  const lower = item.toLowerCase();
  for (const [kw, sprite] of KEYWORDS) {
    if (lower.includes(kw)) return sprite;
  }
  return "sparkle";
}
