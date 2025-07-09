import React from "react";

const DiceRoller = ({
  diceResult,
  onRollDice,
  isMusicPlaying,
  onToggleMusic,
}) => {
  return (
    <div className="dice-roller">
      <h3>Dice Roller</h3>
      <div className="dice-buttons">
        <button className="dice-btn" onClick={() => onRollDice(20)}>
          d20
        </button>
        <button className="dice-btn" onClick={() => onRollDice(12)}>
          d12
        </button>
        <button className="dice-btn" onClick={() => onRollDice(10)}>
          d10
        </button>
        <button className="dice-btn" onClick={() => onRollDice(8)}>
          d8
        </button>
        <button className="dice-btn" onClick={() => onRollDice(6)}>
          d6
        </button>
        <button className="dice-btn" onClick={() => onRollDice(4)}>
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
          onClick={onToggleMusic}
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
  );
};

export default DiceRoller;
