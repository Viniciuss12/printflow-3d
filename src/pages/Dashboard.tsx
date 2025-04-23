// src/pages/Dashboard.tsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress,
  Button,
  Chip,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useLocation } from 'react-router-dom';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { CardStatus } from '../types/Card';
import CardColumn from '../components/cards/CardColumn';
import { useCardContext } from '../contexts/CardContext';

const Dashboard: React.FC = () => {
  // Aqui usaríamos o contexto de cards, mas como ainda não temos, vamos simular
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado simulado - em uma implementação real, viria do contexto
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cards, setCards] = React.useState([]);
  
  // Status disponíveis no sistema
  const statuses: CardStatus[] = [
    'Solicitado',
    'Aprovado',
    'Fila de Produção',
    'Em Produção',
    'Finalizado'
  ];
  
  // Função simulada para obter cards por status
  const getCardsByStatus = (status: CardStatus) => {
    return cards.filter((card: any) => card.status === status);
  };
  
  // Manipular o arrastar e soltar
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Se não houver destino ou o destino for o mesmo que a origem, não fazer nada
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Atualizar o status do card - em uma implementação real, chamaríamos a API
    const newStatus = destination.droppableId as CardStatus;
    
    console.log(`Movendo card ${draggableId} para status ${newStatus}`);
    
    // Se o status for "Finalizado", redirecionar para a página de detalhes
    if (newStatus === 'Finalizado') {
      navigate(`/cards/${draggableId}?showCostForm=true`);
    }
  };
  
  // Verificar se há mensagem de sucesso na navegação
  const successMessage = location.state?.success;
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/cards/novo')}
        >
          Nova Solicitação
        </Button>
      </Box>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => {
          navigate(location.pathname, { replace: true });
        }}>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={2}>
            {statuses.map((status) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={status}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    height: 'calc(100vh - 280px)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="h6">{status}</Typography>
                    <Chip 
                      label={getCardsByStatus(status).length} 
                      size="small" 
                      color="primary"
                    />
                  </Box>
                  
                  <CardColumn 
                    status={status} 
                    cards={getCardsByStatus(status)} 
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      )}
    </Box>
  );
};

export default Dashboard;
