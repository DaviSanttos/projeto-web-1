import { executarComandoSQL, executarComandoSQLAsync } from "../database/mysql";
import { BookCategory } from "../models/entity/BookCategoryEntity";

export class BookCategoryRepository {
  private static instance: BookCategoryRepository;
  private bookCategoryList: BookCategory[] = [];

  private constructor() {
    this.bookCategoryList = [
      new BookCategory("Romance", 1),
      new BookCategory("Computação", 2),
      new BookCategory("Letras", 3),
      new BookCategory("Gestão", 4)
    ];
  }

  public static getInstance(): BookCategoryRepository {
    if (!this.instance) {
      this.instance = new BookCategoryRepository();
    }
    return this.instance;
  }

  async list(): Promise<BookCategory[]> {
    const query = `SELECT * FROM CategoriaLivro`;
    const result = await executarComandoSQLAsync(query, []);
    return result as BookCategory[];
  }

  async getIdByName(name: string): Promise<number | undefined> {
    const query = `SELECT id FROM CategoriaLivro WHERE nome = ?`;
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

  async createBookCategoryTable() {
    try {
      const query = `
      CREATE TABLE IF NOT EXISTS CategoriaLivro (
        id INT PRIMARY KEY,
        nome ENUM('Romance', 'Computação', 'Letras', 'Gestão') NOT NULL
      )
    `;

      executarComandoSQL(query, [], this.imprimeResult);
      console.log('Tabela "BookCategory" criada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar a tabela "BookCategory":', err);
    }
  }

  async insertDefaultBookCategories() {
    try {
      const categorias = [
        { id: 1, nome: 'Romance' },
        { id: 2, nome: 'Computação' },
        { id: 3, nome: 'Letras' },
        { id: 4, nome: 'Gestão' }
      ];

      for (const categoria of categorias) {
        const query = `
        INSERT INTO CategoriaLivro (id, nome)
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