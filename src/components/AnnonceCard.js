// src/components/AnnonceCard.js
import React from 'react';
import './AnnonceCard.css'; // Pour le style

const AnnonceCard = ({ annonce }) => {
  const phoneNumber = annonce.phoneNumber || '123456789';
  const message = `Bonjour, je suis intéressé par votre annonce "${annonce.title}" sur Anmoun.`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="annonce-card">
      {/* Image principale */}
      {annonce.photos && annonce.photos.length > 0 ? (
        <img
          src={`http://localhost:8082${annonce.photos[0]}`}
          alt={annonce.title}
          className="annonce-image"
        />
      ) : (
        <div className="annonce-image placeholder">Pas d'image</div>
      )}

      {/* Contenu */}
      <div className="annonce-content">
        <h3 className="annonce-title">{annonce.title}</h3>
        <p className="annonce-description">
          {annonce.description?.length > 100
            ? annonce.description.substring(0, 100) + '...'
            : annonce.description}
        </p>
        <p className="annonce-price"><strong>{annonce.price} DH</strong></p>
        <p className="annonce-location">📍 {annonce.city}</p>

        {/* Annonceur */}
        <div className="annonceur">
          <strong> Publié par :</strong> @{annonce.username}
        </div>

        {/* Boutons d'action */}
        <div className="annonce-actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            💬 WhatsApp
          </a>
          <a href={`tel:${phoneNumber}`} className="btn-call">
            📞 Appeler
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnnonceCard;