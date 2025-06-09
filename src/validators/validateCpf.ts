export const validateCPF = (cpf: string): void => {
  if (!/^\d{11}$/.test(cpf)) {
    throw new Error("Informe um CPF válido com exatamente 11 dígitos numéricos.");
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    throw new Error("CPF inválido. Todos os dígitos não podem ser iguais.");
  }

  const calculateVerifierDigit = (partialCPF: string, initialWeight: number): number => {
    let sum = 0;
    for (let i = 0; i < partialCPF.length; i++) {
      sum += parseInt(partialCPF[i]) * (initialWeight - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digit1 = calculateVerifierDigit(cpf.substring(0, 9), 10);
  const digit2 = calculateVerifierDigit(cpf.substring(0, 9) + digit1, 11);

  const isValid = digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);

  if (!isValid) {
    throw new Error("CPF inválido.");
  }
};
