import { User } from "../models/UserModel";

export class UserRepository {
    private static instance: UserRepository;
    private userList: User[] = [];

    private constructor() { }

    public static getInstance(): UserRepository {
        if (!this.instance) {
            this.instance = new UserRepository();
        }
        return this.instance;
    }

    create(user: User) {
        this.userList.push(user);
    }

    list(){
        return this.userList;
    }
    // ... outros mé todos
}