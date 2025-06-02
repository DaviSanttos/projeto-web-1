import { User } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
    userRepository = UserRepository.getInstance();

    createUser(userData: any): User {
        const { nome, cpf, ativo, categoria, curso_id } = userData;

        if (!nome || !cpf || !ativo) {
            throw new Error("Informacoes incompletas");
        }

        const newUser = new User(
            nome, 
            cpf,
            ativo,
            categoria,
            curso_id
        );
        this.userRepository.create(newUser);
        return newUser;
    }

    listUsers(): User[] {
        return this.userRepository.list();
    }
    // ... outros mé todos
}