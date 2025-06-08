import { UserCategory } from "../models/UserCategoryModel";
import { User } from "../models/UserModel";

export class UserCategoryRepository {
    private static instance: UserCategoryRepository;
    private userCategory: UserCategory[] = [];

    private constructor() {
        this.userCategory = [
            new UserCategory("Aluno", 1),
            new UserCategory("Professor", 2),
            new UserCategory("Bibliotecário", 3)
        ];
    }

    public static getInstance(): UserCategoryRepository {
        if (!this.instance) {
            this.instance = new UserCategoryRepository();
        }
        return this.instance;
    }

    list() {
        return this.userCategory;
    }

    getIdByName(name: string): number | undefined {
        const user = this.userCategory.find(userCategory => userCategory.nome === name);
        if (!user) return undefined;
        return user.id;
    }
}