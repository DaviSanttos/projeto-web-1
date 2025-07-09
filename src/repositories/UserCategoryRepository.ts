import { executarComandoSQL } from "../database/mysql";
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

  list() {
    return this.userCategory;
  }

  getIdByName(name: string): number | undefined {
    const user = this.userCategory.find(userCategory => userCategory.nome === name);
    if (!user) return undefined;
    return user.id;
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