import axios from 'axios';
import { Card, CardStatus } from '../types/Card';

/**
 * Serviço para integração com o SharePoint
 * 
 * Este serviço fornece métodos para interagir com a lista de solicitações
 * de impressão 3D no SharePoint, permitindo operações CRUD e upload de imagens.
 */
export class SharePointService {
  private token: string = '';
  private siteUrl: string;
  private listName: string;
  private imagesLibrary: string;
  private isConfigValid: boolean = false;
  private debugMode: boolean = true; // Ativar modo de depuração
  
  constructor() {
    // Obter configurações do ambiente
    this.siteUrl = process.env.REACT_APP_SHAREPOINT_SITE_URL || '';
    this.listName = process.env.REACT_APP_SHAREPOINT_LIST_NAME || 'SolicitacoesImpressao3D';
    this.imagesLibrary = process.env.REACT_APP_SHAREPOINT_IMAGES_LIBRARY || 'ImagensPecas';
    
    // Verificar se as configurações são válidas
    this.validateConfig();
  }
  
  /**
   * Valida as configurações do serviço
   */
  private validateConfig(): void {
    // Verificar se o siteUrl não é o valor padrão e não está vazio
    if (this.siteUrl && this.siteUrl !== 'your-sharepoint-site-id') {
      // Verificar se o formato do siteUrl parece correto (deve conter uma vírgula)
      if (this.siteUrl.includes(',')) {
        this.isConfigValid = true;
        console.log('Configuração do SharePoint válida');
      } else {
        console.error('Formato do REACT_APP_SHAREPOINT_SITE_URL inválido. Deve ser no formato: "contoso.sharepoint.com,guid-do-site"');
        this.isConfigValid = false;
      }
    } else {
      console.error('Configuração do SharePoint inválida: REACT_APP_SHAREPOINT_SITE_URL não está configurado corretamente');
      this.isConfigValid = false;
    }
  }
  
  /**
   * Define o token de autenticação para as requisições
   * @param token Token de autenticação
   */
  public setAuthToken(token: string): void {
    this.token = token;
    
    // Verificar se o token é válido
    if (!token) {
      console.error('Token de autenticação inválido');
      this.isConfigValid = false;
    }
  }
  
  /**
   * Obtém a URL da lista no SharePoint
   */
  private getListUrl(): string {
    return `https://graph.microsoft.com/v1.0/sites/${this.siteUrl}/lists/${this.listName}`;
  }
  
  /**
   * Obtém a URL da biblioteca de imagens no SharePoint
   */
  private getImagesLibraryUrl() : string {
    return `https://graph.microsoft.com/v1.0/sites/${this.siteUrl}/drives`;
  }
  
