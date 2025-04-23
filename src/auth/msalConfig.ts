// src/auth/msalConfig.ts
export const msalConfig = {
  auth: {
    clientId: "375e806e-8876-4de3-ac21-d6c2d725ca35", // Substitua pelo ID do cliente do seu aplicativo no Azure AD
    authority: "https://login.microsoftonline.com/ab418361-f6c6-4534-b75d-e2d7fcfe5d44", // Substitua pelo ID do seu tenant
    redirectUri: window.location.origin, // Usa a origem atual dinamicamente
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Escopos de API que o aplicativo solicitarÃ¡ acesso
export const loginRequest = {
  scopes: ["User.Read", "Sites.ReadWrite.All", "Files.ReadWrite.All"]
};

// ConfiguraÃ§Ã£o opcional - Endpoints protegidos
export const protectedResources = {
  graphAPI: {
    endpoint: "https://graph.microsoft.com/v1.0",
    scopes: ["User.Read", "Sites.ReadWrite.All", "Files.ReadWrite.All"]
  }
};