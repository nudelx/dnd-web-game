import React from "react";
import { useTranslation } from "react-i18next";

const CharacterCreation = ({
  name,
  setName,
  charClass,
  setCharClass,
  race,
  setRace,
  CLASSES,
  RACES,
  onStartAdventure,
}) => {
  const { t } = useTranslation();

  return (
    <div className="character-creation">
      <h2>{t("characterCreation.title")}</h2>
      <label>
        {t("characterCreation.name")}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("characterCreation.namePlaceholder")}
        />
      </label>
      <label>
        {t("characterCreation.class")}
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
        {t("characterCreation.race")}
        <select value={race} onChange={(e) => setRace(e.target.value)}>
          {RACES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <button disabled={!name} onClick={onStartAdventure}>
        {t("characterCreation.beginAdventure")}
      </button>
    </div>
  );
};

export default CharacterCreation;
