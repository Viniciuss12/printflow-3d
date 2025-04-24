// src/pages/CardDetails.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, Divider } from '@mui/material';
import { useCardContext } from '../contexts/CardContext';

const CardDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCardById, moveCard } = useCardContext();
  
  // Obter o card pelo ID
  const card = id ? getCardById(id) : undefined;
  
  // Função para formatar data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };
  
  // Voltar para o dashboard
  const handleBack = () => {
    navigate('/');
  };
  
  // Avançar o status do card
  const handleMoveCard = () => {
    if (id) {
      moveCard(id);
      navigate('/');
    }
  };
  
  if (!card) {
    return (
      <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h5" color="error">
          Solicitação não encontrada
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Detalhes da Solicitação
        </Typography>
        <Button 
          variant="outlined" 
          onClick={handleBack}
        >
          Voltar
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {card.title}
        </Typography>
        
        <Box sx={{ 
          display: 'inline-block', 
          bgcolor: 'primary.main', 
          color: 'white', 
          px: 2, 
          py: 0.5, 
          borderRadius: 1,
          mb: 3
        }}>
          {card.status}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Nome da Peça</Typography>
            <Typography variant="body1" gutterBottom>{card.partName}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Quantidade</Typography>
            <Typography variant="body1" gutterBottom>{card.quantity}</Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2">Descrição</Typography>
            <Typography variant="body1" gutterBottom>{card.description || 'Sem descrição'}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Solicitante</Typography>
            <Typography variant="body1" gutterBottom>{card.requesterName}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Departamento</Typography>
            <Typography variant="body1" gutterBottom>{card.department}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Data da Solicitação</Typography>
            <Typography variant="body1" gutterBottom>{formatDate(card.requestDate)}</Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          {card.status !== 'Finalizado' && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleMoveCard}
            >
              Avançar Status
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CardDetails;
