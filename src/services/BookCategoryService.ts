import { BookCategoryRepository } from "../repositories/BookCategoryRepository";

class BookCategoryService {
    bookCategoryRepository = BookCategoryRepository.getInstance();

    findBookCategoryIdByname(name: string): number {

        if (!name) throw new Error("sem nome de categoria");

        const bookCategory = this.bookCategoryRepository.getIdByName(name);

        if (!bookCategory) throw new Error("Categoria nao encontrada");
        return bookCategory;
    }
}

export default new BookCategoryService();