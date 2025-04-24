import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useCardContext } from '../contexts/CardContext';
import { CardStatus } from '../types/Card';
import Header from '../components/Header';
import CardColumn from '../components/CardColumn';
import NewCardForm from '../components/NewCardForm';

const Dashboard: React.FC = () => {
  const { cards, loading, error, moveCard } = useCardContext();
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  
  // Lista de status possíveis
  const statuses: CardStatus[] = [
    'Solicitado',
    'Aprovado',
    'Fila de Produção',
    'Em Produção',
    'Finalizado'
  ];
  
  // Títulos para cada status
  const statusTitles: Record<CardStatus, string> = {
    'Solicitado': 'Solicitações',
    'Aprovado': 'Aprovados',
    'Fila de Produção': 'Na Fila',
    'Em Produção': 'Produzindo',
    'Finalizado': 'Finalizados'
  };
  
  // Filtrar cards por status
  const getCardsByStatus = (status: CardStatus) => {
    return cards.filter(card => card.status === status);
  };
  
  // Função para mover um card para o próximo status
  const handleMoveCard = async (cardId: string): Promise<void> => {
    try {
      await moveCard(cardId);
    } catch (error) {
      console.error('Erro ao mover card:', error);
    }
  };
  
  // Alternar exibição do formulário de novo card
  const toggleNewCardForm = () => {
    setShowNewCardForm(!showNewCardForm);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header 
        title="PrintFlow 3D" 
        onNewCardClick={toggleNewCardForm}
      />
      
      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {showNewCardForm && (
          <Box sx={{ mb: 4 }}>
            <NewCardForm onClose={toggleNewCardForm} />
          </Box>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            Carregando solicitações...
          </Box>
        ) : error ? (
          <Box sx={{ color: 'error.main', mt: 4 }}>
            {error}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {statuses.map((status) => (
              <CardColumn 
                key={status}
                title={statusTitles[status]}
                status={status}
                cards={cards}
                onMoveCard={handleMoveCard}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
