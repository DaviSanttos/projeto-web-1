import { Book } from "../models/BookModel";


export class BookRepository {
    private static instance: BookRepository;
    private booklist: Book[] = [];

    private constructor() { }

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
}