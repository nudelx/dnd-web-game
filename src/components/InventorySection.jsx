import React from "react";

const InventorySection = ({
  showInventory,
  inventory,
  onEquipItem,
  onConsumeItem,
  onCloseInventory,
}) => {
  if (!showInventory) return null;

  return (
    <div className="inventory-section">
      <h3>Inventory</h3>
      {inventory.map((item, index) => (
        <div key={index} className="inventory-item">
          <div className="item-info">
            <span className="item-name">{item.name}</span>
            {item.type === "weapon" && (
              <span className="item-details">Damage: {item.damage}</span>
            )}
            {item.type === "armor" && (
              <span className="item-details">AC: {item.ac}</span>
            )}
            {item.type === "consumable" && (
              <span className="item-details">Consumable</span>
            )}
          </div>
          <div className="item-actions">
            {(item.type === "weapon" || item.type === "armor") && (
              <button className="equip-btn" onClick={() => onEquipItem(item)}>
                Equip
              </button>
            )}
            {item.type === "consumable" && (
              <button
                className="use-btn"
                onClick={() => onConsumeItem(item, index)}
              >
                Use
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
        Close Inventory
      </button>
    </div>
  );
};

export default InventorySection;
