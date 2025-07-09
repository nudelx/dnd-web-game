import React from "react";
import { useTranslation } from "react-i18next";

const InventorySection = ({
  showInventory,
  inventory,
  onEquipItem,
  onConsumeItem,
  onCloseInventory,
}) => {
  const { t } = useTranslation();

  if (!showInventory) return null;

  return (
    <div className="inventory-section">
      <h3>{t("inventory.title")}</h3>
      {inventory.map((item, index) => (
        <div key={index} className="inventory-item">
          <div className="item-info">
            <span className="item-name">{item.name}</span>
            {item.type === "weapon" && (
              <span className="item-details">
                {t("inventory.itemTypes.weapon", { damage: item.damage })}
              </span>
            )}
            {item.type === "armor" && (
              <span className="item-details">
                {t("inventory.itemTypes.armor", { ac: item.ac })}
              </span>
            )}
            {item.type === "consumable" && (
              <span className="item-details">
                {t("inventory.itemTypes.consumable")}
              </span>
            )}
          </div>
          <div className="item-actions">
            {(item.type === "weapon" || item.type === "armor") && (
              <button className="equip-btn" onClick={() => onEquipItem(item)}>
                {t("inventory.equip")}
              </button>
            )}
            {item.type === "consumable" && (
              <button
                className="use-btn"
                onClick={() => onConsumeItem(item, index)}
              >
                {t("inventory.use")}
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        className="close-inventory-btn"
        onClick={onCloseInventory}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "linear-gradient(145deg, #8b4513, #a0522d)",
          color: "#f4e4c1",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "0.9rem",
          width: "100%",
        }}
      >
        {t("inventory.closeInventory")}
      </button>
    </div>
  );
};

export default InventorySection;
