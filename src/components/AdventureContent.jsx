import React from "react";

const AdventureContent = ({
  adventureText,
  adventureChoices,
  onAdventureChoice,
}) => {
  return (
    <div className="adventure-content">
      <div className="adventure-text">
        <pre>{adventureText}</pre>
      </div>

      <div className="adventure-choices">
        {adventureChoices.map((choice, index) => (
          <button
            key={index}
            className="choice-btn"
            onClick={() => onAdventureChoice(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdventureContent;
