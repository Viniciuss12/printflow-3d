// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { msalConfig } from './auth/msalConfig';
import { AuthProvider } from './contexts/AuthContext';
import { CardProvider } from './contexts/CardContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NewCard from './pages/NewCard';
import CardDetails from './pages/CardDetails';
import AllCards from './pages/AllCards';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Inicializar MSAL
const msalInstance = new PublicClientApplication(msalConfig);

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
                {/* Rota pública - Login */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Rotas protegidas - Requerem autenticação */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/cards/novo" element={<NewCard />} />
                  <Route path="/cards/:id" element={<CardDetails />} />
                  <Route path="/cards" element={<AllCards />} />
                  <Route path="/relatorios" element={<Reports />} />
                  <Route path="/configuracoes" element={<Settings />} />
                </Route>
                
                {/* Redirecionar raiz para dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Página 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </CardProvider>
        </AuthProvider>
      </MsalProvider>
    </ThemeProvider>
  );
}

export default App;
