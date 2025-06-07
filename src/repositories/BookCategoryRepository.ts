import { BookCategory } from "../models/BookCategory";

export class BookCategoryRepository {
    private static instance: BookCategoryRepository;
    private userList: BookCategory[] = [];

    private constructor() { }

    public static getInstance(): BookCategoryRepository {
        if (!this.instance) {
            this.instance = new BookCategoryRepository();
        }
        return this.instance;
    }

    create(book: BookCategory) {
        this.userList.push(book);
    }

    list(){
        return this.userList;
    }
    // ... outros mé todos
}