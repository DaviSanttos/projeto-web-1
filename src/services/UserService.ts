import { User, userActiveValues } from "../models/UserModel";
import { UserRepository } from "../repositories/UserRepository";
import { validateCPF } from "../validators/validateCpf";
import CourseService from "./CourseService";
import UserCategoryService from "./UserCategoryService";

export class UserService {
    userRepository = UserRepository.getInstance();
    courseService =  CourseService;
    userCategoryService = UserCategoryService;

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

        const curso_id = this.courseService.findCourseIdByname(curso);
        const categoria_id = this.userCategoryService.findUserCategoryIdByname(categoria);

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

    findUserByCpf(cpf: string): User {
        validateCPF(cpf);

        const user = this.userRepository.findByCpf(cpf);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        return user;
    }

    updateUserByCpf(cpf: string, body: Partial<User>): User {
        validateCPF(cpf);

        // TODO pegar curso
        // TODO pegar caegoria 
        if (body?.ativo && !userActiveValues.includes(body.ativo)) {
            throw new Error("Status inválido. Valores válidos: " + userActiveValues.join(", "));
        }

        const userUpdate: Partial<User> = {
            nome: body.nome,
            email: body.email,
            ativo: body.ativo,
            // categoria_id: body.categoria_id,
            // curso_id: body.curso_id
        }

        const user = this.userRepository.findByCpf(cpf);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const newUser = this.userRepository.updateById(user.id, userUpdate);
        return newUser;
    }

    deleteUserByCpf(cpf: string): User {
        validateCPF(cpf);

        const user = this.userRepository.findByCpf(cpf);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return this.userRepository.deleteUserById(user.id);
    }
}