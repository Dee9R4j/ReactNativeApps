import React, { useState } from "react";
import Card from "./Card.jsx";
import DisplayItem from "./DisplayItem";
import "./CardContainer.css";
import itemsList from "./items.jsx";

const CardContainer = ({ setDisplayItemVisible }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    if (typeof setDisplayItemVisible === "function") {
      setDisplayItemVisible(true);
    }
  };

  return (
    <div className="card-container">
      {itemsList.map((item, index) => (
        <Card key={index} item={item} onClick={() => handleCardClick(item)} />
      ))}
      {selectedItem && (
        <DisplayItem
          item={selectedItem}
          onClose={() => {
            setSelectedItem(null);
            if (typeof setDisplayItemVisible === "function") {
              setDisplayItemVisible(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default CardContainer;