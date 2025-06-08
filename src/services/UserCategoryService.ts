import { UserCategory } from "../models/UserCategoryModel";
import { UserCategoryRepository } from "../repositories/UserCategoryRepository";

class UserCategoryService {
    userCategoryRepository = UserCategoryRepository.getInstance();

    findUserCategoryIdByname(name: string): number {

        if (!name) throw new Error("Sem nome de categoria de usuário");

        const userCategory = this.userCategoryRepository.getIdByName(name);

        if (!userCategory) throw new Error("Categoria de usuário nao encontrada");
        return userCategory;
    }
}

export default new UserCategoryService();