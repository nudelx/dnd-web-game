import React from "react";

const SpellsSection = ({ showSpells, character, spellSlots, onCastSpell }) => {
  if (!showSpells || !character.spells) return null;

  return (
    <div className="spells-section">
      <h3>Spells</h3>
      {character.spells.map((spell, index) => (
        <div key={index} className="spell-item">
          <button
            className="spell-btn"
            onClick={() => onCastSpell(spell)}
            disabled={spellSlots[spell.name] <= 0}
          >
            {spell.name} (Level {spell.level}) - Slots:{" "}
            {spellSlots[spell.name] || 0}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SpellsSection;
