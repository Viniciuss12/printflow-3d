// src/types/Card.ts
export type CardStatus = 'Solicitado' | 'Aprovado' | 'Fila de Produção' | 'Em Produção' | 'Finalizado';

export interface Card {
  id: string;
  title: string;
  status: CardStatus;
  requestDate: Date;
  requesterName: string;
  department: string;
  brand: string;
  model: string;
  partName: string;
  partDescription: string;
  quantity: number;
  deadline: Date;
  partImageUrl?: string;
  applicationImageUrl?: string;
  partValue?: number;
  printingCost?: number;
  profitLoss?: number;
  isProfitable?: boolean;
  createdBy: string;
  createdAt: Date;
  modifiedBy?: string;
  modifiedAt?: Date;
}
