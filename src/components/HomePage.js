// src/components/HomePage.js
import React from 'react';
import CategoryList from './CategoryList';
import CategoryAnnonceList from './CategoryAnnonceList';

const HomePage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      <h1 style={{
        textAlign: 'center',
        color: '#fa6400',
        marginBottom: '30px',
        fontSize: '2.5em',
        fontWeight: 'bold'
      }}>
        🔥 Bienvenue sur Anmoun
      </h1>

      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '1.1em' }}>
        Découvrez les meilleures annonces près de chez vous
      </p>

      {/* 🔽 Liste des catégories */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Top Catégories</h2>
        <CategoryList />
      </div>

      {/* 🔽 Annonces par catégorie */}
      <div style={{ marginTop: '60px' }}>
        <CategoryAnnonceList />
      </div>
    </div>
  );
};

export default HomePage;