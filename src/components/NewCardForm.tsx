// src/components/NewCardForm.tsx
import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, CircularProgress } from '@mui/material';
import { useCardContext } from '../contexts/CardContext';

interface NewCardFormProps {
  onCancel: () => void;
}

const NewCardForm: React.FC<NewCardFormProps> = ({ onCancel }) => {
  const { addCard, loading } = useCardContext();
  
  const [title, setTitle] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [department, setDepartment] = useState('');
  const [partName, setPartName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const handleSubmit = () => {
    if (!title || !requesterName || !department || !partName) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    addCard({
      title,
      requesterName,
      department,
      partName,
      description,
      quantity: parseInt(quantity) || 1
    });
    
    // Limpar formulário e fechar
    onCancel();
  };
  
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Nova Solicitação</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Nome do Solicitante"
          value={requesterName}
          onChange={(e) => setRequesterName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Departamento"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Nome da Peça"
          value={partName}
          onChange={(e) => setPartName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          label="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          type="number"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default NewCardForm;
