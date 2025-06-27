import { Loan } from "../models/LoanModel";
import { User, userActiveValues } from "../models/UserModel";
import { UserRepository } from "../repositories/UserRepository";
import { validateCPF } from "../validators/validateCpf";
import CourseService from "./CourseService";
import { LoanService } from "./LoanService";
import UserCategoryService from "./UserCategoryService";

export class UserService {
    userRepository = UserRepository.getInstance();
    courseService = CourseService;
    userCategoryService = UserCategoryService;

    createUser(userData: any): User {
        const nome = userData?.nome;
        const cpf = userData?.cpf;
        const categoria = userData?.categoria;
        const curso = userData?.curso;


        if (!nome || !cpf || !categoria || !curso) {
            throw new Error("Informacoes incompletas");
        }

        validateCPF(cpf);

        const exists = this.userRepository.existsByCpf(cpf);
        if (exists) throw new Error("Usuário já cadastrado com esse CPF");

        const curso_id = this.courseService.findCourseIdByname(curso);
        const categoria_id = this.userCategoryService.findUserCategoryIdByname(categoria);

        const newUser = new User(
            nome,
            cpf,
            categoria_id,
            curso_id
        );
        this.userRepository.create(newUser);
        return newUser;
    }

    listUsers(params: any): User[] {
        const userList = this.userRepository.list();

        return userList.filter((user: any) => {
            return (
                (!params?.nome || user.nome.toLowerCase().includes(params.nome.toLowerCase())) &&
                (!params?.cpf || user.cpf.includes(params.cpf)) &&
                (!params?.ativo || user.ativo === params.ativo) &&
                (!params?.categoria_id || user.categoria_id === parseInt(params.categoria_id)) &&
                (!params?.curso_id || user.curso_id === params.curso_id)
            );
        });
    }

    findUserByCpf(cpf: string): User {
        validateCPF(cpf);

        const user = this.userRepository.findByCpf(cpf);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        return user;
    }

    updateUserByCpf(cpf: string, body: any): User {
        validateCPF(cpf);

        // if (!userActiveValues.includes(body.ativo)) {
        //     throw new Error("Status inválido. Valores válidos: " + userActiveValues.join(", "));
        // }

        const user = this.userRepository.findByCpf(cpf);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const categoria_id = this.userCategoryService.findUserCategoryIdByname(body.categoria);
        const curso_id = this.courseService.findCourseIdByname(body.curso);

        const userUpdate: Partial<User> = {
            nome: body.nome,
            ativo: body.ativo,
            categoria_id,
            curso_id
        }


        const newUser = this.userRepository.updateById(user.id, userUpdate);
        return newUser;
    }

    deleteUserByCpf(cpf: string): User {
        validateCPF(cpf);

        const loanService = new LoanService();
        const user = this.userRepository.findByCpf(cpf);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const loans = loanService.findLoansByUserId(user.id);

        if (loans.length > 0) {
            throw new Error("Usuário não pode ser excluído, pois possui empréstimos pendentes.");
        }

        return this.userRepository.deleteUserById(user.id);
    }

    findById(id: number): User | undefined {
        return this.userRepository.list().find(user => user.id === id);
    }
}