  /**
   * Obtém os headers para as requisições
   */
  private getHeaders() : Record<string, string> {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
  
  /**
   * Converte um item do SharePoint para o modelo Card
   * @param item Item do SharePoint
   */
  private convertSharePointItemToCard(item: any): Card {
    return {
      id: item.id,
      titulo: item.fields.Title || '',
      status: item.fields.Status || 'Solicitado',
      dataSolicitacao: new Date(item.fields.DataSolicitacao || new Date()),
      nomeSolicitante: item.fields.NomeSolicitante || '',
      setorSolicitacao: item.fields.SetorSolicitacao || '',
      marca: item.fields.Marca || '',
      modelo: item.fields.Modelo || '',
      nomePeca: item.fields.NomePeca || '',
      descricaoPeca: item.fields.DescricaoPeca || '',
      quantidade: parseInt(item.fields.Quantidade) || 1,
      prazoEntrega: item.fields.PrazoEntrega ? new Date(item.fields.PrazoEntrega) : null,
      imagemPeca: item.fields.ImagemPeca || undefined,
      imagemAplicacao: item.fields.ImagemAplicacao || undefined,
      // Campos financeiros desativados - usando valores padrão
      valorPeca: 0,
      custoImpressao: 0,
      ganhoPrejuizo: 0,
      lucrativo: false
    };
  }
  
  /**
   * Verifica se o serviço está configurado corretamente antes de fazer requisições
   * @throws Error se a configuração for inválida
   */
  private checkConfig(): void {
    if (!this.isConfigValid) {
      throw new Error('Serviço do SharePoint não está configurado corretamente. Verifique as variáveis de ambiente e o token de autenticação.');
    }
    
    if (!this.token) {
      throw new Error('Token de autenticação não definido. Use setAuthToken() antes de fazer requisições.');
    }
  }
  
  /**
   * Trata erros de requisição e fornece mensagens mais detalhadas
   * @param error Erro da requisição
   * @param operacao Nome da operação que falhou
   */
  private handleRequestError(error: any, operacao: string): never {
    console.error(`Erro ao ${operacao}:`, error);
    
    // Verificar se é um erro de resposta do axios
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      // Log detalhado para depuração
      if (this.debugMode) {
        console.error(`Detalhes da resposta de erro (${status}):`, data);
        if (data && data.error && data.error.message) {
          console.error('Mensagem de erro do SharePoint:', data.error.message);
        }
      }
      
      // Erros comuns do Microsoft Graph
      switch (status) {
        case 400:
          if (data && data.error) {
            throw new Error(`Erro 400 (Bad Request) ao ${operacao}: ${data.error.message || 'Formato de requisição inválido'}`);
          }
          throw new Error(`Erro 400 (Bad Request) ao ${operacao}: Verifique se o ID do site SharePoint está no formato correto (contoso.sharepoint.com,guid-do-site)`);
        
        case 401:
          throw new Error(`Erro 401 (Unauthorized) ao ${operacao}: Token de autenticação inválido ou expirado. Faça login novamente.`);
        
        case 403:
          throw new Error(`Erro 403 (Forbidden) ao ${operacao}: Permissões insuficientes. Verifique se o usuário tem as permissões necessárias no SharePoint e se os escopos corretos foram solicitados.`);
        
        case 404:
          throw new Error(`Erro 404 (Not Found) ao ${operacao}: Recurso não encontrado. Verifique se o site, lista ou item existe no SharePoint.`);
        
        case 429:
          throw new Error(`Erro 429 (Too Many Requests) ao ${operacao}: Limite de requisições excedido. Tente novamente mais tarde.`);
        
        case 500:
          throw new Error(`Erro 500 (Internal Server Error) ao ${operacao}: Erro no servidor do SharePoint. Verifique se os campos da lista estão configurados corretamente.`);
        
        default:
          throw new Error(`Erro ${status} ao ${operacao}: ${data && data.error ? data.error.message : 'Erro desconhecido'}`);
      }
    }
    
    // Erros de rede ou outros erros
    if (error.request) {
      throw new Error(`Erro de rede ao ${operacao}: Não foi possível conectar ao servidor. Verifique sua conexão com a internet.`);
    }
    
    // Outros erros
    throw new Error(`Erro ao ${operacao}: ${error.message || 'Erro desconhecido'}`);
  }
  
  /**
   * Obtém todas as solicitações de impressão 3D
   */
  public async getCards(): Promise<Card[]> {
    try {
      this.checkConfig();
      
      console.log('Obtendo cards do SharePoint...');
      console.log('URL da requisição:', `${this.getListUrl()}/items?expand=fields`);
      
      const response = await axios.get(
        `${this.getListUrl()}/items?expand=fields`,
        { headers: this.getHeaders() }
      );
      
      console.log('Resposta recebida:', response.status);
      
      return response.data.value.map(this.convertSharePointItemToCard);
    } catch (error) {
      console.error('Erro ao obter cards:', error);
      
      // Se for um erro de configuração, retornar um array vazio com uma mensagem mais amigável
      if (error instanceof Error && error.message.includes('não está configurado corretamente')) {
        console.warn('Usando array vazio devido a erro de configuração');
        return [];
      }
      
      this.handleRequestError(error, 'obter cards');
    }
  }
  
  /**
   * Obtém uma solicitação específica pelo ID
   * @param id ID da solicitação
   */
  public async getCard(id: string): Promise<Card> {
    try {
      this.checkConfig();
      
      const response = await axios.get(
        `${this.getListUrl()}/items/${id}?expand=fields`,
        { headers: this.getHeaders() }
      );
      
      return this.convertSharePointItemToCard(response.data);
    } catch (error) {
      this.handleRequestError(error, `obter card ${id}`);
    }
  }
  
  /**
   * Cria uma nova solicitação de impressão 3D
   * @param card Dados da solicitação
   */
  public async createCard(card: Omit<Card, 'id'>): Promise<Card> {
    try {
      this.checkConfig();
      
      // Implementação mínima - usar apenas os campos essenciais
      // Usar Record<string, any> para permitir propriedades dinâmicas
      const requestBody: { fields: Record<string, any> } = {
        fields: {
          Title: card.titulo,
          Status: 'Solicitado'
        }
      };
      
      if (this.debugMode) {
        console.log('Criando card com dados:', JSON.stringify(requestBody));
      }
      
      const response = await axios.post(
        `${this.getListUrl()}/items`,
        requestBody,
        { headers: this.getHeaders() }
      );
      
      if (this.debugMode) {
        console.log('Resposta da criação do card:', response.status);
      }
      
      return this.convertSharePointItemToCard(response.data);
    } catch (error) {
      this.handleRequestError(error, 'criar card');
    }
  }
  
