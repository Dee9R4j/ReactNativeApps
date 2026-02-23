import React, { useState, useEffect } from "react";
import "./Carousel.css";

const Carousel = ({ cartClicked, wishClicked }) => {
  const slides = [
    "Slide 1",
    "Slide 2",
    "Slide 3",
    "Slide 4",
    "Slide 5",
    "Slide 6",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const swipeThreshold = 30; 
  const totalSlides = slides.length;

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (event) => {
    setStartX(event.touches[0].clientX);
    setEndX(event.touches[0].clientX); 
  };

  const handleTouchMove = (event) => {
    setEndX(event.touches[0].clientX);
    event.preventDefault(); 
  };

  const handleTouchEnd = () => {
    const deltaX = endX - startX;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      } else {
        
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [currentSlide]);

  return (
    <>
      <div
        className="carousel"
        style={cartClicked || wishClicked ? { display: "none" } : {}}
      >
        <div
          className="slides-container"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((_, index) => (
            <div key={index} className="slide"></div>
          ))}
        </div>

        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={index === currentSlide ? "dot active" : "dot"}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Carousel;
