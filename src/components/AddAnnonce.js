import React, { useState, useEffect } from "react";
import { Modal } from "antd";

import { useNavigate } from "react-router-dom"; // pour la redirection

import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Card,
  Typography,
  Select,
  Steps,
} from "antd";
import {
  UploadOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import LoadingOverlay from "./LoadingOverlay"; // 👈 importe l’overlay ici

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;
const SuccessIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="30" stroke="#52c41a" strokeWidth="4" fill="#dff4e3" />
    <path
      d="M20 33L28 41L44 25"
      stroke="#52c41a"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="30" stroke="#ff4d4f" strokeWidth="4" fill="#ffe6e6" />
    <line
      x1="20"
      y1="20"
      x2="44"
      y2="44"
      stroke="#ff4d4f"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <line
      x1="44"
      y1="20"
      x2="20"
      y2="44"
      stroke="#ff4d4f"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

// SVGs dynamiques avec couleur
const SvgStep1 = ({ color }) => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
    <rect x="2" y="10" width="60" height="44" stroke={color} strokeWidth="3" />
    <line x1="10" y1="18" x2="54" y2="18" stroke={color} strokeWidth="2" />
    <line x1="10" y1="26" x2="54" y2="26" stroke={color} strokeWidth="2" />
    <line x1="10" y1="34" x2="54" y2="34" stroke={color} strokeWidth="2" />
    <circle cx="20" cy="46" r="4" fill={color} />
    <circle cx="44" cy="46" r="4" fill={color} />
  </svg>
);

const SvgStep2 = ({ color }) => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
    <rect x="8" y="12" width="48" height="40" rx="4" ry="4" stroke={color} strokeWidth="3" />
    <path d="M20 24l12 12 12-12" stroke={color} strokeWidth="3" fill="none" />
    <circle cx="32" cy="44" r="4" fill={color} />
  </svg>
);

const SvgStep3 = ({ color }) => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="3" fill="none" />
    <path d="M20 34l8 8 16-24" stroke={color} strokeWidth="4" fill="none" />
  </svg>
);

const AddAnnonce = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // 👈 état pour l'overlay
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
const navigate = useNavigate();
const [successModalVisible, setSuccessModalVisible] = useState(false);
const [villes, setVilles] = useState([]);
const [loadingVilles, setLoadingVilles] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) setUsername(storedUsername);
  }, []);
