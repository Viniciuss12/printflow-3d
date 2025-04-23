import React from 'react';
import { Box, Typography, Paper, Grid, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from '../contexts/CardContext';
import { formatDate } from '../utils/formatters';

const AllCards = () => {
  const navigate = useNavigate();
  const { cards, loading, error } = useCardContext();

  // Função para navegar para os detalhes do card
  const handleViewDetails = (cardId: string) => {
    navigate(`/cards/${cardId}`);
  };

  // Função para determinar a cor do chip de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizado':
        return 'success';
      case 'Em Produção':
        return 'info';
      case 'Fila de Produção':
        return 'warning';
      case 'Aprovado':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Todas as Solicitações
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/cards/novo')}
        >
          Nova Solicitação
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Erro ao carregar solicitações: {error}
        </Typography>
      )}

      <Grid container spacing={2}>
        {cards.map((card) => {
          return (
            <React.Fragment key={card.id}>
              <Grid item xs={12}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                  onClick={() => handleViewDetails(card.id)}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">{card.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.partName} - {card.brand} {card.model}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Typography variant="body2" color="text.secondary">Solicitante</Typography>
                      <Typography variant="body2">{card.requesterName}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Typography variant="body2" color="text.secondary">Data</Typography>
                      <Typography variant="body2">{formatDate(card.requestDate)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                      <Chip 
                        label={card.status} 
                        color={getStatusColor(card.status) as any}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </React.Fragment>
          );
        })}

        {!loading && cards.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                Nenhuma solicitação encontrada.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AllCards;
