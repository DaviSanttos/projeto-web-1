export class Stock {
    id: number;
    livro_id: string;
    quantidade: string;
    quantidade_emprestada: string;
    disponivel: string;

    constructor(
        livro_id: string, 
        quantidade: string, 
        quantidade_emprestada: string,
        disponivel: string,
    ) {
        this.livro_id = livro_id;
        this.quantidade = quantidade;
        this.quantidade_emprestada = quantidade_emprestada;
        this.disponivel = disponivel;
        this.id = this.generateId();
    }

    private generateId(): number {
        return Date.now();
    }
}