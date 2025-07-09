import React from "react";
import { useTranslation } from "react-i18next";

const CombatSection = ({ currentEnemy, combatLog }) => {
  const { t } = useTranslation();

  return (
    <>
      {combatLog.length > 0 && (
        <div className="combat-log">
          <h4>{t("combat.combatLog")}</h4>
          {combatLog.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))}
        </div>
      )}

      {currentEnemy && (
        <div className="combat-section">
          <h3>{t("combat.title")}</h3>
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
              {t("characterSheet.hp")}: {currentEnemy.hp}/{currentEnemy.maxHp}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CombatSection;
