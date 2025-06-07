import { User } from "../models/UserModel";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
    userRepository = UserRepository.getInstance();

    createUser(userData: any): User {
        const { nome, cpf, emai, categoria, curso } = userData;

        if (!nome || !cpf || !emai || !categoria || !curso) {
            throw new Error("Informacoes incompletas");
        }

        const newUser = new User(
            nome, 
            cpf,
            emai,
            categoria,
            curso
        );
        this.userRepository.create(newUser);
        return newUser;
    }

    listUsers(): User[] {
        return this.userRepository.list();
    }
    // ... outros mé todos
}