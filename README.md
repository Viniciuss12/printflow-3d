# PrintFlow 3D

Sistema de gerenciamento de fila para impressão 3D com interface de arrastar e soltar.

## Funcionalidades

- Interface de cards com funcionalidade de arrastar e soltar
- Diferentes níveis de acesso para usuários
- Pipeline com 5 status: Solicitado, Aprovado, Fila de Produção, Em Produção, Finalizado
- Upload de imagens das peças e locais de aplicação
- Cálculo de ganho/prejuízo para análise de custo-benefício
- Integração com autenticação Microsoft e SharePoint

## Tecnologias

- React com TypeScript
- Material UI para interface
- MSAL para autenticação Microsoft
- React Beautiful DnD para arrastar e soltar
- Integração com SharePoint via Microsoft Graph API

## Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente
4. Execute o projeto: `npm start`
