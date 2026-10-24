// components/ImageCarousel.js
import React, { useState, useEffect } from 'react';

const ImageCarousel = () => {
  const images = [
    'images/main.jpeg',
    'images/second.jpeg',
    'images/third.jpeg', // Add as many as you want
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % images.length
      );
    }, 3000); // 3-second interval

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="rounded-lg shadow-xl overflow-hidden h-64 w-full">
      <img
        src={images[currentImageIndex]}
        alt="Delicious campus food"
        className="w-full h-full object-cover transition-all duration-1000"
      />
    </div>
  );
};

export default ImageCarousel;
