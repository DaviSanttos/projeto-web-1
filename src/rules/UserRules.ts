import requestCheck from 'request-check';
import { is } from '../utils/isness';
import { userActive } from '../models/UserModel';

export default class UserRules {
  public validator;

  constructor() {
    this.validator = requestCheck();
    this.validator.requiredMessage = 'Campo obrigatório!';

    this.validator.addRule('nome', {
      validator: (value: string) => is.string(value) && value.length > 0,
      message: 'nome inválido!',
    });

    this.validator.addRule('cpf', {
      validator: (value: string) => is.string(value),
      message: 'cpf inválido!',
    });

    this.validator.addRule('categoria', {
      validator: (value: string) => is.string(value),
      message: 'categoria inválida!',
    });

    this.validator.addRule('curso', {
      validator: (value: number) => is.string(value),
      message: 'curso inválido!',
    });

    this.validator.addRule('ativo', {
      validator: (value: userActive) => Object.values(userActive).includes(value),
      message: 'valor ativo inválido!',
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
