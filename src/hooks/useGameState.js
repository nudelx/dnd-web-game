import { useState, useEffect } from "react";
import { getCharacterStats } from "../functions/utils";
import { SPELLS } from "../const/spels";

export const useGameState = () => {
  const [step, setStep] = useState("create");
  const [name, setName] = useState("");
  const [charClass, setCharClass] = useState("Fighter");
  const [race, setRace] = useState("Human");
  const [character, setCharacter] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [equipped, setEquipped] = useState({ weapon: null, armor: null });
  const [spellSlots, setSpellSlots] = useState({});
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [adventureText, setAdventureText] = useState(
    "You stand at the entrance to a dark, mysterious dungeon. What will you do?"
  );
  const [adventureChoices, setAdventureChoices] = useState([]);
  const [showSpells, setShowSpells] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState("");
  const [combatLog, setCombatLog] = useState([]);

  // Load saved game on component mount
  useEffect(() => {
    const savedGame = localStorage.getItem("dnd-save");
    if (savedGame) {
      try {
        const gameData = JSON.parse(savedGame);
        if (gameData.character) {
          setCharacter(gameData.character);
          setInventory(gameData.inventory || []);
          setEquipped(gameData.equipped || { weapon: null, armor: null });
          setSpellSlots(gameData.spellSlots || {});
          setStep("adventure");
          setAdventureText(
            "Welcome back, adventurer! Your journey continues..."
          );
          setAdventureChoices([
            "Enter the dungeon",
            "Check your equipment",
            "Rest and recover",
            "View spells",
          ]);
        }
      } catch (error) {
        console.error("Failed to load saved game:", error);
      }
    }
  }, []);

  // Save game whenever important state changes
  useEffect(() => {
    if (character) {
      const gameData = {
        character,
        inventory,
        equipped,
        spellSlots,
      };
      localStorage.setItem("dnd-save", JSON.stringify(gameData));
    }
  }, [character, inventory, equipped, spellSlots]);

  const startAdventure = () => {
    const stats = getCharacterStats(charClass, race);
    const spells = SPELLS[charClass] || [];
    const initialSpellSlots = {};
    spells.forEach((spell) => {
      initialSpellSlots[spell.name] = spell.slots;
    });

    const newCharacter = {
      name,
      class: charClass,
      race,
      stats,
      hp: 10 + getModifier(stats.con),
      maxHp: 10 + getModifier(stats.con),
      level: 1,
      experience: 0,
      spells,
    };

    setCharacter(newCharacter);
    setSpellSlots(initialSpellSlots);
    setStep("adventure");
    setAdventureText(
      `Welcome, ${name} the ${race} ${charClass}!\n\n${adventureText}`
    );
    setAdventureChoices([
      "Enter the dungeon",
      "Check your equipment",
      "Rest and recover",
      "View spells",
    ]);
  };

  const clearSave = () => {
    localStorage.removeItem("dnd-save");
    setStep("create");
    setCharacter(null);
    setInventory([]);
    setEquipped({ weapon: null, armor: null });
    setSpellSlots({});
    setCurrentEnemy(null);
    setCombatLog([]);
    setLevelUpMessage("");
  };

  return {
    step,
    setStep,
    name,
    setName,
    charClass,
    setCharClass,
    race,
    setRace,
    character,
    setCharacter,
    inventory,
    setInventory,
    equipped,
    setEquipped,
    spellSlots,
    setSpellSlots,
    currentEnemy,
    setCurrentEnemy,
    adventureText,
    setAdventureText,
    adventureChoices,
    setAdventureChoices,
    showSpells,
    setShowSpells,
    showInventory,
    setShowInventory,
    levelUpMessage,
    setLevelUpMessage,
    combatLog,
    setCombatLog,
    startAdventure,
    clearSave,
  };
};

// Helper function for modifier calculation
const getModifier = (stat) => {
  return Math.floor((stat - 10) / 2);
};
