import { useState, useEffect, useRef } from "react";
import "./App.css";
import { CLASSES, RACES } from "./const/classes";
import { SPELLS } from "./const/spels";
import { EQUIPMENT } from "./const/equipment";
import {
  getCharacterStats,
  rollDice,
  getModifier,
  rollDamage,
  checkLevelUp,
} from "./functions/utils";

function App() {
  const [step, setStep] = useState("create");
  const [name, setName] = useState("");
  const [charClass, setCharClass] = useState(CLASSES[0]);
  const [race, setRace] = useState(RACES[0]);
  const [diceResult, setDiceResult] = useState(null);
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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMusic, setCurrentMusic] = useState("ambient");
  const audioRef = useRef(null);

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

    // Start ambient music when adventure begins
    playMusic("ambient");
  };

  const addExperience = (amount) => {
    setCharacter((prev) => {
      const newExp = prev.experience + amount;
      const newLevel = checkLevelUp(newExp, prev.level);

      if (newLevel > prev.level) {
        // Level up!
        const hpIncrease = rollDice(8) + getModifier(prev.stats.con);
        const newMaxHp = prev.maxHp + hpIncrease;
        const newHp = newMaxHp; // Full heal on level up

        setLevelUpMessage(
          `🎉 LEVEL UP! You are now level ${newLevel}!\n` +
            `+${hpIncrease} HP (${prev.maxHp} → ${newMaxHp})\n` +
            `You feel stronger and more experienced!`
        );

        return {
          ...prev,
          experience: newExp,
          level: newLevel,
          maxHp: newMaxHp,
          hp: newHp,
        };
      }

      return {
        ...prev,
        experience: newExp,
      };
    });
  };

  const addCombatLog = (message) => {
    setCombatLog((prev) => [...prev.slice(-4), message]); // Keep last 5 messages
  };

  const castSpell = (spell) => {
    if (spellSlots[spell.name] > 0) {
      setSpellSlots((prev) => ({
        ...prev,
        [spell.name]: prev[spell.name] - 1,
      }));

      if (spell.damage && currentEnemy) {
        const damage = rollDamage(spell.damage);
        const newEnemyHp = Math.max(0, currentEnemy.hp - damage);

        setCurrentEnemy((prev) => ({
          ...prev,
          hp: newEnemyHp,
        }));

        addCombatLog(`You cast ${spell.name} for ${damage} damage!`);

        if (newEnemyHp <= 0) {
          const xpGain = currentEnemy.level || 10;
          addExperience(xpGain);
          setAdventureText(
            `You cast ${spell.name} and deal ${damage} damage, defeating the ${currentEnemy.name}!\n\nYou gain ${xpGain} experience points.`
          );
          setCurrentEnemy(null);
          setAdventureChoices([
            "Continue exploring",
            "Search the body",
            "Return to entrance",
          ]);
        } else {
          setAdventureText(
            `You cast ${spell.name} and deal ${damage} damage!\n\n${currentEnemy.name} HP: ${newEnemyHp}/${currentEnemy.maxHp}`
          );
          setAdventureChoices([
            "Attack again",
            "Cast another spell",
            "Try to flee",
          ]);
        }
      } else if (spell.healing) {
        const healing = rollDamage(spell.healing);
        const newHp = Math.min(character.maxHp, character.hp + healing);
        setCharacter((prev) => ({
          ...prev,
          hp: newHp,
        }));
        addCombatLog(`You cast ${spell.name} and heal ${healing} HP!`);
        setAdventureText(
          `You cast ${spell.name} and heal ${healing} hit points!\n\nCurrent HP: ${newHp}/${character.maxHp}`
        );
        setAdventureChoices(["Continue adventure", "Enter the dungeon"]);
      } else {
        setAdventureText(`You cast ${spell.name}!`);
        setAdventureChoices(["Continue adventure", "Enter the dungeon"]);
      }
    } else {
      setAdventureText(`You don't have enough spell slots for ${spell.name}.`);
    }
    setShowSpells(false);
  };

  const consumeItem = (item, index) => {
    if (item.type === "consumable" && item.effect === "heal") {
      const healing = rollDice(8);
      const newHp = Math.min(character.maxHp, character.hp + healing);
      setCharacter((prev) => ({
        ...prev,
        hp: newHp,
      }));

      // Remove the used item from inventory
      setInventory((prev) => prev.filter((_, i) => i !== index));

      setAdventureText(
        `You use ${item.name} and heal ${healing} hit points!\n\nCurrent HP: ${newHp}/${character.maxHp}`
      );
      setAdventureChoices(["Continue adventure", "Enter the dungeon"]);
    } else {
      setAdventureText(`You can't use ${item.name} right now.`);
    }
  };

  const equipItem = (item) => {
    if (item.type === "weapon") {
      setEquipped((prev) => ({ ...prev, weapon: item }));
      setAdventureText(`You equip ${item.name} (${item.damage} damage dice).`);
    } else if (item.type === "armor") {
      setEquipped((prev) => ({ ...prev, armor: item }));
      setAdventureText(`You equip ${item.name} (AC: ${item.ac}).`);
    } else {
      setAdventureText(`${item.name} cannot be equipped.`);
    }
  };

  const handleAdventureChoice = (choice) => {
    switch (choice) {
      case "Enter the dungeon": {
        const encounterRoll = rollDice(20);
        if (encounterRoll > 15) {
          const enemies = [
            {
              name: "Goblin",
              hp: 7,
              maxHp: 7,
              ac: 15,
              damage: "1d6",
              level: 1,
            },
            {
              name: "Skeleton",
              hp: 13,
              maxHp: 13,
              ac: 13,
              damage: "1d6",
              level: 1,
            },
            { name: "Orc", hp: 15, maxHp: 15, ac: 14, damage: "1d8", level: 2 },
            {
              name: "Troll",
              hp: 84,
              maxHp: 84,
              ac: 15,
              damage: "1d10",
              level: 5,
            },
            {
              name: "Dragon",
              hp: 200,
              maxHp: 200,
              ac: 19,
              damage: "2d10",
              level: 10,
            },
          ];
          const enemy = enemies[Math.floor(Math.random() * enemies.length)];
          setCurrentEnemy(enemy);
          setAdventureText(
            `You enter the dungeon and encounter a ${enemy.name}!\n\nWhat will you do?`
          );
          const choices = ["Attack", "Try to flee"];
          if (character.spells && character.spells.length > 0) {
            choices.push("Cast spell");
          }
          setAdventureChoices(choices);

          // Switch to combat music
          playMusic("combat");
        } else {
          const scenarios = [
            "You enter the dungeon and find yourself in a quiet corridor. The air is thick with dust and mystery.",
            "You discover an ancient library filled with dusty tomes and forgotten knowledge.",
            "You find a treasure room with glittering gold and precious gems scattered about.",
            "You encounter a peaceful shrine where you can rest and recover your strength.",
            "You discover a training room with practice dummies and weapon racks.",
            "You find a mysterious portal that hums with arcane energy.",
            "You discover a hidden chamber with ancient runes carved into the walls.",
          ];
          const scenario =
            scenarios[Math.floor(Math.random() * scenarios.length)];
          setAdventureText(`${scenario}\n\nWhat will you do?`);
          setAdventureChoices([
            "Explore further",
            "Search for treasure",
            "Rest and recover",
            "Return to entrance",
          ]);
        }
        break;
      }

      case "Check your equipment":
        setShowInventory(true);
        setAdventureText(
          "Your equipment:\n" +
            `Weapon: ${equipped.weapon ? equipped.weapon.name : "None"}\n` +
            `Armor: ${equipped.armor ? equipped.armor.name : "None"}\n\n` +
            "Inventory items:"
        );
        break;

      case "View spells":
        setShowSpells(true);
        setAdventureText("Available spells:");
        break;

      case "Cast spell":
        setShowSpells(true);
        setAdventureText("Choose a spell to cast:");
        break;

      case "Rest and recover": {
        if (character.hp < character.maxHp) {
          const healAmount = Math.min(5, character.maxHp - character.hp);
          setCharacter((prev) => ({
            ...prev,
            hp: prev.hp + healAmount,
          }));
          setAdventureText(
            `You rest and recover ${healAmount} hit points.\n\nCurrent HP: ${
              character.hp + healAmount
            }/${character.maxHp}`
          );
        } else {
          setAdventureText("You are already at full health.");
        }
        setAdventureChoices(["Continue adventure", "Enter the dungeon"]);
        break;
      }

      case "Attack": {
        if (currentEnemy) {
          const attackRoll = rollDice(20);
          const attackBonus =
            getModifier(character.stats.str) + character.level;
          const weaponBonus = equipped.weapon ? 1 : 0;
          const totalAttack = attackRoll + attackBonus + weaponBonus;

          // Check for critical hit (natural 20)
          const isCritical = attackRoll === 20;

          if (totalAttack >= currentEnemy.ac) {
            let damage = rollDice(6) + getModifier(character.stats.str);
            if (equipped.weapon) {
              damage =
                rollDamage(equipped.weapon.damage) +
                getModifier(character.stats.str);
            }

            if (isCritical) {
              damage *= 2;
              addCombatLog(`CRITICAL HIT! You deal ${damage} damage!`);
            } else {
              addCombatLog(`You hit for ${damage} damage!`);
            }

            const newEnemyHp = Math.max(0, currentEnemy.hp - damage);

            setCurrentEnemy((prev) => ({
              ...prev,
              hp: newEnemyHp,
            }));

            if (newEnemyHp <= 0) {
              const xpGain = currentEnemy.level || 10;
              addExperience(xpGain);
              setAdventureText(
                `You strike the ${currentEnemy.name} for ${damage} damage and defeat it!\n\nYou gain ${xpGain} experience points.`
              );
              setCurrentEnemy(null);
              setAdventureChoices([
                "Continue exploring",
                "Search the body",
                "Return to entrance",
              ]);

              // Play victory music briefly, then return to ambient
              playMusic("victory");
              setTimeout(() => playMusic("ambient"), 3000);
            } else {
              // Enemy attacks back
              const enemyAttackRoll = rollDice(20);
              const enemyAttackBonus = Math.floor(currentEnemy.level / 2) || 1;
              const totalEnemyAttack = enemyAttackRoll + enemyAttackBonus;

              // Calculate player's AC (base 10 + armor bonus)
              const playerAC =
                10 + (equipped.armor ? equipped.armor.ac - 10 : 0);

              if (totalEnemyAttack >= playerAC) {
                const enemyDamage = rollDamage(currentEnemy.damage);
                setCharacter((prev) => ({
                  ...prev,
                  hp: Math.max(0, prev.hp - enemyDamage),
                }));
                addCombatLog(
                  `${currentEnemy.name} hits you for ${enemyDamage} damage!`
                );
                setAdventureText(
                  `You hit the ${currentEnemy.name} for ${damage} damage!\n${
                    currentEnemy.name
                  } hits you for ${enemyDamage} damage!\n\n${
                    currentEnemy.name
                  } HP: ${newEnemyHp}/${
                    currentEnemy.maxHp
                  }\nYour HP: ${Math.max(0, character.hp - enemyDamage)}/${
                    character.maxHp
                  }`
                );
              } else {
                addCombatLog(`${currentEnemy.name} misses you!`);
                setAdventureText(
                  `You hit the ${currentEnemy.name} for ${damage} damage!\n${currentEnemy.name} misses you!\n\n${currentEnemy.name} HP: ${newEnemyHp}/${currentEnemy.maxHp}\nYour HP: ${character.hp}/${character.maxHp}`
                );
              }

              // Check if player died after enemy attack
              if (totalEnemyAttack >= playerAC) {
                const enemyDamage = rollDamage(currentEnemy.damage);
                if (character.hp - enemyDamage <= 0) {
                  setAdventureText(
                    `You have been defeated by the ${currentEnemy.name}!\n\nGame Over. Your adventure ends here.`
                  );
                  setCurrentEnemy(null);
                  setAdventureChoices(["Start New Game"]);
                } else {
                  const choices = ["Attack again"];
                  if (character.spells && character.spells.length > 0) {
                    choices.push("Cast spell");
                  }
                  choices.push("Try to flee");
                  setAdventureChoices(choices);
                }
              } else {
                const choices = ["Attack again"];
                if (character.spells && character.spells.length > 0) {
                  choices.push("Cast spell");
                }
                choices.push("Try to flee");
                setAdventureChoices(choices);
              }
            }
          } else {
            addCombatLog(`You miss! (${totalAttack} vs AC ${currentEnemy.ac})`);

            // Enemy attacks back even if you miss
            const enemyAttackRoll = rollDice(20);
            const enemyAttackBonus = Math.floor(currentEnemy.level / 2) || 1;
            const totalEnemyAttack = enemyAttackRoll + enemyAttackBonus;

            // Calculate player's AC (base 10 + armor bonus)
            const playerAC = 10 + (equipped.armor ? equipped.armor.ac - 10 : 0);

            if (totalEnemyAttack >= playerAC) {
              const enemyDamage = rollDamage(currentEnemy.damage);
              setCharacter((prev) => ({
                ...prev,
                hp: Math.max(0, prev.hp - enemyDamage),
              }));
              addCombatLog(
                `${currentEnemy.name} hits you for ${enemyDamage} damage!`
              );
              setAdventureText(
                `Your attack misses the ${currentEnemy.name}!\n${
                  currentEnemy.name
                } hits you for ${enemyDamage} damage!\n\n${
                  currentEnemy.name
                } HP: ${currentEnemy.hp}/${
                  currentEnemy.maxHp
                }\nYour HP: ${Math.max(0, character.hp - enemyDamage)}/${
                  character.maxHp
                }`
              );
            } else {
              addCombatLog(`${currentEnemy.name} misses you!`);
              setAdventureText(
                `Your attack misses the ${currentEnemy.name}!\n${currentEnemy.name} misses you!\n\n${currentEnemy.name} HP: ${currentEnemy.hp}/${currentEnemy.maxHp}\nYour HP: ${character.hp}/${character.maxHp}`
              );
            }

            // Check if player died after enemy attack (miss case)
            if (totalEnemyAttack >= playerAC) {
              const enemyDamage = rollDamage(currentEnemy.damage);
              if (character.hp - enemyDamage <= 0) {
                setAdventureText(
                  `You have been defeated by the ${currentEnemy.name}!\n\nGame Over. Your adventure ends here.`
                );
                setCurrentEnemy(null);
                setAdventureChoices(["Start New Game"]);
              } else {
                const choices = ["Attack again"];
                if (character.spells && character.spells.length > 0) {
                  choices.push("Cast spell");
                }
                choices.push("Try to flee");
                setAdventureChoices(choices);
              }
            } else {
              const choices = ["Attack again"];
              if (character.spells && character.spells.length > 0) {
                choices.push("Cast spell");
              }
              choices.push("Try to flee");
              setAdventureChoices(choices);
            }
          }
        }
        break;
      }

      case "Try to flee": {
        const fleeRoll = rollDice(20);
        if (fleeRoll > 10) {
          setAdventureText("You successfully flee from the enemy!");
          setCurrentEnemy(null);
          setAdventureChoices(["Continue exploring", "Return to entrance"]);

          // Return to ambient music when fleeing successfully
          playMusic("ambient");
        } else {
          setAdventureText("You fail to escape! The enemy gets a free attack!");
          const enemyDamage = rollDice(6);
          setCharacter((prev) => ({
            ...prev,
            hp: Math.max(0, prev.hp - enemyDamage),
          }));
          addCombatLog(`Enemy hits you for ${enemyDamage} damage!`);
          setAdventureChoices(["Attack", "Try to flee again"]);
        }
        break;
      }

      case "Search for treasure": {
        const treasureRoll = rollDice(20);
        if (treasureRoll > 15) {
          const treasures = [
            ...EQUIPMENT.weapons,
            ...EQUIPMENT.armor,
            { name: "Gold coins", type: "currency", value: 10 },
            { name: "Healing potion", type: "consumable", effect: "heal" },
            { name: "Magic ring", type: "magic", effect: "protection" },
            { name: "Scroll of Fireball", type: "scroll", spell: "Fireball" },
          ];
          const treasure =
            treasures[Math.floor(Math.random() * treasures.length)];
          setInventory((prev) => [...prev, treasure]);
          setAdventureText(`You find ${treasure.name}!`);
        } else {
          setAdventureText("You search but find nothing of value.");
        }
        setAdventureChoices(["Continue exploring", "Return to entrance"]);
        break;
      }

      case "Search the body": {
        const lootRoll = rollDice(20);
        if (lootRoll > 10) {
          const possibleLoot = [
            ...EQUIPMENT.weapons,
            ...EQUIPMENT.armor,
            { name: "Gold coins", type: "currency", value: 5 },
            { name: "Healing potion", type: "consumable", effect: "heal" },
            { name: "Magic ring", type: "magic", effect: "protection" },
          ];
          const loot =
            possibleLoot[Math.floor(Math.random() * possibleLoot.length)];
          setInventory((prev) => [...prev, loot]);
          setAdventureText(`You search the body and find ${loot.name}!`);
        } else {
          setAdventureText("You search the body but find nothing of value.");
        }
        setAdventureChoices(["Continue exploring", "Return to entrance"]);
        break;
      }

      case "Start New Game":
        clearSave();
        break;

      case "Continue exploring": {
        const encounterRoll = rollDice(20);
        if (encounterRoll > 15) {
          const enemies = [
            {
              name: "Goblin",
              hp: 7,
              maxHp: 7,
              ac: 15,
              damage: "1d6",
              level: 1,
            },
            {
              name: "Skeleton",
              hp: 13,
              maxHp: 13,
              ac: 13,
              damage: "1d6",
              level: 1,
            },
            { name: "Orc", hp: 15, maxHp: 15, ac: 14, damage: "1d8", level: 2 },
            {
              name: "Troll",
              hp: 84,
              maxHp: 84,
              ac: 15,
              damage: "1d10",
              level: 5,
            },
            {
              name: "Dragon",
              hp: 200,
              maxHp: 200,
              ac: 19,
              damage: "2d10",
              level: 10,
            },
          ];
          const enemy = enemies[Math.floor(Math.random() * enemies.length)];
          setCurrentEnemy(enemy);
          setAdventureText(
            `You continue exploring and encounter a ${enemy.name}!\n\nWhat will you do?`
          );
          const choices = ["Attack", "Try to flee"];
          if (character.spells && character.spells.length > 0) {
            choices.push("Cast spell");
          }
          setAdventureChoices(choices);
        } else {
          const scenarios = [
            "You continue exploring and find yourself in a quiet corridor. The air is thick with dust and mystery.",
            "You discover an ancient library filled with dusty tomes and forgotten knowledge.",
            "You find a treasure room with glittering gold and precious gems scattered about.",
            "You encounter a peaceful shrine where you can rest and recover your strength.",
            "You discover a training room with practice dummies and weapon racks.",
            "You find a mysterious portal that hums with arcane energy.",
            "You discover a hidden chamber with ancient runes carved into the walls.",
          ];
          const scenario =
            scenarios[Math.floor(Math.random() * scenarios.length)];
          setAdventureText(`${scenario}\n\nWhat will you do?`);
          setAdventureChoices([
            "Explore further",
            "Search for treasure",
            "Rest and recover",
            "Return to entrance",
          ]);
        }
        break;
      }

      default:
        setAdventureText("You continue your adventure...");
        setAdventureChoices([
          "Enter the dungeon",
          "Check your equipment",
          "Rest and recover",
          "View spells",
        ]);
    }
  };

  const rollDiceWithModifier = (sides, modifier = 0) => {
    const result = rollDice(sides) + modifier;
    setDiceResult(result);
    return result;
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

  // Music functions
  const playMusic = (type = "ambient") => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const musicUrls = {
      ambient: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with actual ambient music
      combat: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with combat music
      victory: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with victory music
    };

    const audio = new Audio(musicUrls[type]);
    audio.loop = type === "ambient";
    audio.volume = 0.3;
    audioRef.current = audio;
    audio.play();
    setIsMusicPlaying(true);
    setCurrentMusic(type);
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsMusicPlaying(false);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      playMusic(currentMusic);
    }
  };

  return (
    <div className="dnd-container">
      <h1 className="dnd-title">Dungeons & Dragons: Web Adventure</h1>

      {step === "create" && (
        <div className="character-creation">
          <h2>Create Your Character</h2>
          <label>
            Name:
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your hero's name"
            />
          </label>
          <label>
            Class:
            <select
              value={charClass}
              onChange={(e) => setCharClass(e.target.value)}
            >
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Race:
            <select value={race} onChange={(e) => setRace(e.target.value)}>
              {RACES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <button disabled={!name} onClick={startAdventure}>
            Begin Adventure
          </button>
        </div>
      )}

      {step === "adventure" && character && (
        <div className="adventure-section">
          <div className="character-sheet">
            <h3>Character Sheet</h3>
            <div className="character-info">
              <strong>{character.name}</strong> the {character.race}{" "}
              {character.class}
            </div>
            <div className="character-info">
              Level {character.level} • XP: {character.experience}
            </div>
            <div className="character-info">
              <div>
                HP: {character.hp}/{character.maxHp}
              </div>
              <div className="health-bar">
                <div
                  className="health-fill player-health"
                  style={{
                    width: `${(character.hp / character.maxHp) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {levelUpMessage && (
              <div className="level-up-message">{levelUpMessage}</div>
            )}

            <div className="character-stats">
              <div className="stat">
                <div>STR</div>
                <div className="stat-value">{character.stats.str}</div>
                <div>
                  ({getModifier(character.stats.str) >= 0 ? "+" : ""}
                  {getModifier(character.stats.str)})
                </div>
              </div>
              <div className="stat">
                <div>DEX</div>
                <div className="stat-value">{character.stats.dex}</div>
                <div>
                  ({getModifier(character.stats.dex) >= 0 ? "+" : ""}
                  {getModifier(character.stats.dex)})
                </div>
              </div>
              <div className="stat">
                <div>CON</div>
                <div className="stat-value">{character.stats.con}</div>
                <div>
                  ({getModifier(character.stats.con) >= 0 ? "+" : ""}
                  {getModifier(character.stats.con)})
                </div>
              </div>
              <div className="stat">
                <div>INT</div>
                <div className="stat-value">{character.stats.int}</div>
                <div>
                  ({getModifier(character.stats.int) >= 0 ? "+" : ""}
                  {getModifier(character.stats.int)})
                </div>
              </div>
              <div className="stat">
                <div>WIS</div>
                <div className="stat-value">{character.stats.wis}</div>
                <div>
                  ({getModifier(character.stats.wis) >= 0 ? "+" : ""}
                  {getModifier(character.stats.wis)})
                </div>
              </div>
              <div className="stat">
                <div>CHA</div>
                <div className="stat-value">{character.stats.cha}</div>
                <div>
                  ({getModifier(character.stats.cha) >= 0 ? "+" : ""}
                  {getModifier(character.stats.cha)})
                </div>
              </div>
            </div>

            {equipped.weapon && (
              <div className="character-info">
                Weapon: {equipped.weapon.name} ({equipped.weapon.damage})
              </div>
            )}
            {equipped.armor && (
              <div className="character-info">
                Armor: {equipped.armor.name} (AC: {equipped.armor.ac})
              </div>
            )}

            <button
              className="clear-save-btn"
              onClick={clearSave}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                background: "linear-gradient(145deg, #8b0000, #a0522d)",
                color: "#f4e4c1",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              New Game
            </button>
          </div>

          <div className="adventure-content">
            <div className="adventure-text">
              <pre>{adventureText}</pre>
            </div>

            {combatLog.length > 0 && (
              <div className="combat-log">
                <h4>Combat Log:</h4>
                {combatLog.map((log, index) => (
                  <div key={index} className="log-entry">
                    {log}
                  </div>
                ))}
              </div>
            )}

            {currentEnemy && (
              <div className="combat-section">
                <h3>Combat</h3>
                <div className="enemy">
                  <h4>{currentEnemy.name}</h4>
                  <div>AC: {currentEnemy.ac}</div>
                  <div className="health-bar">
                    <div
                      className="health-fill"
                      style={{
                        width: `${
                          (currentEnemy.hp / currentEnemy.maxHp) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div>
                    HP: {currentEnemy.hp}/{currentEnemy.maxHp}
                  </div>
                </div>
              </div>
            )}

            {showSpells && character.spells && (
              <div className="spells-section">
                <h3>Spells</h3>
                {character.spells.map((spell, index) => (
                  <div key={index} className="spell-item">
                    <button
                      className="spell-btn"
                      onClick={() => castSpell(spell)}
                      disabled={spellSlots[spell.name] <= 0}
                    >
                      {spell.name} (Level {spell.level}) - Slots:{" "}
                      {spellSlots[spell.name] || 0}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showInventory && (
              <div className="inventory-section">
                <h3>Inventory</h3>
                {inventory.map((item, index) => (
                  <div key={index} className="inventory-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      {item.type === "weapon" && (
                        <span className="item-details">
                          Damage: {item.damage}
                        </span>
                      )}
                      {item.type === "armor" && (
                        <span className="item-details">AC: {item.ac}</span>
                      )}
                      {item.type === "consumable" && (
                        <span className="item-details">Consumable</span>
                      )}
                    </div>
                    <div className="item-actions">
                      {(item.type === "weapon" || item.type === "armor") && (
                        <button
                          className="equip-btn"
                          onClick={() => equipItem(item)}
                        >
                          Equip
                        </button>
                      )}
                      {item.type === "consumable" && (
                        <button
                          className="use-btn"
                          onClick={() => consumeItem(item, index)}
                        >
                          Use
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  className="close-inventory-btn"
                  onClick={() => setShowInventory(false)}
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    background: "linear-gradient(145deg, #8b4513, #a0522d)",
                    color: "#f4e4c1",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    width: "100%",
                  }}
                >
                  Close Inventory
                </button>
              </div>
            )}

            <div className="adventure-choices">
              {adventureChoices.map((choice, index) => (
                <button
                  key={index}
                  className="choice-btn"
                  onClick={() => handleAdventureChoice(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>

            <div className="dice-roller">
              <h3>Dice Roller</h3>
              <div className="dice-buttons">
                <button
                  className="dice-btn"
                  onClick={() => rollDiceWithModifier(20)}
                >
                  d20
                </button>
                <button
                  className="dice-btn"
                  onClick={() => rollDiceWithModifier(12)}
                >
                  d12
                </button>
                <button
                  className="dice-btn"
                  onClick={() => rollDiceWithModifier(10)}
                >
                  d10
                </button>
                <button
                  className="dice-btn"
                  onClick={() => rollDiceWithModifier(8)}
                >
                  d8
                </button>
                <button
                  className="dice-btn"
                  onClick={() => rollDiceWithModifier(6)}
                >
                  d6
                </button>
                <button
                  className="dice-btn"
                  onClick={() => rollDiceWithModifier(4)}
                >
                  d4
                </button>
              </div>
              {diceResult !== null && (
                <div className="dice-result">Result: {diceResult}</div>
              )}

              <div
                className="music-controls"
                style={{ marginTop: "1rem", textAlign: "center" }}
              >
                <button
                  className="music-btn"
                  onClick={toggleMusic}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "linear-gradient(145deg, #8b4513, #a0522d)",
                    color: "#f4e4c1",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    margin: "0 auto",
                  }}
                >
                  <span>{isMusicPlaying ? "🔇" : "🎵"}</span>
                  <span>{isMusicPlaying ? "Stop Music" : "Play Music"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
