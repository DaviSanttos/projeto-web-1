import { UserCategory } from "../models/entity/UserCategoryEntity";
import { UserCategoryRepository } from "../repositories/UserCategoryRepository";

class UserCategoryService {
    userCategoryRepository = UserCategoryRepository.getInstance();

    async findUserCategoryIdByname(name: string): Promise<number> {

        if (!name) throw new Error("Sem nome de categoria de usuário");

        const userCategory = await this.userCategoryRepository.getIdByName(name);

        if (!userCategory) throw new Error("Categoria de usuário nao encontrada");
        return userCategory;
    }

    async list(): Promise<UserCategory[]> {
        return await this.userCategoryRepository.list();
    }
}

export default new UserCategoryService();