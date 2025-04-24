// src/contexts/CardContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Tipos simplificados
export type CardStatus = 'Solicitado' | 'Aprovado' | 'Fila de Produção' | 'Em Produção' | 'Finalizado';

export interface Card {
  id: string;
  title: string;
  status: CardStatus;
  requestDate: Date;
  requesterName: string;
  department: string;
  partName: string;
  description: string;
  quantity: number;
}

// Interface para o contexto de cards
interface CardContextType {
  cards: Card[];
  loading: boolean;
  addCard: (cardData: Omit<Card, 'id' | 'status' | 'requestDate'>) => void;
  moveCard: (cardId: string) => void;
  getCardById: (id: string) => Card | undefined;
}

// Dados mockados para teste
const initialCards: Card[] = [
  {
    id: '1',
    title: 'Suporte para sensor',
    status: 'Solicitado',
    requestDate: new Date(),
    requesterName: 'João Silva',
    department: 'Engenharia',
    partName: 'Suporte sensor ABS',
    description: 'Suporte para fixação do sensor ABS na suspensão dianteira',
    quantity: 2
  },
  {
    id: '2',
    title: 'Capa de proteção',
    status: 'Aprovado',
    requestDate: new Date(),
    requesterName: 'Maria Oliveira',
    department: 'Produção',
    partName: 'Capa protetora',
    description: 'Capa de proteção para conector elétrico',
    quantity: 10
  },
  {
    id: '3',
    title: 'Espaçador de mola',
    status: 'Fila de Produção',
    requestDate: new Date(),
    requesterName: 'Carlos Santos',
    department: 'Manutenção',
    partName: 'Espaçador 10mm',
    description: 'Espaçador para mola de suspensão traseira',
    quantity: 4
  }
];

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
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [loading, setLoading] = useState<boolean>(false);

  // Função para adicionar um novo card
  const addCard = (cardData: Omit<Card, 'id' | 'status' | 'requestDate'>): void => {
    setLoading(true);
    
    // Simular atraso de rede
    setTimeout(() => {
      const newCard: Card = {
        id: uuidv4(),
        status: 'Solicitado',
        requestDate: new Date(),
        ...cardData
      };
      
      setCards([...cards, newCard]);
      setLoading(false);
    }, 500);
  };

  // Função para mover um card para o próximo status
  const moveCard = (cardId: string): void => {
    setCards(cards.map(card => {
      if (card.id === cardId) {
        let newStatus: CardStatus = card.status;
        
        switch (card.status) {
          case 'Solicitado':
            newStatus = 'Aprovado';
            break;
          case 'Aprovado':
            newStatus = 'Fila de Produção';
            break;
          case 'Fila de Produção':
            newStatus = 'Em Produção';
            break;
          case 'Em Produção':
            newStatus = 'Finalizado';
            break;
          default:
            break;
        }
        
        return { ...card, status: newStatus };
      }
      return card;
    }));
  };

  // Função para buscar um card pelo ID
  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  // Valor do contexto
  const contextValue: CardContextType = {
    cards,
    loading,
    addCard,
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
