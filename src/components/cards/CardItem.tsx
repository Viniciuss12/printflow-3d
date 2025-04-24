// src/components/cards/CardItem.tsx
import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Card as MuiCard,
  CardContent,
  CardMedia,
  CardActions,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../types/Card';

interface CardItemProps {
  card: Card;
  onMoveCard: (id: string) => Promise<void>;
}

const CardItem: React.FC<CardItemProps> = ({ card, onMoveCard }) => {
  const navigate = useNavigate();
  
  // Função para formatar data
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('pt-BR');
  };
  
  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const handleCardClick = () => {
    navigate(`/card/${card.id}`);
  };
  
  const handleMoveCard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onMoveCard(card.id);
    } catch (error) {
      console.error('Erro ao mover card:', error);
    }
  };
  
  // Determinar cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solicitado':
        return '#3f51b5'; // Azul
      case 'Aprovado':
        return '#4caf50'; // Verde
      case 'Fila de Produção':
        return '#ff9800'; // Laranja
      case 'Em Produção':
        return '#f44336'; // Vermelho
      case 'Finalizado':
        return '#9e9e9e'; // Cinza
      default:
        return '#3f51b5'; // Azul padrão
    }
  };
  
  return (
    <MuiCard 
      sx={{ 
        width: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
      onClick={handleCardClick}
    >
      {card.imagemPeca && (
        <CardMedia
          component="img"
          height="140"
          image={card.imagemPeca}
          alt={card.nomePeca}
          sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
        />
      )}
      
      <CardContent>
        <Typography variant="h6" component="div" noWrap>
          {card.titulo}
        </Typography>
        
        <Chip 
          label={card.status} 
          size="small" 
          sx={{ 
            bgcolor: getStatusColor(card.status),
            color: 'white',
            my: 1
          }} 
        />
        
        <Typography variant="body2" color="text.secondary" noWrap>
          {card.nomePeca} - {card.marca} {card.modelo}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {formatDate(card.dataSolicitacao)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {card.nomeSolicitante} ({card.setorSolicitacao})
          </Typography>
        </Box>
        
        {card.prazoEntrega && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Prazo: {formatDate(card.prazoEntrega)}
            </Typography>
          </Box>
        )}
        
        {card.valorPeca > 0 && (
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Valor: {formatCurrency(card.valorPeca)}
            </Typography>
            <Chip 
              label={card.lucrativo ? 'Lucrativo' : 'Não lucrativo'} 
              size="small" 
              color={card.lucrativo ? 'success' : 'error'}
              sx={{ height: 20, fontSize: '0.6rem' }}
            />
          </Box>
        )}
      </CardContent>
      
      {card.status !== 'Finalizado' && (
        <CardActions>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleMoveCard}
            fullWidth
          >
            Avançar
          </Button>
        </CardActions>
      )}
    </MuiCard>
  );
};

export default CardItem;
