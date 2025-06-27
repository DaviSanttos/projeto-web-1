import requestCheck from 'request-check';
import { is } from '../utils/isness';

export default class BookRules {
  public validator;

  constructor() {
    this.validator = requestCheck();
    this.validator.requiredMessage = 'Campo obrigatório!';

    this.validator.addRule('titulo', {
      validator: (value: string) => is.string(value) && value.length > 0,
      message: 'Título inválido!',
    });

    this.validator.addRule('autor', {
      validator: (value: string) => is.string(value) && value.length > 0,
      message: 'Autor inválido!',
    });

    this.validator.addRule('isbn', {
      validator: (value: string) => is.string(value),
      message: 'ISBN inválido!',
    });

    this.validator.addRule('editora', {
      validator: (value: number) => is.string(value),
      message: 'Editora inválida!',
    });

    this.validator.addRule('edicao', {
      validator: (value: number) => is.number(value) && value > 0,
      message: 'Edição inválida!',
    });

    this.validator.addRule('categoria', {
      validator: (value: string) => is.string(value) && value.length > 10,
      message: 'Categoria inválida!',
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
