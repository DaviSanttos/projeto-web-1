import { CourseName } from "../entity/CourseEntity";
import { UserCategoryName } from "../entity/UserCategoryEntity";

export class CreateUserDto {
    nome: string;
    cpf: string;
    categoria: UserCategoryName;
    curso: CourseName;

    constructor(
        nome: string,
        cpf: string,
        categoria: UserCategoryName,
        curso: CourseName,
    ) {
        this.nome = nome;
        this.cpf = cpf;
        this.categoria = categoria;
        this.curso = curso;
    }
}