import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Divider,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingOverlay from "./LoadingOverlay";
import "./Register.css";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase"; // Chemin vers ton fichier firebase.js
const { Title } = Typography;

const icons = [
  {
    src: "https://www.svgrepo.com/show/281115/megaphone-advertising.svg",
    alt: "Annonce",
  },
  {
    src: "https://www.svgrepo.com/show/422275/clothes-clothing-garment.svg",
    alt: "Vente",
  },
  {
    src: "https://www.svgrepo.com/show/275446/car-key.svg",
    alt: "Achat",
  },
  {
    src: "https://www.svgrepo.com/show/227448/house-rent.svg",
    alt: "Location",
  },
];

const Register = () => {
  const [visibleIcon, setVisibleIcon] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirm: "",
  });

  const navigate = useNavigate();
 const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Ici simule un appel backend (ou tu peux faire ton axios)
      // on simule token reçu
      const fakeToken = "123456789";

      if (fakeToken) {
        localStorage.setItem("token", fakeToken);
        localStorage.setItem("username", user.displayName || user.email);
        message.success("Connexion réussie avec Google !");
        console.log("Navigating to dashboard...");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la connexion Google");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIcon((prev) => (prev + 1) % icons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (changedValues) => {
    setUser({ ...user, ...changedValues });
  };

  const handleRegister = async () => {
    setErrorMessage(""); // Reset message d’erreur à chaque tentative

    if (user.password !== user.confirm) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8084/api/auth/register", {
        username: user.username,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      setErrorMessage("");
      message.success("Inscription réussie !");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;

        if (
          data.message &&
          data.message.toLowerCase().includes("email") &&
          (data.message.toLowerCase().includes("exist") ||
            data.message.toLowerCase().includes("déjà"))
        ) {
          setErrorMessage("Cet email est déjà utilisé, veuillez en choisir un autre.");
        } else {
          setErrorMessage("Cet email est déjà utilisé, veuillez en choisir un autre.");
        }
      } else {
        setErrorMessage("Erreur réseau ou serveur indisponible");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {loading && <LoadingOverlay />}
      <Row className="register-wrapper">
        <Col xs={24} md={12} className="form-section">
          <div className="title-with-logo">
            <Title level={2} className="orange-title" style={{ marginBottom: 0 }}>
              Créer un compte
            </Title>
          </div>
          <Form
            layout="vertical"
            onFinish={handleRegister}
            onValuesChange={(_, allValues) => handleChange(allValues)}
            className="register-form"
          >
            <Form.Item
              name="username"
              label="Nom d'utilisateur"
              rules={[{ required: true, message: "Champ requis" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Champ requis" }]}
            >
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="Prénom"
                  rules={[{ required: true, message: "Champ requis" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Nom"
                  rules={[{ required: true, message: "Champ requis" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="password"
              label="Mot de passe"
              rules={[
                { required: true, message: "Champ requis" },
                {
                  pattern: /^(?=.*[A-Z]).{8,}$/,
                  message:
                    "Le mot de passe doit contenir au moins 8 caractères et une lettre majuscule",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirmer le mot de passe"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Champ requis" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Les mots de passe ne correspondent pas")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* Affichage du message d’erreur en rouge */}
            {errorMessage && (
              <div
                style={{
                  color: "red",
                  marginBottom: 16,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {errorMessage}
              </div>
            )}

            <Button type="primary" htmlType="submit" className="orange-button">
              S'inscrire
            </Button>
            <Divider>ou</Divider>
            <Button className="google-btn" type="button" onClick={handleGoogleSignIn}>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg "
    alt="Google"
    style={{ width: 20, marginRight: 8 }}
  />
  Connecte avec Google
</Button>
<div style={{ marginTop: 24, textAlign: "center" }}>
  <span>Dejà un compte ? </span>
  <a href="/login" style={{ color: "#ff6600", fontWeight: "bold" }}>
    Connectez-vous
  </a>
</div>
          </Form>
        </Col>

        <Col xs={24} md={12} className="illustration-section">
          <div className="right-content">
            <div className="animated-icons">
              {icons.map((icon, idx) => (
                <img
                  key={icon.alt}
                  src={icon.src}
                  alt={icon.alt}
                  className={`icon ${visibleIcon === idx ? "visible" : ""}`}
                />
              ))}
            </div>
            <div className="right-text">
              <h3>Publiez. Achetez. Louez.</h3>
              <p>
                Anmoun vous permet de poster et découvrir les meilleures annonces en
                ligne que ce soit pour vendre des vêtements, louer une maison ou
                acheter une voiture !
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
