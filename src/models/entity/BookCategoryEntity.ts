export enum BookCategoryEnum {
    ROMANCE = "Romance",
    COMPUTACAO = "Computação",
    LETRAS = "Letras",
    GESTAO = "Gestão"
}

export class BookCategory {
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