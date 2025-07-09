export const SPELLS = {
  Wizard: [
    {
      name: "Magic Missile",
      level: 1,
      damage: "1d4+1",
      type: "evocation",
      slots: 2,
    },
    { name: "Fireball", level: 3, damage: "8d6", type: "evocation", slots: 1 },
    { name: "Invisibility", level: 2, type: "illusion", slots: 1 },
    { name: "Shield", level: 1, type: "abjuration", slots: 2 },
  ],
  Cleric: [
    {
      name: "Cure Wounds",
      level: 1,
      healing: "1d8",
      type: "evocation",
      slots: 2,
    },
    {
      name: "Sacred Flame",
      level: 0,
      damage: "1d8",
      type: "evocation",
      slots: 3,
    },
    { name: "Bless", level: 1, type: "enchantment", slots: 1 },
    {
      name: "Spiritual Weapon",
      level: 2,
      damage: "1d8",
      type: "conjuration",
      slots: 1,
    },
  ],
};
