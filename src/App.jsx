import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import Settings from "./components/Settings";

function App() {
  const { t, i18n } = useTranslation();
  const [diceResult, setDiceResult] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Handle RTL languages
  useEffect(() => {
    const currentLang = i18n.language;
    const isRTL = currentLang === "he";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

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
      <div className="header">
        <h1 className="dnd-title">{t("title")}</h1>
        <button
          className="settings-btn"
          onClick={() => setIsSettingsOpen(true)}
          title={t("settings.title")}
        >
          ⚙️
        </button>
      </div>

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

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
