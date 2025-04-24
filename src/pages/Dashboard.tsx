// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useCardContext, CardStatus } from '../contexts/CardContext';
import Header from '../components/Header';
import CardColumn from '../components/CardColumn';
import NewCardForm from '../components/NewCardForm';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { cards, moveCard } = useCardContext();
  const { user } = useAuth();
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  
  // Status disponíveis no sistema
  const statuses: CardStatus[] = [
    'Solicitado',
    'Aprovado',
    'Fila de Produção',
    'Em Produção',
    'Finalizado'
  ];
  
  // Função para obter cards por status
  const getCardsByStatus = (status: CardStatus) => {
    return cards.filter(card => card.status === status);
  };
  
  // Alternar exibição do formulário de nova solicitação
  const toggleNewCardForm = () => {
    setShowNewCardForm(!showNewCardForm);
  };
  
  // Registrar informações do usuário autenticado
  useEffect(() => {
    if (user) {
      console.log('Usuário autenticado:', user.name);
    }
  }, [user]);
  
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      <Header 
        onNewCardClick={toggleNewCardForm}
        showNewCardForm={showNewCardForm}
      />
      
      <Box sx={{ p: 3 }}>
        {showNewCardForm && (
          <NewCardForm onCancel={toggleNewCardForm} />
        )}
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {statuses.map((status) => (
            <CardColumn 
              key={status}
              status={status}
              cards={getCardsByStatus(status)}
              onMoveCard={moveCard}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
