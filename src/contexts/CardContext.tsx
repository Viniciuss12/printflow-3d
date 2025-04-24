import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, CardStatus } from '../types/Card';
import { sharePointService } from '../services/sharePointService';
import { useAuth } from './AuthContext';

// Interface para o contexto
interface CardContextType {
  cards: Card[];
  loading: boolean;
  error: string | null;
  addCard: (card: Omit<Card, 'id'>) => Promise<Card>;
  updateCard: (id: string, cardData: Partial<Card>) => Promise<Card>;
  deleteCard: (id: string) => Promise<void>;
  moveCard: (id: string) => Promise<Card>;
  getCardById: (id: string) => Card | undefined;
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
  const { isAuthenticated, getToken } = useAuth();

  // Carregar cards ao inicializar
  useEffect(() => {
    const fetchCards = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Obter token de autenticação
        const token = await getToken();
        
        // Configurar o serviço do SharePoint com o token
        sharePointService.setAuthToken(token);
        
        // Obter cards do SharePoint
        const fetchedCards = await sharePointService.getCards();
        setCards(fetchedCards);
      } catch (err: any) {
        console.error('Erro ao carregar cards:', err);
        setError('Não foi possível carregar as solicitações. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [isAuthenticated, getToken]);

  // Obter um card pelo ID
  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  // Adicionar um novo card
  const addCard = async (cardData: Omit<Card, 'id'>): Promise<Card> => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter token de autenticação
      const token = await getToken();
      
      // Configurar o serviço do SharePoint com o token
      sharePointService.setAuthToken(token);
      
      // Criar card no SharePoint
      const newCard = await sharePointService.createCard(cardData);
      
      // Atualizar estado local
      setCards([...cards, newCard]);
      
      return newCard;
    } catch (err: any) {
      console.error('Erro ao adicionar card:', err);
      setError('Não foi possível adicionar a solicitação. Por favor, tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar um card existente
  const updateCard = async (id: string, cardData: Partial<Card>): Promise<Card> => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter token de autenticação
      const token = await getToken();
      
      // Configurar o serviço do SharePoint com o token
      sharePointService.setAuthToken(token);
      
      // Obter o card atual
      const currentCard = cards.find(card => card.id === id);
      if (!currentCard) {
        throw new Error(`Card com ID ${id} não encontrado`);
      }
      
      // Mesclar dados atuais com as atualizações
      const updatedCardData = { ...currentCard, ...cardData };
      
      // Atualizar card no SharePoint
      const updatedCard = await sharePointService.updateCard(updatedCardData);
      
      // Atualizar estado local
      setCards(cards.map(card => card.id === id ? updatedCard : card));
      
      return updatedCard;
    } catch (err: any) {
      console.error('Erro ao atualizar card:', err);
      setError('Não foi possível atualizar a solicitação. Por favor, tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir um card
  const deleteCard = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter token de autenticação
      const token = await getToken();
      
      // Configurar o serviço do SharePoint com o token
      sharePointService.setAuthToken(token);
      
      // Excluir card no SharePoint
      await sharePointService.deleteCard(id);
      
      // Atualizar estado local
      setCards(cards.filter(card => card.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir card:', err);
      setError('Não foi possível excluir a solicitação. Por favor, tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mover um card para o próximo status
  const moveCard = async (id: string): Promise<Card> => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter token de autenticação
      const token = await getToken();
      
      // Configurar o serviço do SharePoint com o token
      sharePointService.setAuthToken(token);
      
      // Obter o card atual
      const currentCard = cards.find(card => card.id === id);
      if (!currentCard) {
        throw new Error(`Card com ID ${id} não encontrado`);
      }
      
      // Determinar o próximo status
      let nextStatus: CardStatus = currentCard.status;
      switch (currentCard.status) {
        case 'Solicitado':
          nextStatus = 'Aprovado';
          break;
        case 'Aprovado':
          nextStatus = 'Fila de Produção';
          break;
        case 'Fila de Produção':
          nextStatus = 'Em Produção';
          break;
        case 'Em Produção':
          nextStatus = 'Finalizado';
          break;
        default:
          break;
      }
      
      // Se o status não mudou, não fazer nada
      if (nextStatus === currentCard.status) {
        setLoading(false);
        return currentCard;
      }
      
      // Atualizar o status
      return await updateCard(id, { status: nextStatus });
    } catch (err: any) {
      console.error('Erro ao mover card:', err);
      setError('Não foi possível mover a solicitação. Por favor, tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Valor do contexto
  const contextValue: CardContextType = {
    cards,
    loading,
    error,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    getCardById
  };

  return (
    <CardContext.Provider value={contextValue}>
      {children}
    </CardContext.Provider>
  );
};

export default CardContext;
