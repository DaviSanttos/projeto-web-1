import { executarComandoSQL, executarComandoSQLAsync } from "../database/mysql";
import { User, userActive } from "../models/entity/UserEntity";

export class UserRepository {
  private static instance: UserRepository;
  private userList: User[] = [];
  private constructor() { }

  public static getInstance(): UserRepository {
    if (!this.instance) {
      this.instance = new UserRepository();
    }
    return this.instance;
  }

  async create(user: User): Promise<void> {
    const query = `
      INSERT INTO Usuario (id, nome, cpf, ativo, categoria_id, curso_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const valores = [user.id, user.nome, user.cpf, user.ativo, user.categoria_id, user.curso_id];
    await executarComandoSQLAsync(query, valores);
  }

  async list(): Promise<User[]> {
    const query = `SELECT * FROM Usuario`;
    const result = await executarComandoSQLAsync(query, []);
    return result as User[];
  }


  async findByCpf(cpf: string): Promise<User | undefined> {
    const query = `SELECT * FROM Usuario WHERE cpf = ? LIMIT 1`;
    const result = await executarComandoSQLAsync(query, [cpf]);
    return (result as User[])[0];
  }

  async updateById(id: number, updates: Partial<User>): Promise<User> {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    const query = `UPDATE Usuario SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    await executarComandoSQLAsync(query, values);
    const user = await this.findById(id);
    return user!;
  }

 async deleteUserById(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new Error("Usuário não encontrado");

    const query = `DELETE FROM Usuario WHERE id = ?`;
    await executarComandoSQLAsync(query, [id]);
    return user;
  }

  async existsByCpf(cpf: string): Promise<boolean> {
    const query = `SELECT COUNT(*) as total FROM Usuario WHERE cpf = ?`;
    const result = await executarComandoSQLAsync(query, [cpf]);
    return result[0].total > 0;
  }

  async findById(id: number): Promise<User | undefined> {
    const query = `SELECT * FROM Usuario WHERE id = ? LIMIT 1`;
    const result = await executarComandoSQLAsync(query, [id]);
    return (result as User[])[0];
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
        id INT AUTO_INCREMENT PRIMARY KEY,
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