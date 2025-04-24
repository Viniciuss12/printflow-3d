// src/pages/LoginPage.tsx
import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionar para o dashboard se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogin = async () => {
    try {
      await login();
      // O redirecionamento será feito pelo useEffect quando isAuthenticated mudar
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            PrintFlow 3D
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Sistema de Gerenciamento de Fila de Impressão 3D
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            sx={{ mt: 2 }}
            fullWidth
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Entrar com Microsoft'
            )}
          </Button>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Fase 2 - Autenticação Microsoft
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
