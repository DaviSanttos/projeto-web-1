import { User } from "../models/UserModel";
import { UserRepository } from "../repositories/UserRepository";
import { validateCPF } from "../validators/validateCpf";

export class UserService {
    userRepository = UserRepository.getInstance();

    createUser(userData: any): User {
        const nome = userData?.nome;
        const cpf = userData?.cpf;
        const email = userData?.email;
        const categoria = userData?.categoria;
        const curso = userData?.curso;

        if (!nome || !cpf || !email || !categoria || !curso) {
            throw new Error("Informacoes incompletas");
        }

        validateCPF(cpf);
        // preciso do service de curos aqui para pegar o id curso pelo nome

        const curso_id = 1;
        const categoria_id = 1;
        // service de categoria tmb

        const newUser = new User(
            nome,
            cpf,
            categoria_id,
            curso_id,
            email
        );
        this.userRepository.create(newUser);
        return newUser;
    }

    listUsers(params: any): User[] {
        const userList = this.userRepository.list();

        console.log(params)

        return userList.filter((user: any) => {
            return (
                (!params?.nome || user.nome.toLowerCase().includes(params.nome.toLowerCase())) &&
                (!params?.cpf || user.cpf.includes(params.cpf)) &&
                (!params?.email || user.email?.toLowerCase().includes(params.email.toLowerCase())) &&
                (params?.ativo === undefined || user.ativo === params.ativo) &&
                (!params?.categoria_id || user.categoria_id === parseInt(params.categoria_id)) &&
                (!params?.curso_id || user.curso_id === params.curso_id)
            );
        });
    }
    // ... outros mé todos
}