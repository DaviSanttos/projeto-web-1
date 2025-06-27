import { Book } from "../models/BookModel";
import { BookRepository } from "../repositories/BookRepository";
import BookCategoryService from "./BookCategoryService";
import CourseService from "./CourseService";
import { LoanService } from "./LoanService";
import { StockService } from "./StockService";

export class BookService {
    bookRepository = BookRepository.getInstance();

    createBook(bookData: any): Book {
        // const titulo = bookData?.titulo;
        // const autor = bookData?.autor;
        // const editora = bookData?.editora;
        // const edicao = bookData?.edicao;
        // const isbn = bookData?.ISBN;
        // const categoria = bookData?.categoria;

        // if (!titulo || !autor || !editora || !isbn || !categoria || !edicao) {
        //     throw new Error("Informacoes incompletas");
        // }
        const { titulo, autor, editora, edicao, ISBN: isbn, categoria } = bookData;
        console.log("bookData", bookData);

        const exists = this.bookRepository.existsByIsbn(isbn);
        console.log("exists", exists);
        if (exists) throw new Error(`Livro já cadastrado com esse ISBN`);

        const book = this.bookRepository.findBookByEditionPublisherAuthor({
            edicao: edicao,
            editora: editora,
            autor: autor
        });

        if (book) throw new Error("Livro já cadastrado com esses dados: autor, editora e edição");
        
        const categoria_id = BookCategoryService.findBookCategoryIdByname(categoria);

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

    listBooks(params: any): Book[] {
        const bookList = this.bookRepository.list();

        return bookList.filter((book: any) => {
            return (
                (!params?.titulo || book.titulo.toLowerCase().includes(params.titulo.toLowerCase())) &&
                (!params?.autor || book.autor.toLowerCase().includes(params.autor.toLowerCase())) &&
                (!params?.editora || book.editora.toLowerCase().includes(params.editora.toLowerCase())) &&
                (!params?.edicao || book.edicao.toLowerCase().includes(params.edicao.toLowerCase())) &&
                (!params?.isbn || book.isbn.toLowerCase().includes(params.isbn.toLowerCase())) &&
                (!params?.categoria_id || book.categoria_id === parseInt(params.categoria_id))
            );
        });
    }

    findBookByIsbn(isbn: string): Book {
        if (!isbn) throw new Error("Informacoes incompletas");

        const book = this.bookRepository.getByIsbn(isbn);

        if (!book) throw new Error("Livro nao encontrado");
        return book;
    }

    updateBookByIsbn(isbn: string, body: any): Book {
        const book = this.bookRepository.getByIsbn(isbn);
        if (!book) throw new Error("Livro nao encontrado");

        const { titulo, autor, editora, edicao, categoria } = body;
        // if (!body.titulo || !body.autor || !body.editora || !body.edicao || !body.categoria) {
        //     throw new Error("Informacoes incompletas");
        // }

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

    deleteBookByIsbn(isbn: string): Book {
        const book = this.bookRepository.getByIsbn(isbn);
        if (!book) throw new Error("Livro nao encontrado");

        const stockService = new StockService();

        const copies = stockService.findCopiesByBookId(book.id);

        const loanService = new LoanService();

        const loans = loanService.findLoansByCopyIds(copies.map(copy => copy.id));

        if (loans.length > 0) {
            throw new Error("Livro não pode ser deletado, pois existem exemplares emprestados");
        }

        const deletedBook = this.bookRepository.deleteBookById(book.id);

        return deletedBook;
    }

    getRelacionCourseToBookCategory(couserId: number, bookId: number): boolean {
        const book = this.bookRepository.findById(bookId);

        if (!book) throw new Error("Livro não encontrado");

        const bookCategoryId = book.categoria_id;

        return CourseService.relacionCourseToBookCategory(couserId, bookCategoryId);
    }
}