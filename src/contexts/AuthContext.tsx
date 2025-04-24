// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AuthenticationResult, 
  AccountInfo, 
  InteractionRequiredAuthError,
  SilentRequest
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../auth/msalConfig';

// Interface para o contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
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
  const { instance, accounts, inProgress } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário já está autenticado ao carregar a aplicação
  useEffect(() => {
    if (accounts.length > 0) {
      setIsAuthenticated(true);
      setUser(accounts[0]);
    }
    setLoading(false);
  }, [accounts]);

  // Função de login
  const login = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await instance.loginPopup(loginRequest);
      if (response) {
        setIsAuthenticated(true);
        setUser(response.account);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Não foi possível fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      await instance.logoutPopup({
        postLogoutRedirectUri: window.location.origin,
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para obter token
  const getToken = async (): Promise<string> => {
    try {
      if (accounts.length === 0) {
        throw new Error('Nenhum usuário autenticado');
      }
      
      const silentRequest: SilentRequest = {
        scopes: loginRequest.scopes,
        account: accounts[0],
      };
      
      const response = await instance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Token expirado, precisa de interação do usuário
        const response = await instance.acquireTokenPopup(loginRequest);
        return response.accessToken;
      }
      console.error('Erro ao obter token:', error);
      throw error;
    }
  };

  // Valor do contexto
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    error,
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

export default AuthContext;
