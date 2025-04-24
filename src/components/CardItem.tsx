// src/components/CardItem.tsx
import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Card } from '../contexts/CardContext';

interface CardItemProps {
  card: Card;
  onMoveCard: (id: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onMoveCard }) => {
  const navigate = useNavigate();
  
  // Função para formatar data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };
  
  const handleCardClick = () => {
    navigate(`/card/${card.id}`);
  };
  
  return (
    <Paper 
      key={card.id} 
      sx={{ 
        p: 2, 
        bgcolor: '#f5f5f5',
        '&:hover': { boxShadow: 3 },
        cursor: 'pointer',
        mb: 2
      }}
      onClick={handleCardClick}
    >
      <Typography variant="subtitle1">{card.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {card.partName}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {formatDate(card.requestDate)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {card.requesterName}
        </Typography>
      </Box>
      {card.status !== 'Finalizado' && (
        <Button 
          variant="outlined" 
          size="small" 
          sx={{ mt: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            onMoveCard(card.id);
          }}
        >
          Avançar
        </Button>
      )}
    </Paper>
  );
};

export default CardItem;
