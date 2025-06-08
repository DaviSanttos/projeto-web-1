import { BookCategory } from "../models/BookCategory";

export class BookCategoryRepository {
    private static instance: BookCategoryRepository;
    private bookCategoryList: BookCategory[] = [];

    private constructor() { 
        this.bookCategoryList = [
            new BookCategory("Romance"),
            new BookCategory("Computação"),
            new BookCategory("Letras"),
            new BookCategory("Gestão")
        ];
    }

    public static getInstance(): BookCategoryRepository {
        if (!this.instance) {
            this.instance = new BookCategoryRepository();
        }
        return this.instance;
    }

    list(){
        return this.bookCategoryList;
    }
    // ... outros mé todos
}