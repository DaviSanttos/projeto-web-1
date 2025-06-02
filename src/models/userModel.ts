export class User {
    id: number;
    nome: string;
    cpf: string;
    ativo: number;
    categoria: number;
    curso_id: number;

    constructor(
        nome: string, 
        cpf: string, 
        ativo: number,
        categoria: number,
        curso_id: number
    ) {
        this.nome = nome;
        this.cpf = cpf;
        this.ativo = ativo;
        this.categoria = categoria;
        this.curso_id = curso_id;
        this.id = this.geraId();
    }

    private geraId(): number {
        return Date.now();
    }
}