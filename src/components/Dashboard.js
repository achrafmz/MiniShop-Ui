// src/components/Dashboard.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Bienvenue, {username} !</h2>
      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff6600",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Déconnexion
      </button>
    </div>
  );
}

export default Dashboard;
