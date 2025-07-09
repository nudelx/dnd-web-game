import React from "react";

const CombatSection = ({ currentEnemy, combatLog }) => {
  return (
    <>
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
                  width: `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%`,
                }}
              ></div>
            </div>
            <div>
              HP: {currentEnemy.hp}/{currentEnemy.maxHp}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CombatSection;
