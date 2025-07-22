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
  const [user, setUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirm: "",
  });

  const navigate = useNavigate();

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
    if (user.password !== user.confirm) {
      message.error("Les mots de passe ne correspondent pas");
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
      message.success("Inscription réussie !");
      navigate("/login");
    } catch (error) {
      message.error("Échec de l'inscription");
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
      message: "Le mot de passe doit contenir au moins 8 caractères et une lettre majuscule",
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
            <Button type="primary" htmlType="submit" className="orange-button">
              S'inscrire
            </Button>
            <Divider>ou</Divider>
            <Button className="google-btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
              />
              Connecte avec Google
            </Button>
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
                Anmoun vous permet de poster et découvrir les meilleures annonces en ligne que ce soit
                pour vendre des vêtements, louer une maison ou acheter une voiture !
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