  /**
   * Atualiza uma solicitação existente
   * @param card Dados atualizados da solicitação
   * @param id ID da solicitação (opcional, usa card.id se não fornecido)
   */
  public async updateCard(card: Card, id?: string): Promise<Card> {
    try {
      this.checkConfig();
      
      const cardId = id || card.id;
      
      // Implementação mínima - usar apenas os campos essenciais
      // Usar Record<string, any> para permitir propriedades dinâmicas
      const updateBody: { fields: Record<string, any> } = {
        fields: {
          Title: card.titulo,
          Status: card.status
        }
      };
      
      if (this.debugMode) {
        console.log(`Atualizando card ${cardId} com dados:`, JSON.stringify(updateBody));
      }
      
      const response = await axios.patch(
        `${this.getListUrl()}/items/${cardId}`,
        updateBody,
        { headers: this.getHeaders() }
      );
      
      if (this.debugMode) {
        console.log('Resposta da atualização do card:', response.status);
      }
      
      return this.convertSharePointItemToCard(response.data);
    } catch (error) {
      this.handleRequestError(error, `atualizar card ${card.id}`);
    }
  }
  
  /**
   * Exclui uma solicitação
   * @param id ID da solicitação
   */
  public async deleteCard(id: string): Promise<void> {
    try {
      this.checkConfig();
      
      await axios.delete(
        `${this.getListUrl()}/items/${id}`,
        { headers: this.getHeaders() }
      );
    } catch (error) {
      this.handleRequestError(error, `excluir card ${id}`);
    }
  }
  
  /**
   * Atualiza o status de uma solicitação
   * @param id ID da solicitação
   * @param status Novo status
   */
  public async updateCardStatus(id: string, status: CardStatus): Promise<Card> {
    try {
      this.checkConfig();
      
      // Enviar apenas o campo de status para atualização
      const statusUpdateItem: { fields: Record<string, any> } = {
        fields: {
          Status: status
        }
      };
      
      if (this.debugMode) {
        console.log(`Atualizando status do card ${id} para ${status}`);
        console.log('Dados enviados:', JSON.stringify(statusUpdateItem));
      }
      
      const response = await axios.patch(
        `${this.getListUrl()}/items/${id}`,
        statusUpdateItem,
        { headers: this.getHeaders() }
      );
      
      if (this.debugMode) {
        console.log('Resposta da atualização de status:', response.status);
      }
      
      return this.convertSharePointItemToCard(response.data);
    } catch (error) {
      this.handleRequestError(error, `atualizar status do card ${id}`);
    }
  }
  
  /**
   * Faz upload de uma imagem para o SharePoint
   * @param file Arquivo de imagem
   * @param type Tipo de imagem (peca ou aplicacao)
   */
  public async uploadImage(file: File, type: string): Promise<string> {
    try {
      // Temporariamente desabilitado - retornar URL placeholder
      console.warn('Upload de imagens temporariamente desabilitado');
      return `https://placeholder.com/imagem_${type}_${Date.now() }.jpg`;
    } catch (error) {
      console.error('Erro ao fazer upload de imagem:', error);
      // Retornar URL placeholder em caso de erro
      return `https://placeholder.com/imagem_${type}_${Date.now() }.jpg`;
    }
  }
  
  /**
   * Testa a conexão com o SharePoint
   * @returns true se a conexão for bem-sucedida, false caso contrário
   */
  public async testConnection(): Promise<boolean> {
    try {
      this.checkConfig();
      
      // Tentar obter informações do site
      const response = await axios.get(
        `https://graph.microsoft.com/v1.0/sites/${this.siteUrl}`,
        { headers: this.getHeaders()  }
      );
      
      console.log('Conexão com o SharePoint bem-sucedida:', response.data);
      return true;
    } catch (error: unknown) {
      console.error('Erro ao testar conexão com o SharePoint:', error);
      
      // Fornecer mensagem detalhada sobre o erro
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number, data: any } };
        if (axiosError.response) {
          const status = axiosError.response.status;
          const data = axiosError.response.data;
          
          console.error(`Erro ${status}:`, data);
        }
      }
      
      return false;
    }
  }
  
  /**
   * Ativa ou desativa o modo de depuração
   * @param enabled Se o modo de depuração deve estar ativado
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    console.log(`Modo de depuração ${enabled ? 'ativado' : 'desativado'}`);
  }
}

// Exportar uma instância única do serviço
export const sharePointService = new SharePointService();
