import React from "react";
import { useTranslation } from "react-i18next";

const Settings = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>{t("settings.title")}</h3>
          <button className="close-settings-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h4>{t("settings.language")}</h4>
            <div className="language-switcher">
              <button
                className={`lang-btn ${i18n.language === "en" ? "active" : ""}`}
                onClick={() => changeLanguage("en")}
                title="English"
              >
                🇺🇸
              </button>
              <button
                className={`lang-btn ${i18n.language === "ru" ? "active" : ""}`}
                onClick={() => changeLanguage("ru")}
                title="Русский"
              >
                🇷🇺
              </button>
              <button
                className={`lang-btn ${i18n.language === "he" ? "active" : ""}`}
                onClick={() => changeLanguage("he")}
                title="עברית"
              >
                🇮🇱
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h4>{t("settings.about")}</h4>
            <p>{t("settings.description")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