useEffect(() => {
  async function fetchVilles() {
    setLoadingVilles(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "Morocco" }),
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.msg || "Erreur API villes");
      setVilles(data.data.sort());
    } catch (err) {
      message.error("Impossible de charger la liste des villes");
    } finally {
      setLoadingVilles(false);
    }
  }
  fetchVilles();
}, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:8082/api/categories");
        if (!res.ok) throw new Error("Erreur chargement catégories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        message.error(error.message);
      }
    }
    fetchCategories();
  }, []);

  const next = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields([
          "title",
          "description",
          "price",
          "city",
          "categoryId",
          "phoneNumber",
        ]);
      } else if (currentStep === 1) {
        if (fileList.length === 0) {
          message.error("Veuillez ajouter au moins une photo");
          return;
        }
      }
      setCurrentStep(currentStep + 1);
    } catch (err) {}
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const handlePhotoChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
const [errorModalVisible, setErrorModalVisible] = useState(false);
const [errorMessage, setErrorMessage] = useState("");

 const handleSubmit = async () => {
  if (!username) {
    setErrorMessage("Utilisateur non connecté");
    setErrorModalVisible(true);
    return;
  }

  try {
    const values = await form.validateFields([
      "title",
      "description",
      "price",
      "city",
      "address",
      "phoneNumber",
      "categoryId",
    ]);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("city", values.city);
    formData.append("address", values.address || "");
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("username", username);
    formData.append("categoryId", values.categoryId);

    fileList.forEach((file) => {
      formData.append("photos", file.originFileObj);
    });

    setShowOverlay(true);
    setLoading(true);

    const response = await fetch("http://localhost:8082/api/annonces", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setSuccessModalVisible(true);
      form.resetFields();
      setFileList([]);
      setCurrentStep(0);
    } else {
      const errText = await response.text();
      setErrorMessage("Erreur lors de la publication : " + errText);
      setErrorModalVisible(true);
    }
  } catch (err) {
    setErrorMessage("Veuillez vérifier tous les champs.");
    setErrorModalVisible(true);
  } finally {
    setLoading(false);
    setShowOverlay(false);
  }
};


  if (!username) return null;

  const steps = [
    {
      title: "Infos",
      icon: (active) => <SvgStep1 color={active ? "#fa6400" : "#ccc"} />,
      content: (
        <Form form={form} layout="vertical" style={{ maxWidth: 600, margin: "auto" }}>
          <Form.Item label="Titre" name="title" rules={[{ required: true, message: "Le titre est obligatoire" }]}>
            <Input placeholder="Titre de l'annonce" style={{ borderRadius: 6, height: 45 }} />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: "La description est obligatoire" }]}>
            <TextArea rows={4} placeholder="Description détaillée" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item
            label="Prix (€)"
            name="price"
            rules={[
              { required: true, message: "Le prix est obligatoire" },
              { pattern: /^\d+(\.\d{1,2})?$/, message: "Prix invalide" },
            ]}
          >
            <Input type="number" placeholder="Prix en euros" style={{ borderRadius: 6, height: 45 }} />
          </Form.Item>
          <Form.Item label="Ville" name="city" rules={[{ required: true, message: "La ville est obligatoire" }]}>
  <Select
    placeholder="Sélectionnez une ville"
    showSearch
    loading={loadingVilles} // variable d'état que tu dois définir
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().includes(input.toLowerCase())
    }
    style={{ borderRadius: 6, height: 45 }}
    allowClear
  >
    {villes.map((ville) => (
      <Option key={ville} value={ville}>
        {ville}
      </Option>
    ))}
  </Select>
