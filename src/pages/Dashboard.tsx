import React from 'react';
import { Box, Typography, Paper, Grid, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from '../contexts/CardContext';
import { formatDate } from '../utils/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const { cards, loading, error, moveCard } = useCardContext();
  
  // Agrupar cards por status
  const cardsByStatus = React.useMemo(() => {
    const statusGroups: Record<string, any[]> = {
      'Solicitado': [],
      'Aprovado': [],
      'Fila de Produção': [],
      'Em Produção': [],
      'Finalizado': []
    };
    
    cards.forEach(card => {
      if (statusGroups[card.status]) {
        statusGroups[card.status].push(card);
      }
    });
    
    return statusGroups;
  }, [cards]);
  
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
          Dashboard
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
        {Object.keys(cardsByStatus).map((status) => {
          return (
            <React.Fragment key={status}>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{status}</Typography>
                    <Chip 
                      label={cardsByStatus[status].length} 
                      color={getStatusColor(status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
                    {cardsByStatus[status].map((card) => {
                      return (
                        <React.Fragment key={card.id}>
                          <Paper 
                            sx={{ 
                              p: 2, 
                              mb: 2,
                              cursor: 'pointer',
                              '&:hover': {
                                boxShadow: 3
                              }
                            }}
                            onClick={() => handleViewDetails(card.id)}
                          >
                            <Typography variant="subtitle1" noWrap>{card.title}</Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
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
                          </Paper>
                        </React.Fragment>
                      );
                    })}
                    
                    {cardsByStatus[status].length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                        Nenhuma solicitação
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Dashboard;
