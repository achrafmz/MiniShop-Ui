// src/components/CategoryList.js
import React, { useState, useEffect } from 'react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Charger les catégories
  useEffect(() => {
    fetch("http://localhost:8082/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Erreur chargement catégories", err));
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '20px 0',
      position: 'relative',
    }}>
      <button
        onClick={handlePrev}
        disabled={currentPage === 0}
        style={{
          background: '#eee',
          border: 'none',
          fontSize: '24px',
          padding: '10px 15px',
          borderRadius: '50%',
          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 0 ? 0.5 : 1,
        }}
      >
        
      </button>

      <div style={{
        display: 'flex',
        gap: '20px',
        overflow: 'hidden',
        padding: '10px 20px',
        maxWidth: '800px',
        justifyContent: 'center',
      }}>
        {currentCategories.map(cat => (
          <div key={cat.id} style={{
            textAlign: 'center',
            minWidth: '120px',
          }}>
            <img
              src={`http://localhost:8082${cat.photoUrl}`}
              alt={cat.name}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '2px solid #fa6400'
              }}
            />
            <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              {cat.name}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
        style={{
          background: '#eee',
          border: 'none',
          fontSize: '24px',
          padding: '10px 15px',
          borderRadius: '50%',
          cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages - 1 ? 0.5 : 1,
        }}
      >
        
      </button>
    </div>
  );
};

export default CategoryList;