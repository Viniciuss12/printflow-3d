import React, { useState } from 'react';
import { Box, Typography, Paper, Button, TextField, CircularProgress } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

// Tipos simplificados
export type CardStatus = 'Solicitado' | 'Aprovado' | 'Fila de Produção' | 'Em Produção' | 'Finalizado';

export interface Card {
  id: string;
  title: string;
  status: CardStatus;
  requestDate: Date;
  requesterName: string;
  department: string;
  partName: string;
  description: string;
  quantity: number;
}

// Dados mockados para teste
const mockCards: Card[] = [
  {
    id: '1',
    title: 'Suporte para sensor',
    status: 'Solicitado',
    requestDate: new Date(),
    requesterName: 'João Silva',
    department: 'Engenharia',
    partName: 'Suporte sensor ABS',
    description: 'Suporte para fixação do sensor ABS na suspensão dianteira',
    quantity: 2
  },
  {
    id: '2',
    title: 'Capa de proteção',
    status: 'Aprovado',
    requestDate: new Date(),
    requesterName: 'Maria Oliveira',
    department: 'Produção',
    partName: 'Capa protetora',
    description: 'Capa de proteção para conector elétrico',
    quantity: 10
  },
  {
    id: '3',
    title: 'Espaçador de mola',
    status: 'Fila de Produção',
    requestDate: new Date(),
    requesterName: 'Carlos Santos',
    department: 'Manutenção',
    partName: 'Espaçador 10mm',
    description: 'Espaçador para mola de suspensão traseira',
    quantity: 4
  }
];

// Componente principal
const MinimalApp = () => {
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardRequester, setNewCardRequester] = useState('');
  const [newCardDepartment, setNewCardDepartment] = useState('');
  const [newCardPartName, setNewCardPartName] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardQuantity, setNewCardQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Função para adicionar um novo card
  const handleAddCard = () => {
    if (!newCardTitle || !newCardRequester || !newCardDepartment || !newCardPartName) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    // Simular atraso de rede
    setTimeout(() => {
      const newCard: Card = {
        id: uuidv4(),
        title: newCardTitle,
        status: 'Solicitado',
        requestDate: new Date(),
        requesterName: newCardRequester,
        department: newCardDepartment,
        partName: newCardPartName,
        description: newCardDescription,
        quantity: parseInt(newCardQuantity) || 1
      };

      setCards([...cards, newCard]);
      
      // Limpar formulário
      setNewCardTitle('');
      setNewCardRequester('');
      setNewCardDepartment('');
      setNewCardPartName('');
      setNewCardDescription('');
      setNewCardQuantity('');
      setShowForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  // Função para mover um card para o próximo status
  const handleMoveCard = (cardId: string) => {
    setCards(cards.map(card => {
      if (card.id === cardId) {
        let newStatus: CardStatus = card.status;
        
        switch (card.status) {
          case 'Solicitado':
            newStatus = 'Aprovado';
            break;
          case 'Aprovado':
            newStatus = 'Fila de Produção';
            break;
          case 'Fila de Produção':
            newStatus = 'Em Produção';
            break;
          case 'Em Produção':
            newStatus = 'Finalizado';
            break;
          default:
            break;
        }
        
        return { ...card, status: newStatus };
      }
      return card;
    }));
  };

  // Agrupar cards por status
  const cardsByStatus: Record<CardStatus, Card[]> = {
    'Solicitado': [],
    'Aprovado': [],
    'Fila de Produção': [],
    'Em Produção': [],
    'Finalizado': []
  };

  cards.forEach(card => {
    cardsByStatus[card.status].push(card);
  });

  // Função para formatar data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">PrintFlow 3D</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nova Solicitação'}
        </Button>
      </Box>

      {showForm && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Nova Solicitação</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Título"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Nome do Solicitante"
              value={newCardRequester}
              onChange={(e) => setNewCardRequester(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Departamento"
              value={newCardDepartment}
              onChange={(e) => setNewCardDepartment(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Nome da Peça"
              value={newCardPartName}
              onChange={(e) => setNewCardPartName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Descrição"
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Quantidade"
              value={newCardQuantity}
              onChange={(e) => setNewCardQuantity(e.target.value)}
              fullWidth
              type="number"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddCard}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Salvar'}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {Object.entries(cardsByStatus).map(([status, statusCards]) => (
          <Box key={status} sx={{ width: { xs: '100%', sm: '48%', md: '31%', lg: '19%' }, mb: 2 }}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>{status}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {statusCards.map(card => (
                  <Paper 
                    key={card.id} 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#f5f5f5',
                      '&:hover': { boxShadow: 3 }
                    }}
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
                    {status !== 'Finalizado' && (
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ mt: 1 }}
                        onClick={() => handleMoveCard(card.id)}
                      >
                        Avançar
                      </Button>
                    )}
                  </Paper>
                ))}
                {statusCards.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Nenhuma solicitação
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MinimalApp;
