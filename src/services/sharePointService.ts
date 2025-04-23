// src/services/sharePointService.ts
import axios from 'axios';
import { Card, CardStatus } from '../types/Card';

// URL base da API do Microsoft Graph
const BASE_URL = 'https://graph.microsoft.com/v1.0';

// Configurações do SharePoint
const SITE_URL = process.env.REACT_APP_SHAREPOINT_SITE_URL || '';
const SITE_ID = process.env.REACT_APP_SHAREPOINT_SITE_ID || '';
const LIST_NAME = process.env.REACT_APP_SHAREPOINT_LIST_NAME || 'SolicitacoesImpressao3D';
const IMAGES_LIBRARY_NAME = process.env.REACT_APP_SHAREPOINT_IMAGES_LIBRARY || 'ImagensPecas';

/**
 * Serviço para integração com o SharePoint via Microsoft Graph API
 */
export const sharePointService = {
  /**
   * Configura o token de autenticação para as requisições
   * @param token Token de acesso do Microsoft Graph
   */
  setAuthToken: (token: string): void => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  /**
   * Obtém informações do site do SharePoint
   * @returns Informações do site
   */
  getSiteInfo: async (): Promise<any> => {
    try {
      // Se temos o ID do site, usamos diretamente
      if (SITE_ID) {
        const response = await axios.get(`${BASE_URL}/sites/${SITE_ID}`);
        return response.data;
      }
      
      // Caso contrário, buscamos pelo URL
      const response = await axios.get(`${BASE_URL}/sites/root:${SITE_URL}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações do site:', error);
      throw new Error('Não foi possível obter informações do site do SharePoint');
    }
  },

  /**
   * Obtém a lista de solicitações do SharePoint
   * @param siteId ID do site do SharePoint
   * @returns Informações da lista
   */
  getList: async (siteId: string): Promise<any> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/sites/${siteId}/lists?$filter=displayName eq '${LIST_NAME}'`
      );
      
      if (response.data.value.length === 0) {
        throw new Error(`Lista '${LIST_NAME}' não encontrada`);
      }
      
      return response.data.value[0];
    } catch (error) {
      console.error('Erro ao obter lista:', error);
      throw new Error(`Não foi possível obter a lista '${LIST_NAME}'`);
    }
  },

  /**
   * Obtém a biblioteca de imagens do SharePoint
   * @param siteId ID do site do SharePoint
   * @returns Informações da biblioteca de documentos
   */
  getImagesLibrary: async (siteId: string): Promise<any> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/sites/${siteId}/drives?$filter=name eq '${IMAGES_LIBRARY_NAME}'`
      );
      
      if (response.data.value.length === 0) {
        throw new Error(`Biblioteca '${IMAGES_LIBRARY_NAME}' não encontrada`);
      }
      
      return response.data.value[0];
    } catch (error) {
      console.error('Erro ao obter biblioteca de imagens:', error);
      throw new Error(`Não foi possível obter a biblioteca '${IMAGES_LIBRARY_NAME}'`);
    }
  },

  /**
   * Obtém todos os cards de solicitação
   * @returns Lista de cards
   */
  getCards: async (): Promise<Card[]> => {
    try {
      // Obter informações do site
      const site = await sharePointService.getSiteInfo();
      
      // Obter lista
      const list = await sharePointService.getList(site.id);
      
      // Buscar itens da lista
      const response = await axios.get(
        `${BASE_URL}/sites/${site.id}/lists/${list.id}/items?$expand=fields&$orderby=createdDateTime desc`
      );
      
      // Mapear itens para o formato de Card
      return response.data.value.map((item: any) => {
        const fields = item.fields;
        
        // Calcular ganho/prejuízo e se é lucrativo
        let profitLoss = undefined;
        let isProfitable = undefined;
        
        if (fields.ValorPeca !== undefined && fields.CustoImpressao !== undefined) {
          profitLoss = fields.ValorPeca - fields.CustoImpressao;
          isProfitable = profitLoss > 0;
        }
        
        return {
          id: item.id,
          title: fields.Titulo || fields.Title,
          status: fields.Status as CardStatus,
          requestDate: new Date(fields.DataSolicitacao),
          requesterName: fields.NomeSolicitante,
          department: fields.SetorSolicitacao,
          brand: fields.Marca,
          model: fields.Modelo,
          partName: fields.NomePeca,
          partDescription: fields.DescricaoPeca,
          quantity: fields.Quantidade,
          deadline: new Date(fields.PrazoEntrega),
          partImageUrl: fields.ImagemPeca,
          applicationImageUrl: fields.ImagemAplicacao,
          partValue: fields.ValorPeca,
          printingCost: fields.CustoImpressao,
          profitLoss: fields.GanhoPrejuizo || profitLoss,
          isProfitable: fields.Lucrativo || isProfitable,
          createdBy: item.createdBy?.user?.displayName || '',
          createdAt: new Date(item.createdDateTime),
          modifiedBy: item.lastModifiedBy?.user?.displayName || '',
          modifiedAt: new Date(item.lastModifiedDateTime),
        };
      });
    } catch (error) {
      console.error('Erro ao obter cards:', error);
      throw new Error('Não foi possível obter as solicitações de impressão 3D');
    }
  },

  /**
   * Obtém um card específico pelo ID
   * @param cardId ID do card
   * @returns Detalhes do card
   */
  getCardById: async (cardId: string): Promise<Card> => {
    try {
      // Obter informações do site
      const site = await sharePointService.getSiteInfo();
      
      // Obter lista
      const list = await sharePointService.getList(site.id);
      
      // Buscar item específico
      const response = await axios.get(
        `${BASE_URL}/sites/${site.id}/lists/${list.id}/items/${cardId}?$expand=fields`
      );
      
      const item = response.data;
      const fields = item.fields;
      
      // Calcular ganho/prejuízo e se é lucrativo
      let profitLoss = undefined;
      let isProfitable = undefined;
      
      if (fields.ValorPeca !== undefined && fields.CustoImpressao !== undefined) {
        profitLoss = fields.ValorPeca - fields.CustoImpressao;
        isProfitable = profitLoss > 0;
      }
      
      return {
        id: item.id,
        title: fields.Titulo || fields.Title,
        status: fields.Status as CardStatus,
        requestDate: new Date(fields.DataSolicitacao),
        requesterName: fields.NomeSolicitante,
        department: fields.SetorSolicitacao,
        brand: fields.Marca,
        model: fields.Modelo,
        partName: fields.NomePeca,
        partDescription: fields.DescricaoPeca,
        quantity: fields.Quantidade,
        deadline: new Date(fields.PrazoEntrega),
        partImageUrl: fields.ImagemPeca,
        applicationImageUrl: fields.ImagemAplicacao,
        partValue: fields.ValorPeca,
        printingCost: fields.CustoImpressao,
        profitLoss: fields.GanhoPrejuizo || profitLoss,
        isProfitable: fields.Lucrativo || isProfitable,
        createdBy: item.createdBy?.user?.displayName || '',
        createdAt: new Date(item.createdDateTime),
        modifiedBy: item.lastModifiedBy?.user?.displayName || '',
        modifiedAt: new Date(item.lastModifiedDateTime),
      };
    } catch (error) {
      console.error(`Erro ao obter card ${cardId}:`, error);
      throw new Error(`Não foi possível obter a solicitação com ID ${cardId}`);
    }
  },

  /**
   * Cria um novo card de solicitação
   * @param cardData Dados do card
   * @returns Card criado
   */
  createCard: async (cardData: Omit<Card, 'id' | 'createdBy' | 'createdAt' | 'modifiedBy' | 'modifiedAt'>): Promise<Card> => {
    try {
      // Obter informações do site
      const site = await sharePointService.getSiteInfo();
      
      // Obter lista
      const list = await sharePointService.getList(site.id);
      
      // Calcular ganho/prejuízo e se é lucrativo
      let profitLoss = undefined;
      let isProfitable = undefined;
      
      if (cardData.partValue !== undefined && cardData.printingCost !== undefined) {
        profitLoss = cardData.partValue - cardData.printingCost;
        isProfitable = profitLoss > 0;
      }
      
      // Preparar dados para criação
      const fields: any = {
        Titulo: cardData.title,
        Status: cardData.status,
        DataSolicitacao: cardData.requestDate.toISOString(),
        NomeSolicitante: cardData.requesterName,
        SetorSolicitacao: cardData.department,
        Marca: cardData.brand,
        Modelo: cardData.model,
        NomePeca: cardData.partName,
        DescricaoPeca: cardData.partDescription,
        Quantidade: cardData.quantity,
        PrazoEntrega: cardData.deadline.toISOString(),
      };
      
      // Adicionar campos opcionais se existirem
      if (cardData.partImageUrl) fields.ImagemPeca = cardData.partImageUrl;
      if (cardData.applicationImageUrl) fields.ImagemAplicacao = cardData.applicationImageUrl;
      if (cardData.partValue !== undefined) fields.ValorPeca = cardData.partValue;
      if (cardData.printingCost !== undefined) fields.CustoImpressao = cardData.printingCost;
      if (profitLoss !== undefined) fields.GanhoPrejuizo = profitLoss;
      if (isProfitable !== undefined) fields.Lucrativo = isProfitable;
      
      // Criar item na lista
      const response = await axios.post(
        `${BASE_URL}/sites/${site.id}/lists/${list.id}/items`,
        { fields }
      );
      
      // Buscar o item criado para retornar com todos os dados
      return await sharePointService.getCardById(response.data.id);
    } catch (error) {
      console.error('Erro ao criar card:', error);
      throw new Error('Não foi possível criar a solicitação de impressão 3D');
    }
  },

  /**
   * Atualiza um card existente
   * @param cardId ID do card
   * @param cardData Dados a serem atualizados
   * @returns Card atualizado
   */
  updateCard: async (cardId: string, cardData: Partial<Card>): Promise<Card> => {
    try {
      // Obter informações do site
      const site = await sharePointService.getSiteInfo();
      
      // Obter lista
      const list = await sharePointService.getList(site.id);
      
      // Preparar campos para atualização
      const fields: any = {};
      
      // Adicionar apenas os campos que foram fornecidos
      if (cardData.title !== undefined) fields.Titulo = cardData.title;
      if (cardData.status !== undefined) fields.Status = cardData.status;
      if (cardData.requesterName !== undefined) fields.NomeSolicitante = cardData.requesterName;
      if (cardData.department !== undefined) fields.SetorSolicitacao = cardData.department;
      if (cardData.brand !== undefined) fields.Marca = cardData.brand;
      if (cardData.model !== undefined) fields.Modelo = cardData.model;
      if (cardData.partName !== undefined) fields.NomePeca = cardData.partName;
      if (cardData.partDescription !== undefined) fields.DescricaoPeca = cardData.partDescription;
      if (cardData.quantity !== undefined) fields.Quantidade = cardData.quantity;
      if (cardData.deadline !== undefined) fields.PrazoEntrega = cardData.deadline.toISOString();
      if (cardData.partImageUrl !== undefined) fields.ImagemPeca = cardData.partImageUrl;
      if (cardData.applicationImageUrl !== undefined) fields.ImagemAplicacao = cardData.applicationImageUrl;
      if (cardData.partValue !== undefined) fields.ValorPeca = cardData.partValue;
      if (cardData.printingCost !== undefined) fields.CustoImpressao = cardData.printingCost;
      
      // Calcular ganho/prejuízo e lucratividade se temos os valores necessários
      if (cardData.partValue !== undefined || cardData.printingCost !== undefined) {
        // Obter o card atual para ter todos os valores
        const currentCard = await sharePointService.getCardById(cardId);
        
        // Usar os valores atualizados ou os existentes
        const partValue = cardData.partValue !== undefined ? cardData.partValue : currentCard.partValue;
        const printingCost = cardData.printingCost !== undefined ? cardData.printingCost : currentCard.printingCost;
        
        // Calcular apenas se ambos os valores estão disponíveis
        if (partValue !== undefined && printingCost !== undefined) {
          fields.GanhoPrejuizo = partValue - printingCost;
          fields.Lucrativo = fields.GanhoPrejuizo > 0;
        }
      }
      
      // Atualizar o item
      await axios.patch(
        `${BASE_URL}/sites/${site.id}/lists/${list.id}/items/${cardId}/fields`,
        fields
      );
      
      // Buscar o item atualizado para retornar
      return await sharePointService.getCardById(cardId);
    } catch (error) {
      console.error(`Erro ao atualizar card ${cardId}:`, error);
      throw new Error(`Não foi possível atualizar a solicitação com ID ${cardId}`);
    }
  },

  /**
   * Exclui um card
   * @param cardId ID do card
   */
  deleteCard: async (cardId: string): Promise<void> => {
    try {
      // Obter informações do site
      const site = await sharePointService.getSiteInfo();
      
      // Obter lista
      const list = await sharePointService.getList(site.id);
      
      // Excluir o item
      await axios.delete(
        `${BASE_URL}/sites/${site.id}/lists/${list.id}/items/${cardId}`
      );
    } catch (error) {
      console.error(`Erro ao excluir card ${cardId}:`, error);
      throw new Error(`Não foi possível excluir a solicitação com ID ${cardId}`);
    }
  },

  /**
   * Faz upload de uma imagem para o SharePoint
   * @param file Arquivo de imagem
   * @param fileName Nome do arquivo (opcional)
   * @returns URL da imagem
   */
  uploadImage: async (file: File, fileName?: string): Promise<string> => {
    try {
      // Obter informações do site
      const site = await sharePointService.getSiteInfo();
      
      // Obter biblioteca de imagens
      const library = await sharePointService.getImagesLibrary(site.id);
      
      // Definir nome do arquivo
      const name = fileName || `${Date.now()}_${file.name}`;
      
      // Fazer upload do arquivo
      const response = await axios.put(
        `${BASE_URL}/sites/${site.id}/drives/${library.id}/root:/${name}:/content`,
        file,
        {
          headers: {
            'Content-Type': file.type
          }
        }
      );
      
      // Retornar URL da imagem
      return response.data.webUrl;
    } catch (error) {
      console.error('Erro ao fazer upload de imagem:', error);
      throw new Error('Não foi possível fazer upload da imagem');
    }
  }
};
