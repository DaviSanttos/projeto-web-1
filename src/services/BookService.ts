import { Book } from "../models/BookModel";
import { BookRepository } from "../repositories/BookRepository";
import BookCategoryService from "./BookCategoryService";

export class BookService {
    bookRepository = BookRepository.getInstance();

    createBook(bookData: any): Book {
        const titulo = bookData?.titulo;
        const autor = bookData?.autor;
        const editora = bookData?.editora;
        const edicao = bookData?.edicao;
        const isbn = bookData?.ISBN;
        const categoria = bookData?.categoria;

        if (!titulo || !autor || !editora || !isbn || !categoria || !edicao) {
            throw new Error("Informacoes incompletas");
        }

        const exists = this.bookRepository.existsByIsbn(isbn);
        if (exists) throw new Error("Livro já cadastrado com esse ISBN");
        
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

        console.log(params)

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
        let categoria_id: number | undefined;

        if (body.categoria) {
            categoria_id = BookCategoryService.findBookCategoryIdByname(body.categoria);
        }
        

        const bookUpdate: Partial<Book> = {
            titulo: body.titulo,
            autor: body.autor,
            editora: body.editora,
            edicao: body.edicao,
            categoria_id: categoria_id,
        }

        const newBook = this.bookRepository.updateById(book.id, bookUpdate);
        return newBook;
    }

    deleteBookByIsbn(isbn: string): Book {
        // TODO rover se nao estiver emprestado

        const book = this.bookRepository.getByIsbn(isbn);
        if (!book) throw new Error("Livro nao encontrado");

        const deletedBook = this.bookRepository.deleteBookById(book.id);

        return deletedBook;
    }

}