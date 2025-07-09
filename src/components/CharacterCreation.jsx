import React from "react";

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
  return (
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
      <button disabled={!name} onClick={onStartAdventure}>
        Begin Adventure
      </button>
    </div>
  );
};

export default CharacterCreation;
