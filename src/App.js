import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import UserList from "./components/UserList";
import AddAnnonce from "./components/AddAnnonce";
import CategoryManagement from "./components/CategoryManagement";
import MesAnnonces from "./components/MesAnnonces";
import HomePage from "./components/HomePage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/add-annonce" element={<AddAnnonce />} />
        <Route path="/Categories" element={<CategoryManagement />} />
        <Route path="/mes-annonces" element={<MesAnnonces />} />
        <Route path="/" element={<HomePage />} />

      </Routes>
    </Router>
  );
}

export default App;
