import {
  rollDice,
  getModifier,
  rollDamage,
  checkLevelUp,
} from "../functions/utils";
import { EQUIPMENT } from "../const/equipment";

export const useAdventure = (gameState, musicHook) => {
  const {
    character,
    setCharacter,
    setInventory,
    equipped,
    setEquipped,
    spellSlots,
    setSpellSlots,
    currentEnemy,
    setCurrentEnemy,
    setAdventureText,
    setAdventureChoices,
    setShowSpells,
    setShowInventory,
    setLevelUpMessage,
    setCombatLog,
  } = gameState;

  const { playMusic } = musicHook;

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
        gameState.clearSave();
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

  return {
    castSpell,
    consumeItem,
    equipItem,
    handleAdventureChoice,
  };
};
