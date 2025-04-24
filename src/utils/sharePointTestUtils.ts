import { sharePointService } from '../services/sharePointService';
import { Card } from '../types/Card';

/**
 * Utilitários para testar a integração com o SharePoint
 * 
 * Este arquivo contém funções para testar a conexão com o SharePoint
 * e realizar operações básicas de CRUD para verificar se a integração
 * está funcionando corretamente.
 */

/**
 * Testa a conexão com o SharePoint
 * @param token Token de autenticação
 */
export const testSharePointConnection = async (token: string): Promise<boolean> => {
  try {
    console.log('Testando conexão com o SharePoint...');
    sharePointService.setAuthToken(token);
    
    // Tentar obter a lista de cards para verificar a conexão
    const cards = await sharePointService.getCards();
    console.log(`Conexão bem-sucedida! ${cards.length} cards encontrados.`);
    
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o SharePoint:', error);
    return false;
  }
};

/**
 * Testa operações CRUD completas no SharePoint
 * @param token Token de autenticação
 */
export const testSharePointCRUD = async (token: string): Promise<boolean> => {
  try {
    console.log('Testando operações CRUD no SharePoint...');
    sharePointService.setAuthToken(token);
    
    // 1. Criar um card de teste
    const testCard: Omit<Card, 'id'> = {
      titulo: `Teste CRUD ${new Date().toISOString()}`,
      status: 'Solicitado',
      dataSolicitacao: new Date(),
      nomeSolicitante: 'Usuário de Teste',
      setorSolicitacao: 'TI',
      marca: 'Teste',
      modelo: 'Modelo Teste',
      nomePeca: 'Peça de Teste',
      descricaoPeca: 'Esta é uma peça de teste para verificar a integração com o SharePoint',
      quantidade: 1,
      prazoEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de hoje
      valorPeca: 100,
      custoImpressao: 50,
      ganhoPrejuizo: 50,
      lucrativo: true
    };
    
    console.log('Criando card de teste...');
    const createdCard = await sharePointService.createCard(testCard);
    console.log('Card criado com sucesso:', createdCard);
    
    // 2. Obter o card criado
    console.log('Obtendo card criado...');
    const fetchedCard = await sharePointService.getCard(createdCard.id);
    console.log('Card obtido com sucesso:', fetchedCard);
    
    // 3. Atualizar o card
    console.log('Atualizando card...');
    const updatedCard = await sharePointService.updateCard({
      ...createdCard,
      titulo: `${testCard.titulo} (Atualizado)`,
      descricaoPeca: 'Descrição atualizada para teste'
    });
    console.log('Card atualizado com sucesso:', updatedCard);
    
    // 4. Excluir o card
    console.log('Excluindo card...');
    await sharePointService.deleteCard(createdCard.id);
    console.log('Card excluído com sucesso!');
    
    return true;
  } catch (error) {
    console.error('Erro ao testar operações CRUD:', error);
    return false;
  }
};

/**
 * Testa o upload de imagens para o SharePoint
 * @param token Token de autenticação
 * @param file Arquivo para upload
 */
export const testImageUpload = async (token: string, file: File): Promise<string | null> => {
  try {
    console.log('Testando upload de imagem para o SharePoint...');
    sharePointService.setAuthToken(token);
    
    const imageUrl = await sharePointService.uploadImage(file, 'teste');
    console.log('Imagem enviada com sucesso:', imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);
    return null;
  }
};
