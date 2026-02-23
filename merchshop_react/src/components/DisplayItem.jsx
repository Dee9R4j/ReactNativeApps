import React, { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { useShop } from "../Context/ShopContext";
import "./DisplayItem.css";

const DisplayItem = ({ item, onClose }) => {
  const { dispatch } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [wishlistClicked, setWishlistClicked] = useState(false);
  const [cartClicked, setCartClicked] = useState(false);
  const images = [item.photo1, item.photo2, item.photo3].filter(Boolean);
  const swipeThreshold = 50;


  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const deltaX = endX - startX;
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
      } else {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }
    }
  };


  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity: 1 },
    });
    setCartClicked(true);
    setTimeout(() => setCartClicked(false), 3000);
  };


  const handleAddToWishlist = () => {
    dispatch({
      type: "ADD_TO_WISHLIST",
      payload: item
    });
    setWishlistClicked(true);
    setTimeout(() => setWishlistClicked(false), 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="display-item-overlay">
      <div className="display-item-content">
        <div className="card-header">
          <ArrowLeft className="icon close" onClick={onClose} size={35} />
          <Heart
            className={`icon wishlist ${wishlistClicked ? 'wishlist-animate' : ''}`}
            fill={wishlistClicked ? "red": "white"}
            onClick={handleAddToWishlist}
            size={35}
          />
        </div>

        <div className="carousel-container">
          <div
            className="slides-container"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((img, index) => (
              <div key={index} className="slide">
                <img
                  src={img}
                  alt={`${item.name} ${index + 1}`}
                  className="slide-image"
                />
              </div>
            ))}
          </div>

          <div className="carousel-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="item-details">
          <h2>{item.name}</h2>
          <p className="item-price">₹{item.price.toFixed(2)}</p>
          <button 
            className={`add-to-cart-btn ${cartClicked ? 'cart-animate' : ''}`} 
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayItem;
