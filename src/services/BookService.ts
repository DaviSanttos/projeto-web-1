import { Book } from "../models/BookModel";
import { User } from "../models/UserModel";
import { BookRepository } from "../repositories/BookRepository";

export class BookService {
    bookRepository = BookRepository.getInstance();

    createUser(userData: any): Book {
        const { titulo, autor, editora, edicao, isbn, categoria_id } = userData;

        if (!titulo || !autor || !editora) {
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