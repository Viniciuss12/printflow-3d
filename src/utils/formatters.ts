// src/utils/formatters.ts
// Formatar data para exibição
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

// Formatar valor monetário
export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined) return 'N/A';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Formatar nome de usuário (pegar primeiro e último nome)
export const formatUserName = (fullName: string): string => {
  const names = fullName.split(' ');
  if (names.length === 1) return names[0];
  
  return `${names[0]} ${names[names.length - 1]}`;
};
