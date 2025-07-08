export enum UserCategoryName {
    ALUNO = "Aluno",
    PROFESSOR = "Professor",
    BIBLIOTECARIO = "Bibliotecário"
}

export class UserCategory {
    id: number;
    nome: string;

    constructor(
        nome: string,
        id: number
    ) {
        this.nome = nome;
        this.id = id;
    }
}