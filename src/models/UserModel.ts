import { IdGenerator } from "../utils/IdGenerator";

export enum userActive {
    ATIVO = 'ativo',
    INATIVO = 'inativo',
    SUSPENSO = 'suspenso',
}

export const userActiveValues = Object.values(userActive);

export class User {
    id: number;
    nome: string;
    cpf: string;
    ativo: userActive = userActive.ATIVO;
    categoria_id: number;
    curso_id: number;

    constructor(
        nome: string, 
        cpf: string, 
        categoria_id: number,
        curso_id: number
    ) {
        this.nome = nome;
        this.cpf = cpf;
        this.ativo = userActive.ATIVO;
        this.categoria_id = categoria_id;
        this.curso_id = curso_id;
        this.id = IdGenerator.generate();
    }
}