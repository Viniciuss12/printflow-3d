import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useCardContext } from '../contexts/CardContext';
import { Card, CardStatus } from '../types/Card';
import ImageUpload from './ImageUpload';

interface NewCardFormProps {
  onClose: () => void;
}

const NewCardForm: React.FC<NewCardFormProps> = ({ onClose }) => {
  const { addCard } = useCardContext();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Estado do formulário
  const [titulo, setTitulo] = React.useState('');
  const [nomeSolicitante, setNomeSolicitante] = React.useState('');
  const [setorSolicitacao, setSetorSolicitacao] = React.useState('');
  const [marca, setMarca] = React.useState('');
  const [modelo, setModelo] = React.useState('');
  const [nomePeca, setNomePeca] = React.useState('');
  const [descricaoPeca, setDescricaoPeca] = React.useState('');
  const [quantidade, setQuantidade] = React.useState(1);
  const [prazoEntrega, setPrazoEntrega] = React.useState<Date | null>(null);
  const [valorPeca, setValorPeca] = React.useState(0);
  const [custoImpressao, setCustoImpressao] = React.useState(0);
  const [imagemPeca, setImagemPeca] = React.useState<string | undefined>(undefined);
  const [imagemAplicacao, setImagemAplicacao] = React.useState<string | undefined>(undefined);
  
  // Validação
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!titulo) newErrors.titulo = 'Título é obrigatório';
    if (!nomeSolicitante) newErrors.nomeSolicitante = 'Nome do solicitante é obrigatório';
    if (!setorSolicitacao) newErrors.setorSolicitacao = 'Setor é obrigatório';
    if (!nomePeca) newErrors.nomePeca = 'Nome da peça é obrigatório';
    if (quantidade <= 0) newErrors.quantidade = 'Quantidade deve ser maior que zero';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Calcular ganho/prejuízo e lucratividade
      const ganhoPrejuizo = valorPeca - custoImpressao;
      const lucrativo = ganhoPrejuizo > 0;
      
      const newCard: Omit<Card, 'id'> = {
        titulo,
        status: 'Solicitado' as CardStatus,
        dataSolicitacao: new Date(),
        nomeSolicitante,
        setorSolicitacao,
        marca,
        modelo,
        nomePeca,
        descricaoPeca,
        quantidade,
        prazoEntrega,
        imagemPeca,
        imagemAplicacao,
        valorPeca,
        custoImpressao,
        ganhoPrejuizo,
        lucrativo
      };
      
      await addCard(newCard);
      onClose();
    } catch (err: any) {
      console.error('Erro ao adicionar solicitação:', err);
      setError('Falha ao adicionar solicitação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Nova Solicitação de Impressão 3D
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {/* Informações básicas */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Título da Solicitação"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              error={!!errors.titulo}
              helperText={errors.titulo}
              margin="normal"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome do Solicitante"
              value={nomeSolicitante}
              onChange={(e) => setNomeSolicitante(e.target.value)}
              error={!!errors.nomeSolicitante}
              helperText={errors.nomeSolicitante}
              margin="normal"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Setor"
              value={setorSolicitacao}
              onChange={(e) => setSetorSolicitacao(e.target.value)}
              error={!!errors.setorSolicitacao}
              helperText={errors.setorSolicitacao}
              margin="normal"
              required
            />
          </Grid>
          
          {/* Informações da peça */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome da Peça"
              value={nomePeca}
              onChange={(e) => setNomePeca(e.target.value)}
              error={!!errors.nomePeca}
              helperText={errors.nomePeca}
              margin="normal"
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição da Peça"
              value={descricaoPeca}
              onChange={(e) => setDescricaoPeca(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Quantidade"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 0)}
              error={!!errors.quantidade}
              helperText={errors.quantidade}
              margin="normal"
              required
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Prazo de Entrega"
                value={prazoEntrega}
                onChange={(date) => setPrazoEntrega(date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal'
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* Informações financeiras */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Valor da Peça (R$)"
              type="number"
              value={valorPeca}
              onChange={(e) => setValorPeca(parseFloat(e.target.value) || 0)}
              margin="normal"
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Custo de Impressão (R$)"
              type="number"
              value={custoImpressao}
              onChange={(e) => setCustoImpressao(parseFloat(e.target.value) || 0)}
              margin="normal"
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />
          </Grid>
          
          {/* Upload de imagens */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Imagem da Peça
            </Typography>
            <ImageUpload
              imageUrl={imagemPeca}
              onImageUpload={setImagemPeca}
              imageType="peca"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Imagem da Aplicação
            </Typography>
            <ImageUpload
              imageUrl={imagemAplicacao}
              onImageUpload={setImagemAplicacao}
              imageType="aplicacao"
            />
          </Grid>
          
          {/* Botões de ação */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={onClose}
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
                {loading ? <CircularProgress size={24} /> : 'Salvar'}
              </Button>
            </Box>
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default NewCardForm;
