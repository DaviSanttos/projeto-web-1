import { Book } from "../models/BookModel";
import { User } from "../models/UserModel";
import { BookRepository } from "../repositories/BookRepository";

export class BookService {
    bookRepository = BookRepository.getInstance();

    createBook(userData: any): Book {
        // const { titulo, autor, editora, edicao, isbn, categoria_id } = userData;

        const titulo = userData?.titulo;
        const autor = userData?.autor;
        const editora = userData?.editora;
        const edicao = userData?.edicao;
        const isbn = userData?.isbn;
        const categoria = userData?.categoria;
        
        const categoria_id = userData?.categoria_id;


        if (!titulo || !autor || !editora || !isbn || !categoria || !edicao) {
            throw new Error("Informacoes incompletas");
        }

        // Assuming you meant to create a Book, not a User, since the return type is Book
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

    listUsers(): Book[] {
        return this.bookRepository.list();
    }
    // ... outros mé todos
}