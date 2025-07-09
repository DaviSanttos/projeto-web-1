import { BookCategoryRepository } from "../repositories/BookCategoryRepository";

class BookCategoryService {
    bookCategoryRepository = BookCategoryRepository.getInstance();

    async findBookCategoryIdByname(name: string): Promise<number> {

        if (!name) throw new Error("sem nome de categoria");

        const bookCategory = await this.bookCategoryRepository.getIdByName(name);
        
        if (!bookCategory) throw new Error("Categoria nao encontrada");
        return bookCategory;
    }

    async list() {
        return await this.bookCategoryRepository.list();
    }
}

export default new BookCategoryService();