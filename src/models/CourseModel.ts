export class Course {
    id: number;
    nome: string;

    constructor(
        nome: string, 
    ) {
        this.nome = nome;
        this.id = this.geraId();
    }

    private geraId(): number {
        return Date.now();
    }
}