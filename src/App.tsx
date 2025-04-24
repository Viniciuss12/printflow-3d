// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './auth/msalConfig';
import { AuthProvider } from './contexts/AuthContext';
import { CardProvider } from './contexts/CardContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CardDetails from './pages/CardDetails';

// Inicializar MSAL
const msalInstance = new PublicClientApplication(msalConfig);
// Garantir que o MSAL seja inicializado
msalInstance.initialize().catch(error => {
  console.error("Erro ao inicializar MSAL:", error);
});

// Criar tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <CardProvider>
            <Router>
              <Routes>
                {/* Rota pública para login */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Rotas protegidas que requerem autenticação */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/card/:id" element={
                  <ProtectedRoute>
                    <CardDetails />
                  </ProtectedRoute>
                } />
                
                {/* Redirecionar para login para qualquer rota não encontrada */}
                <Route path="*" element={<LoginPage />} />
              </Routes>
            </Router>
          </CardProvider>
        </AuthProvider>
      </MsalProvider>
    </ThemeProvider>
  );
}

export default App;
