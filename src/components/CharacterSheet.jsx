import React from "react";
import { useTranslation } from "react-i18next";
import { getModifier } from "../functions/utils";

const CharacterSheet = ({
  character,
  equipped,
  levelUpMessage,
  onClearSave,
}) => {
  const { t } = useTranslation();

  return (
    <div className="character-sheet">
      <h3>{t("characterSheet.title")}</h3>
      <div className="character-info">
        <strong>{character.name}</strong> the {character.race} {character.class}
      </div>
      <div className="character-info">
        {t("characterSheet.level")} {character.level} • {t("characterSheet.xp")}
        : {character.experience}
      </div>
      <div className="character-info">
        <div>
          {t("characterSheet.hp")}: {character.hp}/{character.maxHp}
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
          <div>{t("stats.str")}</div>
          <div className="stat-value">{character.stats.str}</div>
          <div>
            ({getModifier(character.stats.str) >= 0 ? "+" : ""}
            {getModifier(character.stats.str)})
          </div>
        </div>
        <div className="stat">
          <div>{t("stats.dex")}</div>
          <div className="stat-value">{character.stats.dex}</div>
          <div>
            ({getModifier(character.stats.dex) >= 0 ? "+" : ""}
            {getModifier(character.stats.dex)})
          </div>
        </div>
        <div className="stat">
          <div>{t("stats.con")}</div>
          <div className="stat-value">{character.stats.con}</div>
          <div>
            ({getModifier(character.stats.con) >= 0 ? "+" : ""}
            {getModifier(character.stats.con)})
          </div>
        </div>
        <div className="stat">
          <div>{t("stats.int")}</div>
          <div className="stat-value">{character.stats.int}</div>
          <div>
            ({getModifier(character.stats.int) >= 0 ? "+" : ""}
            {getModifier(character.stats.int)})
          </div>
        </div>
        <div className="stat">
          <div>{t("stats.wis")}</div>
          <div className="stat-value">{character.stats.wis}</div>
          <div>
            ({getModifier(character.stats.wis) >= 0 ? "+" : ""}
            {getModifier(character.stats.wis)})
          </div>
        </div>
        <div className="stat">
          <div>{t("stats.cha")}</div>
          <div className="stat-value">{character.stats.cha}</div>
          <div>
            ({getModifier(character.stats.cha) >= 0 ? "+" : ""}
            {getModifier(character.stats.cha)})
          </div>
        </div>
      </div>

      {equipped.weapon && (
        <div className="character-info">
          {t("characterSheet.weapon")}: {equipped.weapon.name} (
          {equipped.weapon.damage})
        </div>
      )}
      {equipped.armor && (
        <div className="character-info">
          {t("characterSheet.armor")}: {equipped.armor.name} (AC:{" "}
          {equipped.armor.ac})
        </div>
      )}

      <button
        className="clear-save-btn"
        onClick={onClearSave}
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
        {t("characterSheet.newGame")}
      </button>
    </div>
  );
};

export default CharacterSheet;
