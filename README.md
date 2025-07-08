# 🐉 Dungeons & Dragons: Web Adventure

<img src="https://raw.githubusercontent.com/nudelx/dnd-web-game/refs/heads/main/src/assets/demo.png">

A browser-based D&D game featuring character creation, combat, spellcasting, and dungeon exploration!

## 🎮 How to Play

### Getting Started

1. **Create Your Character**

   - Choose a name for your hero
   - Select a class: Fighter, Wizard, Rogue, or Cleric
   - Pick a race: Human, Elf, Dwarf, or Halfling
   - Click "Begin Adventure" to start your journey

2. **Character Sheet**
   - View your character's stats (STR, DEX, CON, INT, WIS, CHA)
   - Check your current HP, level, and experience points
   - See your equipped weapon and armor
   - Monitor your spell slots (if you're a spellcaster)

## ⚔️ Combat Rules

### Attack Mechanics

- **Attack Roll**: Roll a d20 + your Strength modifier + your level + weapon bonus
- **Hit**: If your total attack roll equals or exceeds the enemy's Armor Class (AC)
- **Miss**: If your attack roll is less than the enemy's AC
- **Critical Hit**: Rolling a natural 20 deals double damage!

### Damage Calculation

- **Base Damage**: 1d6 + Strength modifier
- **Weapon Damage**: If equipped, use the weapon's damage dice + Strength modifier
- **Critical Hits**: Double the damage rolled

### Combat Actions

- **Attack**: Make a melee attack against the enemy
- **Cast Spell**: Use magic (Wizards and Clerics only)
- **Try to Flee**: Attempt to escape (d20 roll, success on 11+)

## 🧙‍♂️ Spellcasting

### Available Spells

#### Wizard Spells

- **Magic Missile** (Level 1): 1d4+1 damage, 2 slots
- **Fireball** (Level 3): 8d6 damage, 1 slot
- **Invisibility** (Level 2): Illusion spell, 1 slot
- **Shield** (Level 1): Abjuration spell, 2 slots

#### Cleric Spells

- **Cure Wounds** (Level 1): Heal 1d8 HP, 2 slots
- **Sacred Flame** (Level 0): 1d8 damage, 3 slots
- **Bless** (Level 1): Enchantment spell, 1 slot
- **Spiritual Weapon** (Level 2): 1d8 damage, 1 slot

### Spell Rules

- Each spell has a limited number of slots per adventure
- Healing spells restore HP up to your maximum
- Damage spells deal damage to enemies
- Some spells have special effects

## 🎲 Dice Rolling

The game includes a complete dice set:

- **d4**: 4-sided die
- **d6**: 6-sided die
- **d8**: 8-sided die
- **d10**: 10-sided die
- **d12**: 12-sided die
- **d20**: 20-sided die (most important for attacks and skill checks)

## 📊 Character Stats

### Ability Scores

- **Strength (STR)**: Affects melee attacks and damage
- **Dexterity (DEX)**: Affects ranged attacks and armor class
- **Constitution (CON)**: Affects hit points and health
- **Intelligence (INT)**: Affects spellcasting (Wizards)
- **Wisdom (WIS)**: Affects spellcasting (Clerics)
- **Charisma (CHA)**: Affects social interactions

### Modifiers

- Modifiers are calculated as: (Stat - 10) ÷ 2, rounded down
- Example: STR 16 = +3 modifier, STR 8 = -1 modifier

## 🏆 Experience & Leveling

### Experience Points

- **Goblin/Skeleton**: 1 XP
- **Orc**: 2 XP
- **Troll**: 5 XP
- **Dragon**: 10 XP

### Level Requirements

- **Level 1**: 0 XP
- **Level 2**: 300 XP
- **Level 3**: 900 XP
- **Level 4**: 2,700 XP
- **Level 5**: 6,500 XP

### Level Up Benefits

- **HP Increase**: Roll 1d8 + Constitution modifier
- **Full Heal**: Restore all HP when leveling up
- **Attack Bonus**: +1 to attack rolls per level

## 🛡️ Equipment System

### Weapons

- **Longsword**: 1d8 damage, martial weapon
- **Shortbow**: 1d6 damage, ranged weapon
- **Dagger**: 1d4 damage, simple weapon
- **Staff**: 1d6 damage, simple weapon
- **Warhammer**: 1d8 damage, martial weapon

### Armor

- **Leather Armor**: AC 11, light armor
- **Chain Mail**: AC 16, medium armor
- **Plate Armor**: AC 18, heavy armor

### Equipment Rules

- Weapons provide +1 attack bonus when equipped
- Armor increases your Armor Class (AC)
- You can only equip one weapon and one armor at a time

## 🏰 Adventure Features

### Dungeon Exploration

- **Random Encounters**: 25% chance to encounter enemies
- **Treasure Hunting**: Search for valuable items
- **Rest Areas**: Recover HP between adventures
- **Multiple Scenarios**: Different dungeon areas to explore

### Enemy Types

- **Goblin**: 7 HP, AC 15, 1d6 damage
- **Skeleton**: 13 HP, AC 13, 1d6 damage
- **Orc**: 15 HP, AC 14, 1d8 damage
- **Troll**: 84 HP, AC 15, 1d10 damage
- **Dragon**: 200 HP, AC 19, 2d10 damage

## 💾 Save System

- **Automatic Saving**: Your progress is automatically saved
- **Browser Storage**: Game data persists between sessions
- **New Game**: Click "New Game" to start fresh

## 🎨 Game Features

### Visual Elements

- **Dark Fantasy Theme**: Immersive medieval atmosphere
- **Animated Effects**: Glowing dice, pulsing enemies, level-up animations
- **Responsive Design**: Works on desktop and mobile devices
- **Combat Log**: Detailed battle information and history

### User Interface

- **Character Sheet**: Complete character information
- **Inventory Management**: Equip and manage items
- **Spell Interface**: Cast spells with slot tracking
- **Dice Roller**: Roll any dice with visual feedback

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dnd-web-game

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 🎯 Game Tips

1. **Choose Your Class Wisely**

   - **Fighter**: Best for melee combat, high HP
   - **Wizard**: Powerful spells, but low HP
   - **Rogue**: High Dexterity, good for ranged combat
   - **Cleric**: Healing spells, balanced combat abilities

2. **Manage Your Resources**

   - Keep track of your HP and spell slots
   - Rest when your HP is low
   - Use healing spells strategically

3. **Equipment Strategy**

   - Equip the best weapon you find
   - Upgrade your armor when possible
   - Different weapons have different damage dice

4. **Combat Tactics**
   - Attack when you have good odds
   - Flee from powerful enemies
   - Use spells for maximum effect

## 🐛 Known Issues

- Game saves automatically to browser storage
- Some browsers may have storage limits
- Mobile devices may have different performance

## 🤝 Contributing

Feel free to contribute to this project by:

- Adding new spells and abilities
- Creating new enemy types
- Improving the user interface
- Adding new adventure scenarios

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Adventuring!** 🐉⚔️✨
