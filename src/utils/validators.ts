
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());


export const isValidNome = (nome: string): boolean =>
  nome.trim().length >= 2;


export const isValidPassword = (senha: string): boolean =>
  senha.length >= 6;


export const isValidValor = (valor: string): boolean => {
  const n = parseFloat(valor);
  return !isNaN(n) && n > 0;
};


export const isValidDiaVencimento = (dia: string): boolean => {
  const n = parseInt(dia, 10);
  return !isNaN(n) && n >= 1 && n <= 31;
};


export const isNonEmpty = (value: string): boolean =>
  value.trim().length > 0;
