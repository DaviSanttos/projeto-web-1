import { executarComandoSQL, executarComandoSQLAsync } from "../database/mysql";
import { Book } from "../models/entity/BookEntity";
import BookCategoryService from "../services/BookCategoryService";


export class BookRepository {
  private static instance: BookRepository;
  private booklist: Book[] = [];

  public static getInstance(): BookRepository {
    if (!this.instance) {
      this.instance = new BookRepository();
    }
    return this.instance;
  }

  async create(book: Book): Promise<void> {
    const query = `
      INSERT INTO Livro (titulo, autor, editora, edicao, isbn, categoria_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [book.titulo, book.autor, book.editora, book.edicao, book.isbn, book.categoria_id];
    await executarComandoSQL(query, values, this.imprimeResult);
  }

  async list(params: any): Promise<Book[]> {
    let query = 'SELECT * FROM Livro WHERE 1=1';
    const values: any[] = [];

    if (params.titulo) {
      query += ' AND LOWER(titulo) LIKE ?';
      values.push(`%${params.titulo.toLowerCase()}%`);
    }
    if (params.autor) {
      query += ' AND LOWER(autor) LIKE ?';
      values.push(`%${params.autor.toLowerCase()}%`);
    }
    if (params.editora) {
      query += ' AND LOWER(editora) LIKE ?';
      values.push(`%${params.editora.toLowerCase()}%`);
    }
    if (params.edicao) {
      query += ' AND LOWER(edicao) LIKE ?';
      values.push(`%${params.edicao.toLowerCase()}%`);
    }
    if (params.isbn) {
      query += ' AND LOWER(isbn) LIKE ?';
      values.push(`%${params.isbn.toLowerCase()}%`);
    }
    if (params.categoria) {
      const categoria_id = BookCategoryService.findBookCategoryIdByname(params.categoria);
      if (categoria_id) {
        query += ' AND categoria_id = ?';
        values.push(categoria_id);
      }
    }

    const results = await executarComandoSQLAsync(query, values);
    return results;
  }

  async getByIsbn(isbn: string): Promise<Book | undefined> {
    const query = `SELECT * FROM Livro WHERE isbn = ? LIMIT 1`;
    const results = await executarComandoSQLAsync(query, [isbn]);
    if (results.length === 0) return undefined;
    return results[0];
  }


  async updateById(id: number, updates: Partial<Book>): Promise<Book | undefined> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return undefined;

    const setString = fields.map(f => `${f} = ?`).join(", ");
    const values = fields.map(f => (updates as any)[f]);
    values.push(id);

    const query = `UPDATE Livro SET ${setString} WHERE id = ?`;
    await executarComandoSQLAsync(query, values);

    return this.findById(id);
  }

  async deleteBookById(id: number): Promise<void> {
    const query = `DELETE FROM Livro WHERE id = ?`;
    await executarComandoSQLAsync(query, [id]);
  }

  async existsByIsbn(isbn: string): Promise<boolean> {
    const query = `SELECT COUNT(*) as count FROM Livro WHERE isbn = ?`;
    const result = await executarComandoSQLAsync(query, [isbn]);
    return result[0].count > 0;
  }

  async findBookByEditionPublisherAuthor(params: { edicao: string, editora: string, autor: string }): Promise<Book | undefined> {
    const query = `
      SELECT * FROM Livro WHERE edicao = ? AND editora = ? AND autor = ? LIMIT 1
    `;
    const results = await executarComandoSQLAsync(query, [params.edicao, params.editora, params.autor]);
    if (results.length === 0) return undefined;
    return results[0];
  }

  async findById(id: number): Promise<Book | undefined> {
    const query = `SELECT * FROM Livro WHERE id = ? LIMIT 1`;
    const results = await executarComandoSQLAsync(query, [id]);
    if (results.length === 0) return undefined;
    return results[0];
  }

  imprimeResult(err: any, result: any) {
    if (err) {
      console.error('Erro no callback:', err);
    } else if (result !== undefined) {
      console.log('Dentro do callback:', result);
    }
  }

  async createBookTable() {
    try {
      const query = `
      CREATE TABLE IF NOT EXISTS Livro (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        autor VARCHAR(255) NOT NULL,
        editora VARCHAR(255) NOT NULL,
        edicao VARCHAR(100) NOT NULL,
        isbn VARCHAR(50) NOT NULL,
        categoria_id INT NOT NULL,
        CONSTRAINT fk_categoria_livro FOREIGN KEY (categoria_id) REFERENCES CategoriaLivro(id)
      )
    `;

      executarComandoSQL(query, [], this.imprimeResult);
      console.log('Query executada com sucesso!');
    } catch (err) {
      console.error('Erro ao executar a query:', err);
    }
  }
}