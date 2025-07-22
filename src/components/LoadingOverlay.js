// src/components/LoadingOverlay.js
import React from "react";
import "./LoadingOverlay.css";

const icons = [
  "https://www.svgrepo.com/show/281115/megaphone-advertising.svg",
  "https://www.svgrepo.com/show/275446/car-key.svg",
  "https://www.svgrepo.com/show/227448/house-rent.svg",
];

const LoadingOverlay = ({ message = "Connexion à votre compte..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="rotating-icons">
          {icons.map((src, i) => (
            <img key={i} src={src} alt="icon" className={`rotating-icon delay-${i}`} />
          ))}
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
