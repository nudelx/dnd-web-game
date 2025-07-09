import { XP_REQUIREMENTS } from "../const/xp";

export const getCharacterStats = (charClass, race) => {
  const baseStats = {
    Fighter: { str: 16, dex: 14, con: 15, int: 10, wis: 12, cha: 8 },
    Wizard: { str: 8, dex: 14, con: 12, int: 16, wis: 14, cha: 10 },
    Rogue: { str: 12, dex: 16, con: 12, int: 14, wis: 10, cha: 14 },
    Cleric: { str: 14, dex: 10, con: 14, int: 12, wis: 16, cha: 12 },
  };

  const raceBonuses = {
    Human: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    Elf: { str: 0, dex: 2, con: 0, int: 1, wis: 0, cha: 0 },
    Dwarf: { str: 2, dex: 0, con: 2, int: 0, wis: 0, cha: 0 },
    Halfling: { str: 0, dex: 2, con: 1, int: 0, wis: 0, cha: 0 },
  };

  const base = baseStats[charClass];
  const bonus = raceBonuses[race];

  return {
    str: base.str + bonus.str,
    dex: base.dex + bonus.dex,
    con: base.con + bonus.con,
    int: base.int + bonus.int,
    wis: base.wis + bonus.wis,
    cha: base.cha + bonus.cha,
  };
};

export function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export function getModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

export function rollDamage(diceNotation) {
  const [count, sides] = diceNotation.split("d").map(Number);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += rollDice(sides);
  }
  return total;
}

export function checkLevelUp(experience, currentLevel) {
  const nextLevel = currentLevel + 1;
  if (XP_REQUIREMENTS[nextLevel] && experience >= XP_REQUIREMENTS[nextLevel]) {
    return nextLevel;
  }
  return currentLevel;
}
