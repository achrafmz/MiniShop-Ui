// src/components/CategoryAnnonceList.js
import React, { useState, useEffect } from 'react';
import AnnonceCard from './AnnonceCard';

const CategoryAnnonceList = () => {
  const [categories, setCategories] = useState([]);
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8082/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Erreur catégories", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8082/api/annonces")
      .then(res => res.json())
      .then(data => setAnnonces(data))
      .catch(err => console.error("Erreur annonces", err));
  }, []);

  const annoncesParCategorie = annonces.reduce((acc, annonce) => {
    const catId = annonce.categoryId;
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(annonce);
    return acc;
  }, {});

  return (
    <div>
      {categories.map(cat => {
        const annoncesCat = annoncesParCategorie[cat.id] || [];
        if (annoncesCat.length === 0) return null;

        return (
          <div key={cat.id} style={{ marginTop: '60px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>{cat.name}</h2>
            {annoncesCat.map(annonce => (
              <AnnonceCard key={annonce.id} annonce={annonce} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryAnnonceList;