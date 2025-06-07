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

    list(){
        return this.booklist;
    }
    // ... outros mé todos
}