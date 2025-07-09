import { executarComandoSQL, executarComandoSQLAsync } from "../database/mysql";
import { UserCategory } from "../models/entity/UserCategoryEntity";
import { User } from "../models/entity/UserEntity";

export class UserCategoryRepository {
  private static instance: UserCategoryRepository;
  private userCategory: UserCategory[] = [];

  private constructor() {
    this.userCategory = [
      new UserCategory("Aluno", 1),
      new UserCategory("Professor", 2),
      new UserCategory("Bibliotecário", 3)
    ];
  }

  public static getInstance(): UserCategoryRepository {
    if (!this.instance) {
      this.instance = new UserCategoryRepository();
    }
    return this.instance;
  }

  async list(): Promise<UserCategory[]> {
    const query = `SELECT * FROM CategoriaUsuario`;
    const result = await executarComandoSQLAsync(query, []);
    return result as UserCategory[];
  }

  async getIdByName(name: string): Promise<number | undefined> {
    const query = `SELECT id FROM CategoriaUsuario WHERE nome = ?`;
    const result = await executarComandoSQLAsync(query, [name]);

    if (Array.isArray(result) && result.length > 0) {
      return result[0].id;
    }

    return undefined;
  }

  imprimeResult(err: any, result: any) {
    if (err) {
      console.error('Erro no callback:', err);
    } else if (result !== undefined) {
      console.log('Dentro do callback:', result);
    }
  }

  async createUserCategoryTable() {
    try {
      const query = `
      CREATE TABLE IF NOT EXISTS CategoriaUsuario (
        id INT PRIMARY KEY,
        nome ENUM('Aluno', 'Professor', 'Bibliotecário') NOT NULL
      )
    `;

      executarComandoSQL(query, [], this.imprimeResult);
      console.log('Tabela "UserCategory" criada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar a tabela "UserCategory":', err);
    }
  }

  async insertDefaultCategories() {
    try {
      const categorias = [
        { id: 1, nome: 'Aluno' },
        { id: 2, nome: 'Professor' },
        { id: 3, nome: 'Bibliotecário' }
      ];

      for (const categoria of categorias) {
        const query = `
        INSERT INTO CategoriaUsuario (id, nome)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE nome = VALUES(nome)
      `;

        await executarComandoSQL(query, [categoria.id, categoria.nome], this.imprimeResult);
      }

      console.log('Categorias padrão inseridas com sucesso!');
    } catch (err) {
      console.error('Erro ao inserir categorias padrão:', err);
    }
  }
}