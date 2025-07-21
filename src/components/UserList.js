import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8084/api/users')
      .then(res => {
        console.log("Données reçues", res.data); // 👈 Très important : vérifie ici
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement", err); // 👈 Vérifie l’erreur
        setError("Erreur lors du chargement des utilisateurs");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des utilisateurs...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.username} - {user.password}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun utilisateur trouvé</p>
      )}
    </div>
  );
};

export default UserList;