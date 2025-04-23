// src/contexts/CardContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, CardStatus } from '../types/Card';
import { sharePointService } from '../services/sharePointService';
import { useAuth } from './AuthContext';

// Interface para o contexto de cards
interface CardContextType {
  cards: Card[];
  loading: boolean;
  error: string | null;
  getCardById: (id: string) => Promise<Card | undefined>;
  createCard: (cardData: Omit<Card, 'id' | 'createdBy' | 'createdAt' | 'modifiedBy' | 'modifiedAt'>) => Promise<Card>;
  updateCard: (id: string, cardData: Partial<Card>) => Promise<Card>;
  updateCardStatus: (id: string, newStatus: CardStatus) => Promise<Card>;
  deleteCard: (id: string) => Promise<void>;
  uploadImage: (file: File, fileName?: string) => Promise<string>;
  refreshCards: () => Promise<void>;
}

// Criar o contexto
const CardContext = createContext<CardContextType | undefined>(undefined);

// Hook para usar o contexto
export const useCardContext = (): CardContextType => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext deve ser usado dentro de um CardProvider');
  }
  return context;
};

// Props para o provedor
interface CardProviderProps {
  children: ReactNode;
}

// Provedor do contexto
export const CardProvider: React.FC<CardProviderProps> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken, isAuthenticated } = useAuth();

  // Carregar cards quando o usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      refreshCards();
    }
  }, [isAuthenticated]);

  // Função para atualizar o token de autenticação
  const updateAuthToken = async (): Promise<void> => {
    try {
      const token = await getToken();
      sharePointService.setAuthToken(token);
    } catch (error) {
      console.error('Erro ao obter token:', error);
      setError('Não foi possível autenticar com o Microsoft Graph. Por favor, faça login novamente.');
    }
  };

  // Função para atualizar a lista de cards
  const refreshCards = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await updateAuthToken();
      const data = await sharePointService.getCards();
      setCards(data);
    } catch (error) {
      console.error('Erro ao carregar cards:', error);
      setError('Não foi possível carregar as solicitações de impressão 3D.');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar um card pelo ID
  const getCardById = async (id: string): Promise<Card | undefined> => {
    try {
      await updateAuthToken();
      return await sharePointService.getCardById(id);
    } catch (error) {
      console.error(`Erro ao buscar card ${id}:`, error);
      setError(`Não foi possível carregar a solicitação com ID ${id}.`);
      return undefined;
    }
  };

  // Função para criar um novo card
  const createCard = async (cardData: Omit<Card, 'id' | 'createdBy' | 'createdAt' | 'modifiedBy' | 'modifiedAt'>): Promise<Card> => {
    try {
      await updateAuthToken();
      const newCard = await sharePointService.createCard(cardData);
      await refreshCards(); // Atualizar a lista após criar
      return newCard;
    } catch (error) {
      console.error('Erro ao criar card:', error);
      setError('Não foi possível criar a solicitação de impressão 3D.');
      throw error;
    }
  };

  // Função para atualizar um card
  const updateCard = async (id: string, cardData: Partial<Card>): Promise<Card> => {
    try {
      await updateAuthToken();
      const updatedCard = await sharePointService.updateCard(id, cardData);
      await refreshCards(); // Atualizar a lista após modificar
      return updatedCard;
    } catch (error) {
      console.error(`Erro ao atualizar card ${id}:`, error);
      setError(`Não foi possível atualizar a solicitação com ID ${id}.`);
      throw error;
    }
  };

  // Função específica para atualizar o status de um card
  const updateCardStatus = async (id: string, newStatus: CardStatus): Promise<Card> => {
    return updateCard(id, { status: newStatus });
  };

  // Função para excluir um card
  const deleteCard = async (id: string): Promise<void> => {
    try {
      await updateAuthToken();
      await sharePointService.deleteCard(id);
      await refreshCards(); // Atualizar a lista após excluir
    } catch (error) {
      console.error(`Erro ao excluir card ${id}:`, error);
      setError(`Não foi possível excluir a solicitação com ID ${id}.`);
      throw error;
    }
  };

  // Função para fazer upload de imagem
  const uploadImage = async (file: File, fileName?: string): Promise<string> => {
    try {
      await updateAuthToken();
      return await sharePointService.uploadImage(file, fileName);
    } catch (error) {
      console.error('Erro ao fazer upload de imagem:', error);
      setError('Não foi possível fazer upload da imagem.');
      throw error;
    }
  };

  // Valor do contexto
  const contextValue: CardContextType = {
    cards,
    loading,
    error,
    getCardById,
    createCard,
    updateCard,
    updateCardStatus,
    deleteCard,
    uploadImage,
    refreshCards,
  };

  return (
    <CardContext.Provider value={contextValue}>
      {children}
    </CardContext.Provider>
  );
};
