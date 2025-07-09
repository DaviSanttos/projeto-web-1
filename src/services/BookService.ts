import { Book } from "../models/entity/BookEntity";
import { BookRepository } from "../repositories/BookRepository";
import BookCategoryService from "./BookCategoryService";
import CourseService from "./CourseService";
import { LoanService } from "./LoanService";
import { StockService } from "./StockService";

export class BookService {
    bookRepository = BookRepository.getInstance();

    async createBook(bookData: any): Promise<Book> {
        const { titulo, autor, editora, edicao, ISBN: isbn, categoria } = bookData;

        const exists = this.bookRepository.existsByIsbn(isbn);

        if (exists) throw new Error(`Livro já cadastrado com esse ISBN`);

        const book = this.bookRepository.findBookByEditionPublisherAuthor({
            edicao: edicao,
            editora: editora,
            autor: autor
        });

        if (book) throw new Error("Livro já cadastrado com esses dados: autor, editora e edição");

        const categoria_id = BookCategoryService.findBookCategoryIdByname(categoria);

        if (!categoria_id) throw new Error("Categoria não encontrada");

        const newBook = new Book(
            titulo,
            autor,
            editora,
            edicao,
            isbn,
            categoria_id
        );

        this.bookRepository.create(newBook);
        return newBook;
    }

    async listBooks(params: any): Promise<Book[]> {
        const bookList = await this.bookRepository.list(params);
        return bookList;
    }

    async findBookByIsbn(isbn: string): Promise<Book> {
        if (!isbn) throw new Error("Informacoes incompletas");

        const book = await this.bookRepository.getByIsbn(isbn);

        if (!book) throw new Error("Livro nao encontrado");
        return book;
    }

    async updateBookByIsbn(isbn: string, body: any): Promise<Book | undefined> {
        const book = await this.bookRepository.getByIsbn(isbn);
        if (!book) throw new Error("Livro nao encontrado");

        const { titulo, autor, editora, edicao, categoria } = body;

        const categoria_id = BookCategoryService.findBookCategoryIdByname(categoria);

        const bookUpdate: Partial<Book> = {
            titulo,
            autor,
            editora,
            edicao,
            categoria_id: categoria_id,
        }

        const newBook = this.bookRepository.updateById(book.id, bookUpdate);
        return newBook;
    }

    // deleteBookByIsbn(isbn: string): Book {
    //     const book = this.bookRepository.getByIsbn(isbn);
    //     if (!book) throw new Error("Livro nao encontrado");

    //     const stockService = new StockService();

    //     const copies = stockService.findCopiesByBookId(book.id);

    //     const loanService = new LoanService();

    //     const loans = loanService.findLoansByCopyIds(copies.map(copy => copy.id));

    //     if (loans.length > 0) {
    //         throw new Error("Livro não pode ser deletado, pois existem exemplares emprestados");
    //     }

    //     const deletedBook = this.bookRepository.deleteBookById(book.id);

    //     return deletedBook;
    // }

    getRelacionCourseToBookCategory(couserId: number, bookId: number): boolean {
        const book = this.bookRepository.findById(bookId);

        if (!book) throw new Error("Livro não encontrado");

        const bookCategoryId = book.categoria_id;

        return CourseService.relacionCourseToBookCategory(couserId, bookCategoryId);
    }
}