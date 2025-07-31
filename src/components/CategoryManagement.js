// src/components/CategoryManagement.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Space,
  Popconfirm,
} from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const API_URL = "http://localhost:8082/api/categories";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Fetch categories
  const fetchCategories = async () => {
    const response = await axios.get(API_URL);
    setCategories(response.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle create or update
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("name", values.name);
      if (fileList[0]) {
        formData.append("photo", fileList[0].originFileObj);
      }

      if (editingCategory) {
        // Update
        await axios.put(`${API_URL}/${editingCategory.id}`, {
          name: values.name,
          photoUrl: editingCategory.photoUrl,
        });
        message.success("Catégorie mise à jour");
      } else {
        // Create
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Catégorie créée");
      }

      fetchCategories();
      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      setEditingCategory(null);
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de l'enregistrement");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      message.success("Catégorie supprimée");
      fetchCategories();
    } catch (error) {
      message.error("Erreur lors de la suppression");
    }
  };

  // Open modal for editing
  const openEditModal = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({ name: category.name });
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
    },
    {
      title: "Photo",
      dataIndex: "photoUrl",
      render: (url) => (
        <img
  src={`http://localhost:8082${url}`}
  alt="category"
  style={{ width: 100, height: 100, objectFit: "cover" }}
/>

      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Supprimer cette catégorie ?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestion des Catégories</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setModalVisible(true);
          setEditingCategory(null);
          form.resetFields();
        }}
        style={{ marginBottom: 20 }}
      >
        Ajouter une catégorie
      </Button>

      <Table dataSource={categories} rowKey="id" columns={columns} />

      <Modal
        title={editingCategory ? "Modifier Catégorie" : "Nouvelle Catégorie"}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
          setFileList([]);
        }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: "Veuillez entrer le nom" }]}
          >
            <Input />
          </Form.Item>
          {!editingCategory && (
            <Form.Item
              label="Photo"
              rules={[{ required: true, message: "Veuillez ajouter une photo" }]}
            >
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Choisir une image</Button>
              </Upload>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
