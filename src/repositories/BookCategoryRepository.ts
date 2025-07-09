import { executarComandoSQL } from "../database/mysql";
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

  list() {
    return this.bookCategoryList;
  }

  getIdByName(name: string): number | undefined {
    return this.bookCategoryList.find(category => category.nome === name)?.id;
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
        INSERT INTO BookCategory (id, nome)
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