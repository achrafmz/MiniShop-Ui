// src/components/Login.js
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import LoadingOverlay from "./LoadingOverlay";
import "./Login.css";

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await axios.post("http://localhost:8084/api/auth/login", {
        username: values.username,
        password: values.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", values.username);
      message.success("Connexion réussie !");
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Nom d'utilisateur ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Tu peux aussi faire un appel à ton backend ici
      // const response = await axios.post("http://localhost:8081/api/auth/google-login", { ... });

      // Simuler la réussite de la connexion
      const token = "FAKE_TOKEN_FROM_GOOGLE"; // ou response.data.token si backend disponible
      const fullName = user.displayName || user.email;

      localStorage.setItem("token", token);
      localStorage.setItem("username", fullName);

      message.success("Connexion réussie avec Google !");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      message.error("Échec de la connexion Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {loading && <LoadingOverlay text="Connexion à votre compte..." />}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleLogin}
        className="login-form"
      >
        <Title level={2} style={{ color: "#ff6600" }}>
          Connexion
        </Title>

        <Form.Item
          name="username"
          label="Nom d'utilisateur"
          rules={[{ required: true, message: "Champ requis" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mot de passe"
          rules={[{ required: true, message: "Champ requis" }]}
        >
          <Input.Password />
        </Form.Item>

        {errorMessage && (
          <div
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: 16,
              fontWeight: "bold",
            }}
          >
            {errorMessage}
          </div>
        )}

        <Button htmlType="submit" type="primary" className="btn-orange">
          Se connecter
        </Button>

        <Divider>ou</Divider>

        <Button className="google-button" onClick={handleGoogleLogin}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Se connecter avec Google
        </Button>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <span>Vous n'avez pas de compte ? </span>
          <a href="/register" style={{ color: "#ff6600", fontWeight: "bold" }}>
            Créer un compte
          </a>
        </div>
      </Form>
    </div>
  );
};

export default Login;
