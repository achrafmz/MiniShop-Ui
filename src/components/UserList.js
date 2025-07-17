import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les utilisateurs depuis l'API Spring Boot
  useEffect(() => {
    axios.get('http://localhost:8084/api/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Erreur lors du chargement des utilisateurs");
        setLoading(false);
        console.error("Erreur API", err);
      });
  }, []);

  if (loading) {
    return <p>Chargement des utilisateurs...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>👥 Liste des utilisateurs</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username} - {user.password}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;