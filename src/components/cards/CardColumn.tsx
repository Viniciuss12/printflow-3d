// src/components/cards/CardColumn.tsx
import React from 'react';
import { Box } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import { Card as CardType, CardStatus } from '../../types/Card';
import CardItem from './CardItem';

interface CardColumnProps {
  status: CardStatus;
  cards: CardType[];
}

const CardColumn: React.FC<CardColumnProps> = ({ status, cards }) => {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            minHeight: '100px',
            backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'background.paper',
            flexGrow: 1,
            overflowY: 'auto',
            transition: 'background-color 0.2s ease',
            p: 1
          }}
        >
          {cards.map((card, index) => (
            <CardItem key={card.id} card={card} index={index} />
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default CardColumn;
