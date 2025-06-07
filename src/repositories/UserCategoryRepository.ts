import { UserCategory } from "../models/UserCategory";
import { User } from "../models/UserModel";

export class UserCategoryRepository {
    private static instance: UserCategoryRepository;
    private userList: UserCategory[] = [];

    private constructor() { }

    public static getInstance(): UserCategoryRepository {
        if (!this.instance) {
            this.instance = new UserCategoryRepository();
        }
        return this.instance;
    }

    create(userCategory: UserCategory) {
        this.userList.push(userCategory);
    }

    list(){
        return this.userList;
    }
    // ... outros mé todos
}