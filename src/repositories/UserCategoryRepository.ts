import { UserCategory } from "../models/UserCategory";
import { User } from "../models/UserModel";

export class UserCategoryRepository {
    private static instance: UserCategoryRepository;
    private userCategory: UserCategory[] = [];

    private constructor() { 
        this.userCategory = [
            new UserCategory("Aluno"),
            new UserCategory("Professor"),
            new UserCategory("Bibliotecário")
        ];
    }

    public static getInstance(): UserCategoryRepository {
        if (!this.instance) {
            this.instance = new UserCategoryRepository();
        }
        return this.instance;
    }

    list(){
        return this.userCategory;
    }
}