</Form.Item>

          <Form.Item label="Adresse (optionnelle)" name="address">
            <Input placeholder="Adresse" style={{ borderRadius: 6, height: 45 }} />
          </Form.Item>
          <Form.Item
            label="Numéro de téléphone"
            name="phoneNumber"
            rules={[
              { required: true, message: "Le numéro est obligatoire" },
              { pattern: /^\+?\d[\d\s-]{7,}$/, message: "Format téléphone invalide" },
            ]}
          >
            <Input placeholder="+33 6 12 34 56 78" style={{ borderRadius: 6, height: 45 }} />
          </Form.Item>
          <Form.Item label="Catégorie" name="categoryId" rules={[{ required: true, message: "Sélectionnez une catégorie" }]}>
            <Select placeholder="Sélectionnez une catégorie" allowClear style={{ borderRadius: 6, height: 45 }} loading={categories.length === 0}>
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Photos",
      icon: (active) => <SvgStep2 color={active ? "#fa6400" : "#ccc"} />,
      content: (
        <Upload
          multiple
          listType="picture-card"
          beforeUpload={() => false}
          onChange={handlePhotoChange}
          fileList={fileList}
          maxCount={5}
          style={{ maxWidth: 600, margin: "auto" }}
        >
          {fileList.length >= 5 ? null : (
            <div style={{ color: "#fa6400" }}>
              <UploadOutlined style={{ fontSize: 32 }} />
              <div>Ajouter photos</div>
            </div>
          )}
        </Upload>
      ),
    },
    {
      title: "Résumé",
      icon: (active) => <SvgStep3 color={active ? "#fa6400" : "#ccc"} />,
      content: (
        <Card
          bordered={false}
          style={{
            maxWidth: 600,
            margin: "auto",
            backgroundColor: "#fff7f0",
            borderRadius: 10,
            padding: 24,
          }}
        >
          <Title level={4} style={{ color: "#fa6400" }}>
            Vérifiez vos informations
          </Title>
          <p><b>Titre:</b> {form.getFieldValue("title") || "-"}</p>
          <p><b>Description:</b> {form.getFieldValue("description") || "-"}</p>
          <p><b>Prix:</b> {form.getFieldValue("price") ? form.getFieldValue("price") + " €" : "-"}</p>
          <p><b>Ville:</b> {form.getFieldValue("city") || "-"}</p>
          <p><b>Adresse:</b> {form.getFieldValue("address") || "-"}</p>
          <p><b>Téléphone:</b> {form.getFieldValue("phoneNumber") || "-"}</p>
          <p><b>Catégorie:</b> {categories.find((c) => c.id === form.getFieldValue("categoryId"))?.name || "-"}</p>
          <p><b>Photos:</b> {fileList.length} photo{fileList.length > 1 ? "s" : ""}</p>
        </Card>
      ),
    },
  ];

  return (
    <Card
      style={{
        maxWidth: 720,
        margin: "40px auto",
        padding: 32,
        borderRadius: 14,
        boxShadow: "0 0 30px rgba(250, 100, 0, 0.3)",
        backgroundColor: "white",
      }}
    >
      <Title level={2} style={{ textAlign: "center", color: "#fa6400", marginBottom: 30 }}>
        📢 Publier une annonce
      </Title>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 40,
        }}
      >
        {steps.map((step, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            {step.icon(index === currentStep)}
            <Title
              level={4}
              style={{
                color: index === currentStep ? "#fa6400" : "#ccc",
                marginTop: 10,
                fontWeight: index === currentStep ? "bold" : "normal",
              }}
            >
              {step.title}
            </Title>
          </div>
        ))}
      </div>

      <Steps
        current={currentStep}
        style={{ marginBottom: 40 }}
        progressDot
        items={steps.map((s) => ({ title: s.title }))}
      />

      <div style={{ minHeight: 400 }}>{steps[currentStep].content}</div>

      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: currentStep === 0 ? "flex-end" : "space-between",
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {currentStep > 0 && (
          <Button onClick={prev} icon={<LeftOutlined />} style={{ borderColor: "#fa6400", color: "#fa6400" }}>
            Précédent
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={next} icon={<RightOutlined />} style={{ backgroundColor: "#fa6400", borderColor: "#fa6400" }}>
            Suivant
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            icon={<CheckCircleOutlined />}
            style={{ backgroundColor: "#fa6400", borderColor: "#fa6400" }}
            block
          >
            Publier l'annonce
          </Button>
        )}
      </div>

      {/* 👇 Ajout de l'overlay ici */}
      {showOverlay && <LoadingOverlay message="Publication de votre annonce en cours..." />}
      <Modal
  open={successModalVisible}
  footer={[
    <Button
      key="home"
      type="primary"
      style={{ backgroundColor: "#fa6400", borderColor: "#fa6400" }}
      onClick={() => {
        setSuccessModalVisible(false);
        navigate("/");
      }}
    >
      Accueil
    </Button>,
  ]}
  closable={false}
  centered
>
  <div style={{ textAlign: "center" }}>
    <SuccessIcon />
    <Title level={4} style={{ marginTop: 16, color: "#52c41a" }}>
      Votre annonce a été publiée avec succès !
    </Title>
  </div>
</Modal>

<Modal
  open={errorModalVisible}
  footer={[
    <Button
      key="close"
      onClick={() => setErrorModalVisible(false)}
      style={{ borderColor: "#ff4d4f", color: "#ff4d4f" }}
    >
      Fermer
    </Button>,
  ]}
  closable={false}
  centered
>
  <div style={{ textAlign: "center" }}>
    <ErrorIcon />
    <Title level={4} style={{ marginTop: 16, color: "#ff4d4f" }}>
      Une erreur est survenue
    </Title>
    <p style={{ color: "#a8071a" }}>{errorMessage}</p>
  </div>
</Modal>

    </Card>
   

  );
};

export default AddAnnonce;
