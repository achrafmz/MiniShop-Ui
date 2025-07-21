import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div>
      <h2>Bienvenue, {username} !</h2>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}

export default Dashboard;
