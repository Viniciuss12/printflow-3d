import React, { useState } from 'react';
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
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCardContext } from '../contexts/CardContext';
import { Card, CardStatus } from '../types/Card';
import ImageUpload from '../components/common/ImageUpload';
import { formatDate } from '../utils/formatters';

// Array de status possíveis
const statusOptions: CardStatus[] = [
  'Solicitado',
  'Aprovado',
  'Fila de Produção',
  'Em Produção',
  'Finalizado'
];

const NewCard: React.FC = () => {
  const navigate = useNavigate();
  const { createCard } = useCardContext();
  
  // Estados para os dados do formulário
  const [formData, setFormData] = useState<Partial<Card>>({
    title: '',
    status: 'Solicitado',
    requestDate: new Date(),
    requesterName: '',
    department: '',
    brand: '',
    model: '',
    partName: '',
    partDescription: '',
    quantity: 1,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de hoje
    partValue: undefined,
  });
  
  // Estados para as imagens
  const [partImage, setPartImage] = useState<File | null>(null);
  const [applicationImage, setApplicationImage] = useState<File | null>(null);
  
  // Estados para UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Função para atualizar campo do formulário
  const handleFieldChange = (field: keyof Card, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando ele for alterado
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Função para validar o formulário
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      errors.title = 'O título é obrigatório';
    }
    
    if (!formData.requesterName?.trim()) {
      errors.requesterName = 'O nome do solicitante é obrigatório';
    }
    
    if (!formData.department?.trim()) {
      errors.department = 'O setor de solicitação é obrigatório';
    }
    
    if (!formData.brand?.trim()) {
      errors.brand = 'A marca é obrigatória';
    }
    
    if (!formData.model?.trim()) {
      errors.model = 'O modelo é obrigatório';
    }
    
    if (!formData.partName?.trim()) {
      errors.partName = 'O nome da peça é obrigatório';
    }
    
    if (!formData.partDescription?.trim()) {
      errors.partDescription = 'A descrição da peça é obrigatória';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = 'A quantidade deve ser maior que zero';
    }
    
    if (!formData.deadline) {
      errors.deadline = 'O prazo de entrega é obrigatório';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Por favor, corrija os erros no formulário antes de enviar.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Processar imagens (em um sistema real, isso enviaria para o SharePoint)
      let partImageUrl = '';
      let applicationImageUrl = '';
      
      if (partImage) {
        // Simulação de upload - em um sistema real, isso enviaria para o SharePoint
        partImageUrl = URL.createObjectURL(partImage);
      }
      
      if (applicationImage) {
        // Simulação de upload - em um sistema real, isso enviaria para o SharePoint
        applicationImageUrl = URL.createObjectURL(applicationImage);
      }
      
      // Criar o card
      const newCard = await createCard({
        ...formData,
        partImageUrl,
        applicationImageUrl
      } as Card);
      
      // Redirecionar para a página de detalhes do card
      navigate(`/cards/${newCard.id}`);
    } catch (err) {
      console.error('Erro ao criar solicitação:', err);
      setError('Não foi possível criar a solicitação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Nova Solicitação de Impressão 3D
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Título da Solicitação"
                fullWidth
                value={formData.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                error={!!formErrors.title}
                helperText={formErrors.title}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" gutterBottom>
                Informações do Solicitante
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Nome do Solicitante"
                fullWidth
                value={formData.requesterName || ''}
                onChange={(e) => handleFieldChange('requesterName', e.target.value)}
                error={!!formErrors.requesterName}
                helperText={formErrors.requesterName}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Setor de Solicitação"
                fullWidth
                value={formData.department || ''}
                onChange={(e) => handleFieldChange('department', e.target.value)}
                error={!!formErrors.department}
                helperText={formErrors.department}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" gutterBottom>
                Detalhes da Peça
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Marca"
                fullWidth
                value={formData.brand || ''}
                onChange={(e) => handleFieldChange('brand', e.target.value)}
                error={!!formErrors.brand}
                helperText={formErrors.brand}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Modelo"
                fullWidth
                value={formData.model || ''}
                onChange={(e) => handleFieldChange('model', e.target.value)}
                error={!!formErrors.model}
                helperText={formErrors.model}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Nome da Peça"
                fullWidth
                value={formData.partName || ''}
                onChange={(e) => handleFieldChange('partName', e.target.value)}
                error={!!formErrors.partName}
                helperText={formErrors.partName}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Quantidade"
                type="number"
                fullWidth
                value={formData.quantity || ''}
                onChange={(e) => handleFieldChange('quantity', Number(e.target.value))}
                error={!!formErrors.quantity}
                helperText={formErrors.quantity}
                disabled={loading}
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Descrição da Peça"
                fullWidth
                multiline
                rows={4}
                value={formData.partDescription || ''}
                onChange={(e) => handleFieldChange('partDescription', e.target.value)}
                error={!!formErrors.partDescription}
                helperText={formErrors.partDescription}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Valor da Peça Original"
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
                value={formData.partValue || ''}
                onChange={(e) => handleFieldChange('partValue', e.target.value === '' ? undefined : Number(e.target.value))}
                disabled={loading}
                helperText="Opcional - Informar para análise de custo-benefício"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Prazo de Entrega"
                type="date"
                fullWidth
                value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
                onChange={(e) => handleFieldChange('deadline', new Date(e.target.value))}
                error={!!formErrors.deadline}
                helperText={formErrors.deadline || 'Data limite para entrega da peça'}
                InputLabelProps={{ shrink: true }}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" gutterBottom>
                Imagens
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <ImageUpload
                label="Imagem da Peça"
                onImageSelected={setPartImage}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <ImageUpload
                label="Imagem do Local de Aplicação"
                onImageSelected={setApplicationImage}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Criar Solicitação'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default NewCard;
