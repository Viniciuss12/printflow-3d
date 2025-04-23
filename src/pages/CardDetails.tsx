import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCardContext } from '../contexts/CardContext';
import { Card, CardStatus } from '../types/Card';
import { formatDate, formatCurrency } from '../utils/formatters';

// Array de status possíveis
const statusOptions: CardStatus[] = [
  'Solicitado',
  'Aprovado',
  'Fila de Produção',
  'Em Produção',
  'Finalizado'
];

const CardDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCardById, updateCard } = useCardContext();
  
  // Estados para os dados do card
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para edição
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<Partial<Card>>({});
  
  // Estado para abas
  const [tabValue, setTabValue] = useState(0);
  
  // Carregar dados do card
  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const cardData = await getCardById(id);
        setCard(cardData);
        setEditedCard(cardData);
      } catch (error) {
        console.error('Erro ao carregar detalhes do card:', error);
        setError('Não foi possível carregar os detalhes da solicitação.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCard();
  }, [id, getCardById]);
  
  // Função para alternar modo de edição
  const toggleEditMode = () => {
    if (isEditing) {
      // Cancelar edição
      setEditedCard(card || {});
    }
    setIsEditing(!isEditing);
  };
  
  // Função para atualizar campo do card em edição
  const handleFieldChange = (field: keyof Card, value: any) => {
    setEditedCard(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Função para salvar alterações
  const handleSave = async () => {
    if (!id || !card) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Calcular ganho/prejuízo se temos os valores necessários
      let updatedData = { ...editedCard };
      
      if (
        (editedCard.partValue !== undefined || editedCard.printingCost !== undefined) &&
        card.status === 'Finalizado'
      ) {
        const partValue = editedCard.partValue !== undefined ? editedCard.partValue : card.partValue;
        const printingCost = editedCard.printingCost !== undefined ? editedCard.printingCost : card.printingCost;
        
        if (partValue !== undefined && printingCost !== undefined) {
          updatedData.profitLoss = partValue - printingCost;
          updatedData.isProfitable = updatedData.profitLoss > 0;
        }
      }
      
      const updatedCard = await updateCard(id, updatedData);
      setCard(updatedCard);
      setEditedCard(updatedCard);
      setIsEditing(false);
      setSuccess('Solicitação atualizada com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
      setError('Não foi possível atualizar a solicitação. Por favor, tente novamente.');
    } finally {
      setSaving(false);
    }
  };
  
  // Função para lidar com mudança de aba
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Renderizar estado de carregamento
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Renderizar mensagem de erro
  if (error || !card) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">
          {error || 'Solicitação não encontrada.'}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/dashboard')}
        >
          Voltar para Dashboard
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Detalhes da Solicitação
        </Typography>
        
        <Box>
          <Button
            variant={isEditing ? "outlined" : "contained"}
            color={isEditing ? "secondary" : "primary"}
            onClick={toggleEditMode}
            sx={{ mr: 1 }}
            disabled={saving}
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
          
          {isEditing && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          )}
        </Box>
      </Box>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Informações Gerais" />
            <Tab label="Detalhes da Peça" />
            {card.status === 'Finalizado' && <Tab label="Análise de Custo" />}
          </Tabs>
        </Box>
        
        {/* Aba de Informações Gerais */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {isEditing ? (
                <TextField
                  label="Título"
                  fullWidth
                  value={editedCard.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Título</Typography>
                  <Typography variant="h6" gutterBottom>{card.title}</Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              {isEditing ? (
                <FormControl fullWidth disabled={saving}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editedCard.status || card.status}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                    label="Status"
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={card.status} 
                    color={
                      card.status === 'Finalizado' ? 'success' :
                      card.status === 'Em Produção' ? 'info' :
                      card.status === 'Fila de Produção' ? 'warning' :
                      card.status === 'Aprovado' ? 'primary' : 'default'
                    }
                  />
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Data da Solicitação</Typography>
              <Typography variant="body1">{formatDate(card.requestDate)}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {isEditing ? (
                <TextField
                  label="Prazo de Entrega"
                  type="date"
                  fullWidth
                  value={editedCard.deadline ? new Date(editedCard.deadline).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('deadline', new Date(e.target.value))}
                  InputLabelProps={{ shrink: true }}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Prazo de Entrega</Typography>
                  <Typography variant="body1">{formatDate(card.deadline)}</Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Informações do Solicitante</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {isEditing ? (
                <TextField
                  label="Nome do Solicitante"
                  fullWidth
                  value={editedCard.requesterName || ''}
                  onChange={(e) => handleFieldChange('requesterName', e.target.value)}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Nome do Solicitante</Typography>
                  <Typography variant="body1">{card.requesterName}</Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {isEditing ? (
                <TextField
                  label="Setor de Solicitação"
                  fullWidth
                  value={editedCard.department || ''}
                  onChange={(e) => handleFieldChange('department', e.target.value)}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Setor de Solicitação</Typography>
                  <Typography variant="body1">{card.department}</Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary">Criado por</Typography>
              <Typography variant="body1">{card.createdBy} em {formatDate(card.createdAt)}</Typography>
              
              {card.modifiedBy && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Última modificação</Typography>
                  <Typography variant="body1">{card.modifiedBy} em {formatDate(card.modifiedAt)}</Typography>
                </>
              )}
            </Grid>
          </Grid>
        )}
        
        {/* Aba de Detalhes da Peça */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {isEditing ? (
                <TextField
                  label="Marca"
                  fullWidth
                  value={editedCard.brand || ''}
                  onChange={(e) => handleFieldChange('brand', e.target.value)}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Marca</Typography>
                  <Typography variant="body1">{card.brand}</Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {isEditing ? (
                <TextField
                  label="Modelo"
                  fullWidth
                  value={editedCard.model || ''}
                  onChange={(e) => handleFieldChange('model', e.target.value)}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Modelo</Typography>
                  <Typography variant="body1">{card.model}</Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {isEditing ? (
                <TextField
                  label="Nome da Peça"
                  fullWidth
                  value={editedCard.partName || ''}
                  onChange={(e) => handleFieldChange('partName', e.target.value)}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Nome da Peça</Typography>
                  <Typography variant="body1">{card.partName}</Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {isEditing ? (
                <TextField
                  label="Quantidade"
                  type="number"
                  fullWidth
                  value={editedCard.quantity || ''}
                  onChange={(e) => handleFieldChange('quantity', Number(e.target.value))}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Quantidade</Typography>
                  <Typography variant="body1">{card.quantity}</Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12}>
              {isEditing ? (
                <TextField
                  label="Descrição da Peça"
                  fullWidth
                  multiline
                  rows={4}
                  value={editedCard.partDescription || ''}
                  onChange={(e) => handleFieldChange('partDescription', e.target.value)}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Descrição da Peça</Typography>
                  <Typography variant="body1">{card.partDescription}</Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {isEditing ? (
                <TextField
                  label="Valor da Peça Original"
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  value={editedCard.partValue || ''}
                  onChange={(e) => handleFieldChange('partValue', e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Valor da Peça Original</Typography>
                  <Typography variant="body1">
                    {card.partValue !== undefined ? formatCurrency(card.partValue) : 'Não informado'}
                  </Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Imagens</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Imagem da Peça</Typography>
              {card.partImageUrl ? (
                <Box sx={{ mt: 1 }}>
                  <img 
                    src={card.partImageUrl} 
                    alt="Imagem da peça" 
                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} 
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">Nenhuma imagem disponível</Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Imagem do Local de Aplicação</Typography>
              {card.applicationImageUrl ? (
                <Box sx={{ mt: 1 }}>
                  <img 
                    src={card.applicationImageUrl} 
                    alt="Imagem do local de aplicação" 
                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} 
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">Nenhuma imagem disponível</Typography>
              )}
            </Grid>
          </Grid>
        )}
        
        {/* Aba de Análise de Custo (apenas para status Finalizado) */}
        {tabValue === 2 && card.status === 'Finalizado' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Esta análise compara o custo da impressão 3D com o valor da peça original para determinar a economia ou prejuízo.
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Valor da Peça Original</Typography>
              <Typography variant="h6">
                {card.partValue !== undefined ? formatCurrency(card.partValue) : 'Não informado'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {isEditing ? (
                <TextField
                  label="Custo da Impressão 3D"
                  type="number"
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  value={editedCard.printingCost || ''}
                  onChange={(e) => handleFieldChange('printingCost', e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={saving}
                />
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Custo da Impressão 3D</Typography>
                  <Typography variant="h6">
                    {card.printingCost !== undefined ? formatCurrency(card.printingCost) : 'Não informado'}
                  </Typography>
                </>
              )}
            </Grid>
            
            {card.partValue !== undefined && card.printingCost !== undefined && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Ganho/Prejuízo</Typography>
                  <Typography 
                    variant="h5"
                    color={card.isProfitable ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(card.profitLoss || 0)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Resultado</Typography>
                  <Chip 
                    label={card.isProfitable ? 'Economia' : 'Prejuízo'} 
                    color={card.isProfitable ? 'success' : 'error'}
                    sx={{ fontSize: '1rem', py: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Alert severity={card.isProfitable ? 'success' : 'warning'} sx={{ mt: 2 }}>
                    {card.isProfitable 
                      ? `A impressão 3D gerou uma economia de ${formatCurrency(card.profitLoss || 0)} em relação ao valor da peça original.`
                      : `A impressão 3D gerou um prejuízo de ${formatCurrency(Math.abs(card.profitLoss || 0))} em relação ao valor da peça original.`
                    }
                  </Alert>
                </Grid>
              </>
            )}
          </Grid>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/dashboard')}
        >
          Voltar para Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default CardDetails;
