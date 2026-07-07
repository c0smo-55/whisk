import type { Idea, Recipe } from "./types";

// Used when no ANTHROPIC_API_KEY is set, so the deployed demo always works
// and reviewers can click through without a key. The pools are picked from
// deterministically by bowl contents, so different bowls give different
// results. Add a key to get real, ingredient-aware generations from Claude.

export function hashPick(seed: string, size: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % size;
}

export const DEMO_RECIPES: Recipe[] = [
  {
    title: "Matcha Condensed-Milk Cloud Cake",
    sprite: "cake",
    description:
      "A soft, jiggly sponge with a whisper of matcha and sweet condensed milk — light enough to feel like a rainy-afternoon nap.",
    difficulty: "medium",
    totalMinutes: 55,
    servings: "8 slices",
    ingredients: [
      { item: "Cake flour", amount: "120 g" },
      { item: "Matcha powder", amount: "1 tbsp" },
      { item: "Eggs, separated", amount: "4" },
      { item: "Condensed milk", amount: "80 g" },
      { item: "Milk", amount: "60 ml" },
      { item: "Neutral oil", amount: "45 ml" },
      { item: "Caster sugar", amount: "60 g" },
    ],
    steps: [
      "Heat oven to 150°C and line a 7-inch pan. Sift flour with matcha twice — no lumps allowed.",
      "Whisk yolks with condensed milk, milk and oil until glossy, then fold in the flour.",
      "Beat whites to soft peaks, adding sugar in three goes until they hold a gentle curl.",
      "Fold whites into the batter in thirds — patient, from the bottom up, keep the air.",
      "Bake in a water bath 45–50 min until the top springs back. Cool upside-down.",
    ],
    substitutions: [
      { missing: "Cake flour", use: "Plain flour minus 2 tbsp + 2 tbsp cornstarch" },
      { missing: "Condensed milk", use: "3 tbsp sugar + 2 tbsp extra milk" },
    ],
    coffeePairing: {
      drink: "Iced shakerato, lightly sweet",
      why: "The bitter-bright espresso cuts the cake's creamy matcha without fighting it.",
    },
    bakerTip:
      "Under-mix and it deflates; over-mix and it turns dense. Fold until *just* no streaks remain.",
  },
  {
    title: "Banana Choc-Chunk Loaf",
    sprite: "bread",
    description:
      "Deeply banana-y, studded with melty chocolate pockets — the loaf that makes overripe bananas feel like a plan.",
    difficulty: "easy",
    totalMinutes: 70,
    servings: "10 slices",
    ingredients: [
      { item: "Very ripe bananas", amount: "3 (about 350 g)" },
      { item: "Plain flour", amount: "220 g" },
      { item: "Butter, melted", amount: "100 g" },
      { item: "Brown sugar", amount: "110 g" },
      { item: "Egg", amount: "1" },
      { item: "Dark chocolate, chopped", amount: "120 g" },
      { item: "Baking soda", amount: "1 tsp" },
    ],
    steps: [
      "Heat oven to 175°C and line a loaf tin. Mash bananas until mostly smooth.",
      "Whisk in melted butter, brown sugar and the egg until glossy.",
      "Fold in flour and baking soda until just combined — lumps are friends.",
      "Fold through the chocolate chunks, saving a handful for the top.",
      "Bake 55–60 min until a skewer comes out with only melty chocolate on it.",
    ],
    substitutions: [
      { missing: "Brown sugar", use: "White sugar + 1 tsp honey" },
      { missing: "Dark chocolate", use: "Any chocolate bar you'd happily eat" },
    ],
    coffeePairing: {
      drink: "Flat white, double shot",
      why: "Milky enough to hug the banana, strong enough to stand up to the chocolate.",
    },
    bakerTip:
      "Bananas can't be too ripe — black-speckled and sad-looking is exactly right.",
  },
  {
    title: "Strawberry Milk Shortcake Cookies",
    sprite: "cookie",
    description:
      "Buttery shortcake in cookie form, kissed with strawberry and a milky glaze — pink, soft, unreasonably cute.",
    difficulty: "easy",
    totalMinutes: 40,
    servings: "12 cookies",
    ingredients: [
      { item: "Plain flour", amount: "200 g" },
      { item: "Cold butter, cubed", amount: "120 g" },
      { item: "Caster sugar", amount: "70 g" },
      { item: "Freeze-dried or fresh strawberries", amount: "40 g" },
      { item: "Milk", amount: "3 tbsp" },
      { item: "Icing sugar", amount: "60 g" },
    ],
    steps: [
      "Heat oven to 170°C. Rub cold butter into flour and sugar until sandy.",
      "Crush the strawberries and toss them through — streaks of pink are the goal.",
      "Bring the dough together with 1–2 tbsp milk; don't knead, just press.",
      "Scoop 12 rounds, flatten slightly, and bake 14–16 min until the edges blush gold.",
      "Whisk icing sugar with the remaining milk and drizzle over the cooled cookies.",
    ],
    substitutions: [
      { missing: "Strawberries", use: "Any berry, or 1 tbsp jam swirled through" },
      { missing: "Icing sugar", use: "Blitz caster sugar to a powder" },
    ],
    coffeePairing: {
      drink: "Strawberry oat latte",
      why: "Doubling down on the berry makes the shortcake taste even more like dessert.",
    },
    bakerTip:
      "Keep the butter cold and the mixing short — warmth is the enemy of a tender crumb.",
  },
  {
    title: "Lemon Honey Butter Tart",
    sprite: "pie",
    description:
      "A crisp butter shell holding a bright lemon-honey curd — sharp, sticky and golden, like bottled sunshine.",
    difficulty: "advanced",
    totalMinutes: 90,
    servings: "8 slices",
    ingredients: [
      { item: "Plain flour", amount: "180 g" },
      { item: "Cold butter", amount: "130 g" },
      { item: "Lemons, zest + juice", amount: "3" },
      { item: "Honey", amount: "70 g" },
      { item: "Eggs", amount: "3" },
      { item: "Caster sugar", amount: "80 g" },
    ],
    steps: [
      "Rub 100 g butter into flour with a pinch of sugar; bind with cold water. Chill 30 min.",
      "Roll, line a tart tin, and blind-bake at 180°C for 18 min until pale gold.",
      "Whisk eggs, sugar, honey, zest and juice over low heat until it thickly coats a spoon.",
      "Beat in the last 30 g butter off the heat — this is what makes the curd silky.",
      "Fill the shell and bake 8 more minutes, until the centre barely trembles.",
    ],
    substitutions: [
      { missing: "Honey", use: "Golden syrup or 60 g extra sugar" },
      { missing: "Lemons", use: "Limes, or half orange for a softer curd" },
    ],
    coffeePairing: {
      drink: "Espresso tonic with a lemon twist",
      why: "Citrus on citrus — the tonic's bitterness resets your palate between bites.",
    },
    bakerTip:
      "Take the curd off the heat the moment it coats the spoon — carryover heat finishes it.",
  },
  {
    title: "Brown-Butter Vanilla Cupcakes",
    sprite: "cupcake",
    description:
      "Plain vanilla, upgraded: nutty brown butter in the crumb and a silky vanilla-bean frosting on top.",
    difficulty: "medium",
    totalMinutes: 50,
    servings: "12 cupcakes",
    ingredients: [
      { item: "Butter", amount: "150 g" },
      { item: "Plain flour", amount: "180 g" },
      { item: "Caster sugar", amount: "140 g" },
      { item: "Eggs", amount: "2" },
      { item: "Milk", amount: "100 ml" },
      { item: "Vanilla extract", amount: "2 tsp" },
      { item: "Baking powder", amount: "1.5 tsp" },
    ],
    steps: [
      "Melt the butter over medium heat until it foams, smells nutty and turns amber. Cool slightly.",
      "Whisk brown butter with sugar, then beat in eggs, vanilla and milk.",
      "Fold in flour and baking powder until just smooth — stop at the last streak.",
      "Divide between 12 cases and bake at 175°C for 18–20 min until they spring back.",
      "Whip the remaining brown butter with icing sugar and a splash of milk; swirl on once cool.",
    ],
    substitutions: [
      { missing: "Vanilla extract", use: "1 tsp honey + a pinch of cinnamon" },
      { missing: "Milk", use: "Any plant milk, or yogurt thinned with water" },
    ],
    coffeePairing: {
      drink: "Cortado",
      why: "Small, warm and nutty — it echoes the brown butter instead of shouting over it.",
    },
    bakerTip:
      "Watch the butter like a hawk after it foams — nutty to burnt takes about ten seconds.",
  },
  {
    title: "Chocolate Glaze Donuts",
    sprite: "donut",
    description:
      "Fluffy baked rings dunked in a glossy chocolate glaze — no fryer, no drama, all shine.",
    difficulty: "easy",
    totalMinutes: 35,
    servings: "10 donuts",
    ingredients: [
      { item: "Plain flour", amount: "200 g" },
      { item: "Caster sugar", amount: "90 g" },
      { item: "Egg", amount: "1" },
      { item: "Milk", amount: "160 ml" },
      { item: "Butter, melted", amount: "50 g" },
      { item: "Dark chocolate", amount: "100 g" },
      { item: "Baking powder", amount: "2 tsp" },
    ],
    steps: [
      "Heat oven to 180°C and grease a donut pan (or improvise rings with a muffin tin and foil balls).",
      "Whisk flour, sugar and baking powder; separately whisk egg, milk and melted butter.",
      "Combine wet into dry with as few strokes as you can get away with.",
      "Pipe into the pan and bake 10–12 min until they bounce back to a poke.",
      "Melt the chocolate with a knob of butter, dunk the cooled donuts top-first, and let the glaze set.",
    ],
    substitutions: [
      { missing: "Donut pan", use: "Muffin tin — they become 'donut buns', still excellent" },
      { missing: "Dark chocolate", use: "Cocoa + icing sugar + hot water, whisked glossy" },
    ],
    coffeePairing: {
      drink: "Long black",
      why: "Clean bitterness against a sweet glaze — the classic donut-shop equation.",
    },
    bakerTip:
      "Dunk while the glaze is warm and fluid; reheat it gently the second it starts to thicken.",
  },
];

// The demo idea pitches are derived straight from the demo recipes, so a
// picked idea always has its exact recipe waiting in stage two.
const DEMO_HOOKS: string[] = [
  "Jiggly, barely-sweet, and the matcha does the talking.",
  "Those spotty bananas were waiting for exactly this.",
  "A shortcake that fits in one hand — and in your lunchbox.",
  "Bright, sticky, golden — sunshine in pastry form.",
  "Nutty brown butter turns plain vanilla into a flex.",
  "Baked, not fried — glossy glaze, zero regrets.",
];

export const DEMO_IDEAS: Idea[] = DEMO_RECIPES.map((r, i) => ({
  title: r.title,
  sprite: r.sprite,
  hook: DEMO_HOOKS[i] ?? r.description,
}));
