// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicClientApplication, AuthenticationResult, AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../auth/msalConfig';

// Inicializar MSAL
const msalInstance = new PublicClientApplication(msalConfig);

// Tipo para o contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  login: () => Promise<void>;
  logout: () => void;
  getToken: () => Promise<string>;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Props para o provedor
interface AuthProviderProps {
  children: ReactNode;
}

// Provedor do contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AccountInfo | null>(null);

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      setIsAuthenticated(true);
      setUser(accounts[0]);
    }
  }, []);

  // Função para login
  const login = async (): Promise<void> => {
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      if (response) {
        setIsAuthenticated(true);
        setUser(response.account);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  // Função para logout
  const logout = (): void => {
    msalInstance.logoutPopup({
      postLogoutRedirectUri: window.location.origin,
    });
    setIsAuthenticated(false);
    setUser(null);
  };

  // Função para obter token
  const getToken = async (): Promise<string> => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error('Nenhuma conta encontrada');
    }

    try {
      const response: AuthenticationResult = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Interação necessária, solicitar login novamente
        const response = await msalInstance.acquireTokenPopup(loginRequest);
        return response.accessToken;
      }
      throw error;
    }
  };

  // Valor do contexto
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    getToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
