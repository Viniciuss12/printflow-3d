import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Estados para configurações
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [language, setLanguage] = useState('pt-BR');
  
  // Estados para UI
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Função para salvar configurações
  const handleSaveSettings = () => {
    setSaving(true);
    setError(null);
    
    // Simulação de salvamento
    setTimeout(() => {
      setSaving(false);
      setSuccess('Configurações salvas com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1000);
  };
  
  // Funções para diálogo de confirmação
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleClearData = () => {
    setSaving(true);
    
    // Simulação de limpeza de dados
    setTimeout(() => {
      setSaving(false);
      setSuccess('Dados temporários limpos com sucesso!');
      setOpenDialog(false);
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1000);
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configurações
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Preferências de Interface
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Notificações" 
                  secondary="Receber notificações sobre atualizações de solicitações"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label=""
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Idioma" 
                  secondary="Selecione o idioma da interface"
                />
                <TextField
                  select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ width: 120 }}
                >
                  <option value="pt-BR">Português</option>
                  <option value="en-US">English</option>
                  <option value="es">Español</option>
                </TextField>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Salvamento Automático" 
                  secondary="Salvar automaticamente alterações em formulários"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoSaveEnabled}
                      onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label=""
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Salvar Preferências'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Conta e Segurança
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Usuário Conectado" 
                  secondary={user?.name || 'Não autenticado'}
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={logout}
                sx={{ mr: 2 }}
              >
                Sair
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                onClick={handleOpenDialog}
                startIcon={<DeleteIcon />}
              >
                Limpar Dados Temporários
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sobre o PrintFlow 3D
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" paragraph>
              O PrintFlow 3D é um sistema de gerenciamento de fila para impressão 3D com interface de arrastar e soltar.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Versão: 1.0.0
            </Typography>
            
            <Typography variant="body1" paragraph>
              Desenvolvido para: Carbon Blindados
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              © 2025 Todos os direitos reservados
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Diálogo de confirmação para limpar dados */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirmar Limpeza de Dados</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta ação irá limpar todos os dados temporários armazenados localmente. Os dados no SharePoint não serão afetados. Deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleClearData} color="error" autoFocus>
            Limpar Dados
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
