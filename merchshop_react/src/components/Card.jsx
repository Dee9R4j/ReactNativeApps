import React from "react";
import "./Card.css";

const Card = ({ item, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <img src={item.photo1} alt={item.name} className="card-image" />
      <div className="card-info">
        <p className="card-name">{item.name}</p>
        <p className="card-price">₹{item.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Card;