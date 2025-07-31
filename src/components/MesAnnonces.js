// src/components/MesAnnonces.js
import React, { useState, useEffect } from 'react';
import {
  List,
  Card,
  Typography,
  Button,
  Empty,
  Divider,
  message
} from 'antd';
import axios from 'axios';

const { Title } = Typography;

const MesAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      message.error('Vous devez être connecté');
      return;
    }

    const fetchAnnonces = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/annonces/user/${username}`);
        setAnnonces(response.data);
      } catch (error) {
        message.error('Échec du chargement de vos annonces');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonces();
  }, [username]);

  if (!username) {
    return (
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <Empty description="Connectez-vous pour voir vos annonces" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: 900, margin: '40px auto' }}>
      <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
        📦 Mes Annonces
      </Title>
      <Divider />

      {annonces.length === 0 ? (
        <Empty description="Vous n'avez pas encore publié d'annonce" />
      ) : (
        <List
          dataSource={annonces}
          renderItem={(annonce) => (
            <List.Item>
              <Card
                title={annonce.title}
                style={{ width: '100%' }}
                extra={<Button type="primary">Modifier</Button>}
              >
                <p><strong>Prix :</strong> {annonce.price} DH</p>
                <p><strong>Ville :</strong> {annonce.city}</p>
                <p><strong>Description :</strong> {annonce.description}</p>
                <div style={{ marginTop: 10 }}>
                  {annonce.photos?.map((photo, index) => (
                    <img
                      key={index}
                      src={`http://localhost:8082${photo}`}
                      alt="Annonce"
                      style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 8 }}
                    />
                  ))}
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default MesAnnonces;