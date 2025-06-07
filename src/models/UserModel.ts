export enum userActive {
    ATIVO = 'ativo',
    INATIVO = 'inativo',
    SUSPENSO = 'suspenso',
}

export class User {
    id: number;
    nome: string;
    cpf: string;
    ativo: userActive = userActive.ATIVO;
    categoria_id: number;
    curso_id: number;
    email?: string;

    constructor(
        nome: string, 
        cpf: string, 
        categoria_id: number,
        curso_id: number,
        email?: string
    ) {
        this.nome = nome;
        this.cpf = cpf;
        this.ativo = userActive.ATIVO;
        this.categoria_id = categoria_id;
        this.curso_id = curso_id;
        this.email = email;
        this.id = this.geraId();
    }

    private geraId(): number {
        return Date.now();
    }
}