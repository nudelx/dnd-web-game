export const EQUIPMENT = {
  weapons: [
    { name: "Longsword", damage: "1d8", type: "weapon", hands: 1 },
    {
      name: "Shortbow",
      damage: "1d6",
      type: "weapon",
      hands: 2,
      range: "ranged",
    },
    { name: "Dagger", damage: "1d4", type: "weapon", hands: 1 },
    { name: "Staff", damage: "1d6", type: "weapon", hands: 2 },
    { name: "Warhammer", damage: "1d8", type: "weapon", hands: 1 },
  ],
  armor: [
    { name: "Leather Armor", ac: 11, type: "armor" },
    { name: "Chain Mail", ac: 16, type: "armor" },
    { name: "Plate Armor", ac: 18, type: "armor" },
  ],
};
