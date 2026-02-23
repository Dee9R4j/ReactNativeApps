import React, { useState } from "react";
import "./Carousel.css";

const Carousel = () => {
  const slides = ["Slide 1", "Slide 2", "Slide 3"];
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
  };

  const handleTouchMove = (event) => {
    setEndX(event.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (Math.abs(endX - startX) > swipeThreshold) {
      if (endX > startX) {
        setCurrentSlide(
          (previousSlide) => (previousSlide - 1 + totalSlides) % totalSlides
        );
      } else {
        setCurrentSlide((previousSlide) => (previousSlide + 1) % totalSlides);
      }
    }
  };

  return (
    <div className="carousel">
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
  );
};

export default Carousel;
