// src/pages/CardDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Divider, 
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useCardContext } from '../contexts/CardContext';
import ImageUpload from '../components/ImageUpload';

const CardDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCardById, updateCard, moveCard, loading, error } = useCardContext();
  const [card, setCard] = useState(id ? getCardById(id) : undefined);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Campos editáveis
  const [editedValues, setEditedValues] = useState({
    titulo: '',
    nomeSolicitante: '',
    setorSolicitacao: '',
    marca: '',
    modelo: '',
    nomePeca: '',
    descricaoPeca: '',
    quantidade: 0,
    prazoEntrega: null as Date | null,
    valorPeca: 0,
    custoImpressao: 0,
    lucrativo: false
  });
  
  // Atualizar card quando mudar o ID ou quando os cards forem atualizados
  useEffect(() => {
    if (id) {
      const currentCard = getCardById(id);
      setCard(currentCard);
      
      if (currentCard) {
        setEditedValues({
          titulo: currentCard.titulo,
          nomeSolicitante: currentCard.nomeSolicitante,
          setorSolicitacao: currentCard.setorSolicitacao,
          marca: currentCard.marca,
          modelo: currentCard.modelo,
          nomePeca: currentCard.nomePeca,
          descricaoPeca: currentCard.descricaoPeca,
          quantidade: currentCard.quantidade,
          prazoEntrega: currentCard.prazoEntrega,
          valorPeca: currentCard.valorPeca,
          custoImpressao: currentCard.custoImpressao,
          lucrativo: currentCard.lucrativo
        });
      }
    }
  }, [id, getCardById]);
  
  // Calcular ganho/prejuízo
  const calcularGanhoPrejuizo = (): number => {
    return editedValues.valorPeca - editedValues.custoImpressao;
  };
  
  // Atualizar lucratividade quando os valores mudarem
  useEffect(() => {
    const ganhoPrejuizo = calcularGanhoPrejuizo();
    setEditedValues(prev => ({
      ...prev,
      lucrativo: ganhoPrejuizo > 0
    }));
  }, [editedValues.valorPeca, editedValues.custoImpressao]);
  
  // Função para formatar data
  const formatDate = (date: Date | null) => {
    if (!date) return 'Não definido';
    return date.toLocaleDateString('pt-BR');
  };
  
  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Voltar para o dashboard
  const handleBack = () => {
    navigate('/');
  };
  
  // Avançar o status do card
  const handleMoveCard = async () => {
    if (id) {
      setUpdating(true);
      setUpdateError(null);
      
      try {
        await moveCard(id);
        // Atualizar card local após mover
        setCard(getCardById(id));
      } catch (error) {
        console.error('Erro ao mover card:', error);
        setUpdateError('Não foi possível atualizar o status da solicitação.');
      } finally {
        setUpdating(false);
      }
    }
  };
  
  // Manipular upload de imagem da peça
  const handlePartImageUploaded = async (imageUrl: string) => {
    if (id && card) {
      setUpdating(true);
      setUpdateError(null);
      
      try {
        const updatedCard = await updateCard(id, { imagemPeca: imageUrl });
        setCard(updatedCard);
      } catch (error) {
        console.error('Erro ao atualizar imagem da peça:', error);
        setUpdateError('Não foi possível atualizar a imagem da peça.');
      } finally {
        setUpdating(false);
      }
    }
  };
  
  // Manipular upload de imagem da aplicação
  const handleApplicationImageUploaded = async (imageUrl: string) => {
    if (id && card) {
      setUpdating(true);
      setUpdateError(null);
      
      try {
        const updatedCard = await updateCard(id, { imagemAplicacao: imageUrl });
        setCard(updatedCard);
      } catch (error) {
        console.error('Erro ao atualizar imagem da aplicação:', error);
        setUpdateError('Não foi possível atualizar a imagem da aplicação.');
      } finally {
        setUpdating(false);
      }
    }
  };
  
  // Função auxiliar para compatibilidade com a interface ImageUploadProps
  const handleImageUpload = (url: string | undefined) => {
    // Esta função é necessária para compatibilidade com a interface ImageUploadProps
    // mas não será usada diretamente, pois estamos usando onImageUploaded
  };
  
  // Alternar modo de edição
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  // Salvar alterações
  const handleSaveChanges = async () => {
    if (id && card) {
      setUpdating(true);
      setUpdateError(null);
      
      try {
        const updatedCard = await updateCard(id, {
          titulo: editedValues.titulo,
          nomeSolicitante: editedValues.nomeSolicitante,
          setorSolicitacao: editedValues.setorSolicitacao,
          marca: editedValues.marca,
          modelo: editedValues.modelo,
          nomePeca: editedValues.nomePeca,
          descricaoPeca: editedValues.descricaoPeca,
          quantidade: editedValues.quantidade,
          prazoEntrega: editedValues.prazoEntrega,
          valorPeca: editedValues.valorPeca,
          custoImpressao: editedValues.custoImpressao,
          ganhoPrejuizo: calcularGanhoPrejuizo(),
          lucrativo: editedValues.lucrativo
        });
        
        setCard(updatedCard);
        setEditMode(false);
      } catch (error) {
        console.error('Erro ao atualizar solicitação:', error);
        setUpdateError('Não foi possível atualizar a solicitação.');
      } finally {
        setUpdating(false);
      }
    }
  };
  
  // Manipular mudanças nos campos
  const handleChange = (field: string, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
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
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
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
        <Box>
          <Button 
            variant="outlined" 
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Voltar
          </Button>
          
          {!editMode && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={toggleEditMode}
            >
              Editar
            </Button>
          )}
        </Box>
      </Box>
      
      {updateError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {updateError}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        {editMode ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Título"
                value={editedValues.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome do Solicitante"
                value={editedValues.nomeSolicitante}
                onChange={(e) => handleChange('nomeSolicitante', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Setor de Solicitação"
                value={editedValues.setorSolicitacao}
                onChange={(e) => handleChange('setorSolicitacao', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Marca"
                value={editedValues.marca}
                onChange={(e) => handleChange('marca', e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Modelo"
                value={editedValues.modelo}
                onChange={(e) => handleChange('modelo', e.target.value)}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nome da Peça"
                value={editedValues.nomePeca}
                onChange={(e) => handleChange('nomePeca', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                label="Quantidade"
                value={editedValues.quantidade}
                onChange={(e) => handleChange('quantidade', parseInt(e.target.value) || 0)}
                fullWidth
                type="number"
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Descrição da Peça"
                value={editedValues.descricaoPeca}
                onChange={(e) => handleChange('descricaoPeca', e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Prazo de Entrega"
                  value={editedValues.prazoEntrega}
                  onChange={(newValue) => handleChange('prazoEntrega', newValue)}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Informações Financeiras
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor da Peça"
                value={editedValues.valorPeca}
                onChange={(e) => handleChange('valorPeca', parseFloat(e.target.value) || 0)}
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Custo de Impressão"
                value={editedValues.custoImpressao}
                onChange={(e) => handleChange('custoImpressao', parseFloat(e.target.value) || 0)}
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ganho/Prejuízo"
                value={calcularGanhoPrejuizo().toFixed(2)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  readOnly: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editedValues.lucrativo}
                    onChange={(e) => handleChange('lucrativo', e.target.checked)}
                    color="success"
                  />
                }
                label="Lucrativo"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={toggleEditMode}
                  sx={{ mr: 1 }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSaveChanges}
                  disabled={updating}
                >
                  {updating ? <CircularProgress size={24} /> : 'Salvar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              {card.titulo}
            </Typography>
            
            <Chip 
              label={card.status} 
              sx={{ 
                bgcolor: getStatusColor(card.status),
                color: 'white',
                mb: 3
              }} 
            />
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Nome do Solicitante</Typography>
                <Typography variant="body1" gutterBottom>{card.nomeSolicitante}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Setor</Typography>
                <Typography variant="body1" gutterBottom>{card.setorSolicitacao}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Data de Solicitação</Typography>
                <Typography variant="body1" gutterBottom>{formatDate(card.dataSolicitacao)}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Prazo de Entrega</Typography>
                <Typography variant="body1" gutterBottom>{formatDate(card.prazoEntrega)}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Informações da Peça</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Nome da Peça</Typography>
                <Typography variant="body1" gutterBottom>{card.nomePeca}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Quantidade</Typography>
                <Typography variant="body1" gutterBottom>{card.quantidade}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Marca</Typography>
                <Typography variant="body1" gutterBottom>{card.marca || 'Não especificado'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Modelo</Typography>
                <Typography variant="body1" gutterBottom>{card.modelo || 'Não especificado'}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2">Descrição da Peça</Typography>
                <Typography variant="body1" gutterBottom>{card.descricaoPeca || 'Sem descrição'}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Informações Financeiras</Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2">Valor da Peça</Typography>
                <Typography variant="body1" gutterBottom>{formatCurrency(card.valorPeca)}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2">Custo de Impressão</Typography>
                <Typography variant="body1" gutterBottom>{formatCurrency(card.custoImpressao)}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2">Ganho/Prejuízo</Typography>
                <Typography 
                  variant="body1" 
                  gutterBottom
                  color={card.lucrativo ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(card.ganhoPrejuizo)}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Imagens</Typography>
              </Grid>
            </Grid>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Imagem da Peça</Typography>
                <ImageUpload 
                  label="Imagem da Peça" 
                  onImageUploaded={handlePartImageUploaded}
                  currentImageUrl={card.imagemPeca}
                  onImageUpload={handleImageUpload}
                  imageType="peca"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Imagem da Aplicação</Typography>
                <ImageUpload 
                  label="Imagem da Aplicação" 
                  onImageUploaded={handleApplicationImageUploaded}
                  currentImageUrl={card.imagemAplicacao}
                  onImageUpload={handleImageUpload}
                  imageType="aplicacao"
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            {card.status !== 'Finalizado' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleMoveCard}
                  disabled={updating}
                >
                  {updating ? <CircularProgress size={24} /> : 'Avançar Status'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CardDetails;
