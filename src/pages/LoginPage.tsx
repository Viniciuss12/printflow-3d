// src/pages/LoginPage.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();

  // Se já estiver autenticado, redirecionar para o dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    try {
      await login();
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
          <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Sistema de gerenciamento de fila para impressão 3D
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Entrar com Microsoft
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
