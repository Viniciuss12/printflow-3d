// src/components/cards/CardItem.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  Box, 
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Card } from '../../types/Card';
import { formatDate } from '../../utils/formatters';

interface CardItemProps {
  card: Card;
  index: number;
}

const CardItem: React.FC<CardItemProps> = ({ card, index }) => {
  const navigate = useNavigate();
  
  // Função para determinar a cor do prazo
  const getDeadlineColor = () => {
    const today = new Date();
    const deadline = new Date(card.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'error';
    if (diffDays <= 3) return 'warning';
    return 'success';
  };
  
  // Abrir detalhes do card
  const handleCardClick = () => {
    navigate(`/cards/${card.id}`);
  };
  
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={snapshot.isDragging ? 6 : 1}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: snapshot.isDragging ? 'primary.light' : 'background.paper',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            transition: 'all 0.2s ease',
          }}
          onClick={handleCardClick}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <Typography variant="subtitle1" component="div" noWrap>
              {card.partName}
            </Typography>
            
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                // Implementar menu de opções
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography variant="body2" color="text.secondary" noWrap>
            {card.brand} - {card.model}
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" display="block">
              Solicitante: {card.requesterName}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1
            }}>
              <Tooltip title={`Quantidade: ${card.quantity}`}>
                <Chip 
                  label={`Qtd: ${card.quantity}`} 
                  size="small" 
                  variant="outlined"
                />
              </Tooltip>
              
              <Tooltip title={`Prazo: ${formatDate(card.deadline)}`}>
                <Chip 
                  label={formatDate(card.deadline)} 
                  size="small" 
                  color={getDeadlineColor()}
                />
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

export default CardItem;
