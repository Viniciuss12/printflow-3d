// src/auth/msalConfig.ts
import { Configuration, LogLevel } from '@azure/msal-browser';

// Configuração do MSAL para autenticação Microsoft
export const msalConfig: Configuration = {
  auth: {
    clientId: '375e806e-8876-4de3-ac21-d6c2d725ca35', // ID do aplicativo registrado no Azure AD
    authority: 'https://login.microsoftonline.com/ab418361-f6c6-4534-b75d-e2d7fcfe5d44', // Tenant ID da Carbon
    redirectUri: window.location.origin, // Redireciona para a origem da aplicação após autenticação
    postLogoutRedirectUri: window.location.origin, // Redireciona após logout
  },
  cache: {
    cacheLocation: 'localStorage', // Armazena o cache de autenticação no localStorage
    storeAuthStateInCookie: false, // Não armazena o estado de autenticação em cookies
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            break;
        }
      },
      logLevel: LogLevel.Info,
    },
  },
};

// Escopos de API necessários para acessar o Microsoft Graph (para SharePoint)
export const loginRequest = {
  scopes: ['User.Read', 'Sites.Read.All', 'Sites.ReadWrite.All']
};

// Endpoints para o Microsoft Graph API
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphSitesEndpoint: 'https://graph.microsoft.com/v1.0/sites'
};
