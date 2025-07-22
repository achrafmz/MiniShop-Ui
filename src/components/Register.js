import React from 'react';
import { Button, Form, Input, Row, Col, Divider } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import './Register.css'; // ton CSS personnalisé
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await axios.post("http://localhost:8084/api/auth/register", values);
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="logo-section">
          <img src="/logoanmon.png" alt="Logo" className="logo-img" />
          <h2 className="title">Créer un compte</h2>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Nom d'utilisateur"
            name="username"
            rules={[{ required: true, message: 'Veuillez entrer votre nom d’utilisateur' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Veuillez entrer votre email' }]}
          >
            <Input size="large" type="email" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Prénom"
                name="firstname"
                rules={[{ required: true, message: 'Veuillez entrer votre prénom' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nom"
                name="lastname"
                rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer un mot de passe' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label="Confirmer le mot de passe"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer le mot de passe' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject('Les mots de passe ne correspondent pas');
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="orange-button" block size="large">
              S'inscrire
            </Button>
          </Form.Item>
        </Form>

        <Divider>ou</Divider>

        <Button className="google-btn">
  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
  Connecte avec Google
</Button>

      </div>
    </div>
  );
};

export default Register;
