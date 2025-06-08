import { BookCategory } from "../models/BookCategoryModel";

export class BookCategoryRepository {
    private static instance: BookCategoryRepository;
    private bookCategoryList: BookCategory[] = [];

    private constructor() { 
        this.bookCategoryList = [
            new BookCategory("Romance", 1),
            new BookCategory("Computação", 2),
            new BookCategory("Letras", 3),
            new BookCategory("Gestão", 4)
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
    
    getIdByName(name: string): number | undefined {
        return this.bookCategoryList.find(category => category.nome === name)?.id;
    }
}