// src/components/AddAnnonce.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Card, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

const AddAnnonce = () => {
  const [username, setUsername] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  // 🔽 Vérifie si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (token && storedUsername) {
      setUsername(storedUsername);
    }
    // Si pas connecté → username reste null → rien ne s'affiche
  }, []);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("city", values.city);
    formData.append("address", values.address || "");
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("username", username); // ✅ Envoie le username

    fileList.forEach(file => {
      formData.append("photos", file.originFileObj);
    });

    try {
      await fetch("http://localhost:8082/api/annonces", {
        method: "POST",
        body: formData,
      });
      message.success("Annonce publiée avec succès !");
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Échec de la publication");
    }
  };

  // 🔽 Si pas connecté → rien ne s'affiche
  if (!username) {
    return null; // Ou tu peux retourner un message : <div>Connectez-vous pour publier</div>
  }

  return (
    <Card style={{ maxWidth: 700, margin: "40px auto", padding: "20px" }}>
      <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>
        📢 Publier une annonce
      </Title>

      <div style={{ marginBottom: 20, textAlign: 'center', fontSize: 16 }}>
        <strong>Bonjour</strong> {username} 👋
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="price" label="Prix" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>

        <Form.Item name="city" label="Ville" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Adresse">
          <Input />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Numéro" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Photos">
          <Upload
            multiple
            listType="picture"
            beforeUpload={() => false}
            onChange={handleChange}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Sélectionner des photos</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            🚀 Publier l'annonce
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddAnnonce;