// src/components/UserList.js
import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  Button,
  Typography,
  Card,
  message,
} from "antd";
import axios from "axios"; // ✅ Import de axios (corrige l'erreur "axios is not defined")

const { Title } = Typography;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [form] = Form.useForm();

  // 🔽 Chargement des utilisateurs au démarrage
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8084/api/users");
        setUsers(response.data);
      } catch (error) {
        message.error("Impossible de charger les utilisateurs");
        console.error("Erreur API", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔍 Filtrer les utilisateurs par username
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchUsername.toLowerCase())
  );

  // ✏️ Ouvrir le modal de modification
  const showModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  // 🚫 Fermer le modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  // 💾 Sauvegarder les modifications
  const handleSave = async (values) => {
    try {
      await axios.put(
        `http://localhost:8084/api/users/${editingUser.id}`,
        values
      );
      message.success("Utilisateur mis à jour !");
      // Mettre à jour localement
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u))
      );
      handleCancel();
    } catch (error) {
      message.error("Échec de la mise à jour");
      console.error("Erreur PUT", error);
    }
  };

  // 🗑️ Supprimer un utilisateur
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await axios.delete(`http://localhost:8084/api/users/${id}`);
        message.success("Utilisateur supprimé !");
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        message.error("Échec de la suppression");
        console.error("Erreur DELETE", error);
      }
    }
  };

  // 📋 Colonnes du tableau
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Nom d'utilisateur",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Prénom",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Nom",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={() => showModal(record)}>
            Modifier
          </Button>
          <Button
            type="danger"
            size="small"
            style={{ marginLeft: 8 }}
            onClick={() => handleDelete(record.id)}
          >
            Supprimer
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
          📋 Liste des Utilisateurs
        </Title>

        {/* 🔎 Barre de recherche */}
        <Input
          placeholder="Rechercher par nom d'utilisateur"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          style={{ marginBottom: 20, width: 300 }}
        />

        {/* 📊 Tableau */}
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>

      {/* Modal Modifier */}
      <Modal
        title="Modifier l'utilisateur"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Enregistrer"
        cancelText="Annuler"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="username" label="Nom d'utilisateur" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="firstName" label="Prénom">
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Nom">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mot de passe (laisser vide pour ne pas changer)">
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;