// src/components/CardColumn.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Card, CardStatus } from '../contexts/CardContext';
import CardItem from './CardItem';

interface CardColumnProps {
  status: CardStatus;
  cards: Card[];
  onMoveCard: (id: string) => void;
}

const CardColumn: React.FC<CardColumnProps> = ({ status, cards, onMoveCard }) => {
  return (
    <Box sx={{ width: { xs: '100%', sm: '48%', md: '31%', lg: '19%' }, mb: 2 }}>
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{status}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cards.map(card => (
            <CardItem 
              key={card.id} 
              card={card} 
              onMoveCard={onMoveCard} 
            />
          ))}
          {cards.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Nenhuma solicitação
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CardColumn;
