import { executarComandoSQL } from "../database/mysql";
import { User, userActive } from "../models/entity/UserEntity";

export class UserRepository {
  private static instance: UserRepository;
  private userList: User[] = [];
  // [
  //     {
  //         "ativo": userActive.ATIVO,
  //         "nome": "davi",
  //         "cpf": "12345678909",
  //         "categoria_id": 1,
  //         "curso_id": 1,
  //         "email": "3",
  //         "id": 1749302865474
  //     },
  //     {
  //         "ativo": userActive.SUSPENSO,
  //         "nome": "fe",
  //         "cpf": "12345678909",
  //         "categoria_id": 1,
  //         "curso_id": 1,
  //         "email": "3",
  //         "id": 1749302876384
  //     },
  //     {
  //         "ativo": userActive.INATIVO,
  //         "nome": "ads",
  //         "cpf": "12345678909",
  //         "categoria_id": 2,
  //         "curso_id": 1,
  //         "email": "3",
  //         "id": 1749302877183
  //     },
  //     {
  //         "ativo": "ativo",
  //         "nome": "ads",
  //         "cpf": "12345678909",
  //         "categoria_id": 1,
  //         "curso_id": 1,
  //         "email": "3",
  //         "id": 1749302877973
  //     },
  //     {
  //         "ativo": "ativo",
  //         "nome": "ads",
  //         "cpf": "12345678909",
  //         "categoria_id": 1,
  //         "curso_id": 1,
  //         "email": "3",
  //         "id": 1749302878800
  //     }
  // ];

  private constructor() { }

  public static getInstance(): UserRepository {
    if (!this.instance) {
      this.instance = new UserRepository();
    }
    return this.instance;
  }

  create(user: User) {
    this.userList.push(user);
  }

  list() {
    return this.userList;
  }

  findByCpf(cpf: string): User | undefined {
    return this.userList.find((user: User) => user.cpf === cpf);
  }

  updateById(id: number, updates: any): User {
    const index = this.userList.findIndex((u: User) => u.id === id);

    this.userList[index] = {
      ...this.userList[index],
      ...updates
    };

    return this.userList[index];
  }

  deleteUserById(id: number): User {
    const index = this.userList.findIndex((u: User) => u.id === id);

    const deletedUser = this.userList[index];
    this.userList.splice(index, 1);

    return deletedUser;
  }

  existsByCpf(cpf: string): boolean {
    return this.userList.some((user: User) => user.cpf === cpf);
  }

  imprimeResult(err: any, result: any) {
    if (err) {
      console.error('Erro no callback:', err);
    } else if (result !== undefined) {
      console.log('Dentro do callback:', result);
    }
  }


  async createUserTable() {
    try {
      const query = `
      CREATE TABLE IF NOT EXISTS Usuario (
        id INT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        cpf VARCHAR(14) NOT NULL UNIQUE,
        ativo ENUM('ativo', 'inativo', 'suspenso') DEFAULT 'ativo',
        categoria_id INT NOT NULL,
        curso_id INT NOT NULL,
        CONSTRAINT fk_categoria_usuario FOREIGN KEY (categoria_id) REFERENCES CategoriaUsuario(id),
        CONSTRAINT fk_curso_usuario FOREIGN KEY (curso_id) REFERENCES Curso(id)
      )
    `;

      executarComandoSQL(query, [], this.imprimeResult);
      console.log('Tabela "User" criada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar a tabela "User":', err);
    }
  }
}