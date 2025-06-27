import requestCheck from 'request-check';
import { is } from '../utils/isness';

export default class StockRules {
  public validator;

  constructor() {
    this.validator = requestCheck();
    this.validator.requiredMessage = 'Campo obrigatório!';

    this.validator.addRule('isbn', {
      validator: (value: string) => is.string(value),
      message: 'isbn inválido!',
    });

    this.validator.addRule('codigo_exemplar', {
      validator: (value: number) => is.int(value),
      message: 'codigo_exemplar inválido!',
    });

    this.validator.addRule('disponivel', {
      validator: (value: boolean) => is.boolean(value),
      message: 'disponibilidade inválida!',
    });
  }

  public invalid(...args: Array<{ [key: string]: any; isRequiredField?: boolean } | null | undefined>): any {
    const filteredArgs = args.filter((arg): arg is { [key: string]: any; isRequiredField?: boolean } => arg !== null && arg !== undefined);
    return this.validator.check(...filteredArgs);
  }

  public validate(...args: Array<{ [key: string]: any; isRequiredField?: boolean } | null>): any {
    const filteredArgs = args.filter((arg): arg is { [key: string]: any; isRequiredField?: boolean } => arg !== null && arg !== undefined);
    const invalid = this.validator.check(...filteredArgs);
    if (invalid) throw new Error(`Campos inválidos (${invalid.length}) ${invalid.map((i: any) => i.message).join(', ')}`);
  }
}
