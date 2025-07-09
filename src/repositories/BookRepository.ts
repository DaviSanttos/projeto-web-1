import { executarComandoSQL } from "../database/mysql";
import { Book } from "../models/entity/BookEntity";


export class BookRepository {
  private static instance: BookRepository;
  private booklist: Book[] = [];

  public static getInstance(): BookRepository {
    if (!this.instance) {
      this.instance = new BookRepository();
    }
    return this.instance;
  }

  create(book: Book) {
    this.booklist.push(book);
  }

  list() {
    return this.booklist;
  }

  getByIsbn(isbn: string): Book | undefined {
    return this.booklist.find(book => book.isbn === isbn);
  }

  updateById(id: number, updates: any): Book {
    const index = this.booklist.findIndex((b: Book) => b.id === id);

    this.booklist[index] = {
      ...this.booklist[index],
      ...updates
    };

    return this.booklist[index];
  }


  deleteBookById(id: number): Book {
    const index = this.booklist.findIndex((u: Book) => u.id === id);

    const deletedUser = this.booklist[index];
    this.booklist.splice(index, 1);

    return deletedUser;
  }

  existsByIsbn(isbn: string): boolean {
    return this.booklist.some((book: Book) => book.isbn === isbn);
  }

  findBookByEditionPublisherAuthor(params: { edicao: string, editora: string, autor: string }): Book | undefined {
    return this.booklist.find((book: Book) => {
      return book.edicao === params.edicao &&
        book.editora === params.editora &&
        book.autor === params.autor
    });
  }

  findById(id: number): Book | undefined {
    return this.booklist.find((book: Book) => book.id === id);
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
        categoria_id INT NOT NULL
      )
    `;

      executarComandoSQL(query, [], this.imprimeResult);
      console.log('Query executada com sucesso!');
    } catch (err) {
      console.error('Erro ao executar a query:', err);
    }
  }
}