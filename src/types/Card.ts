// src/types/Card.ts
export type CardStatus = 'Solicitado' | 'Aprovado' | 'Fila de Produção' | 'Em Produção' | 'Finalizado';

export interface Card {
  id: string;
  titulo: string;
  status: CardStatus;
  dataSolicitacao: Date;
  nomeSolicitante: string;
  setorSolicitacao: string;
  marca: string;
  modelo: string;
  nomePeca: string;
  descricaoPeca: string;
  quantidade: number;
  prazoEntrega: Date | null;
  imagemPeca?: string;
  imagemAplicacao?: string;
  valorPeca: number;
  custoImpressao: number;
  ganhoPrejuizo: number;
  lucrativo: boolean;
}
