// src/components/CardColumn.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Card, CardStatus } from '../types/Card';
import CardItem from './CardItem';

interface CardColumnProps {
  title: string;
  status: CardStatus;
  cards: Card[];
  onMoveCard: (id: string) => Promise<void>;
}

const CardColumn: React.FC<CardColumnProps> = ({ title, status, cards, onMoveCard }) => {
  // Filtrar cards pelo status
  const filteredCards = cards.filter(card => card.status === status);
  
  return (
    <Box sx={{ width: '100%', minWidth: 250, maxWidth: 350 }}>
      <Paper 
        sx={{ 
          p: 2, 
          bgcolor: '#f0f0f0', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            pb: 1, 
            borderBottom: '2px solid #3f51b5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {title}
          <Typography 
            variant="caption" 
            sx={{ 
              bgcolor: '#3f51b5', 
              color: 'white', 
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {filteredCards.length}
          </Typography>
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          flex: 1,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 200px)'
        }}>
          {filteredCards.length > 0 ? (
            filteredCards.map(card => (
              <CardItem 
                key={card.id} 
                card={card} 
                onMoveCard={onMoveCard} 
              />
            ))
          ) : (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                textAlign: 'center', 
                fontStyle: 'italic',
                py: 2
              }}
            >
              Nenhuma solicitação
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CardColumn;
