export class Stock {
    id: number;
    livro_id: number;
    quantidade: number;
    quantidade_emprestada: number;
    disponivel: boolean;

    constructor(
        livro_id: number, 
        id: number
    ) {
        this.livro_id = livro_id;
        this.quantidade = 1;
        this.quantidade_emprestada = 0;
        this.disponivel = true;
        this.id = id;
    }
}