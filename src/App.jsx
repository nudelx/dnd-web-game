import { useState } from "react";
import "./App.css";
import { CLASSES, RACES } from "./const/classes";
import { rollDice } from "./functions/utils";
import { useGameState } from "./hooks/useGameState";
import { useMusic } from "./hooks/useMusic";
import { useAdventure } from "./hooks/useAdventure";
import CharacterCreation from "./components/CharacterCreation";
import CharacterSheet from "./components/CharacterSheet";
import CombatSection from "./components/CombatSection";
import SpellsSection from "./components/SpellsSection";
import InventorySection from "./components/InventorySection";
import DiceRoller from "./components/DiceRoller";
import AdventureContent from "./components/AdventureContent";

function App() {
  const [diceResult, setDiceResult] = useState(null);

  const gameState = useGameState();
  const musicHook = useMusic();
  const adventureHook = useAdventure(gameState, musicHook);

  const {
    step,
    name,
    setName,
    charClass,
    setCharClass,
    race,
    setRace,
    character,
    inventory,
    equipped,
    spellSlots,
    currentEnemy,
    adventureText,
    adventureChoices,
    showSpells,
    showInventory,
    levelUpMessage,
    combatLog,
    startAdventure,
    clearSave,
  } = gameState;

  const { isMusicPlaying, toggleMusic } = musicHook;
  const { castSpell, consumeItem, equipItem, handleAdventureChoice } =
    adventureHook;

  const rollDiceWithModifier = (sides, modifier = 0) => {
    const result = rollDice(sides) + modifier;
    setDiceResult(result);
    return result;
  };

  return (
    <div className="dnd-container">
      <h1 className="dnd-title">Dungeons & Dragons: Web Adventure</h1>

      {step === "create" && (
        <CharacterCreation
          name={name}
          setName={setName}
          charClass={charClass}
          setCharClass={setCharClass}
          race={race}
          setRace={setRace}
          CLASSES={CLASSES}
          RACES={RACES}
          onStartAdventure={startAdventure}
        />
      )}

      {step === "adventure" && character && (
        <div className="adventure-section">
          <CharacterSheet
            character={character}
            equipped={equipped}
            levelUpMessage={levelUpMessage}
            onClearSave={clearSave}
          />

          <div className="adventure-content">
            <AdventureContent
              adventureText={adventureText}
              adventureChoices={adventureChoices}
              onAdventureChoice={handleAdventureChoice}
            />

            <CombatSection currentEnemy={currentEnemy} combatLog={combatLog} />

            <SpellsSection
              showSpells={showSpells}
              character={character}
              spellSlots={spellSlots}
              onCastSpell={castSpell}
            />

            <InventorySection
              showInventory={showInventory}
              inventory={inventory}
              onEquipItem={equipItem}
              onConsumeItem={consumeItem}
              onCloseInventory={() => gameState.setShowInventory(false)}
            />

            <DiceRoller
              diceResult={diceResult}
              onRollDice={rollDiceWithModifier}
              isMusicPlaying={isMusicPlaying}
              onToggleMusic={toggleMusic}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
