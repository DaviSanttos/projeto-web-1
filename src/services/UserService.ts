import { User } from "../models/entity/UserEntity";
import { UserRepository } from "../repositories/UserRepository";
import { validateCPF } from "../validators/validateCpf";
import CourseService from "./CourseService";
import { LoanService } from "./LoanService";
import UserCategoryService from "./UserCategoryService";

export class UserService {
    userRepository = UserRepository.getInstance();
    courseService = CourseService;
    userCategoryService = UserCategoryService;

    async createUser(userData: any): Promise<User> {
        const nome = userData?.nome;
        const cpf = userData?.cpf;
        const categoria = userData?.categoria;
        const curso = userData?.curso;


        if (!nome || !cpf || !categoria || !curso) {
            throw new Error("Informacoes incompletas");
        }

        validateCPF(cpf);

        const exists = await this.userRepository.existsByCpf(cpf);
        if (exists) throw new Error("Usuário já cadastrado com esse CPF");

        const curso_id = await this.courseService.findCourseIdByname(curso);
        const categoria_id = await this.userCategoryService.findUserCategoryIdByname(categoria);

        const newUser = new User(
            nome,
            cpf,
            categoria_id,
            curso_id
        );
        this.userRepository.create(newUser);
        return newUser;
    }

    async listUsers(params: any): Promise<User[]> {
        const userList = await this.userRepository.list();

        let curso_id: number;
        let categoria_id: number;

        if (params.curso) curso_id = await this.courseService.findCourseIdByname(params?.curso);
        if (params.categoria) categoria_id = await this.userCategoryService.findUserCategoryIdByname(params?.categoria);

        return userList.filter((user: any) => {
            return (
                (!params?.nome || user.nome.toLowerCase().includes(params.nome.toLowerCase())) &&
                (!params?.cpf || user.cpf.includes(params.cpf)) &&
                (!params?.ativo || user.ativo === params.ativo) &&
                (!categoria_id || user.categoria_id === categoria_id) &&
                (!curso_id || user.curso_id === curso_id)
            );
        });
    }

    async findUserByCpf(cpf: string): Promise<User | undefined> {
        validateCPF(cpf);

        const user = await this.userRepository.findByCpf(cpf);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        return user;
    }

    async updateUserByCpf(cpf: string, body: any): Promise<User> {
        validateCPF(cpf);

        const user = await this.userRepository.findByCpf(cpf);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const categoria_id = await this.userCategoryService.findUserCategoryIdByname(body.categoria);
        const curso_id = await this.courseService.findCourseIdByname(body.curso);

        const userUpdate: Partial<User> = {
            nome: body.nome,
            ativo: body.ativo,
            categoria_id,
            curso_id
        }


        const newUser = await this.userRepository.updateById(user.id, userUpdate);
        return newUser;
    }

    async deleteUserByCpf(cpf: string): Promise<User> {
        validateCPF(cpf);

        const loanService = new LoanService();
        const user = await this.userRepository.findByCpf(cpf);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const loans = await loanService.findLoansByUserId(user.id);

        if (loans.length > 0) {
            throw new Error("Usuário não pode ser excluído, pois possui empréstimos pendentes.");
        }

        return await this.userRepository.deleteUserById(user.id);
    }

    async findById(id: number): Promise<User | undefined> {
        return await this.userRepository.findById(id);
    }
}