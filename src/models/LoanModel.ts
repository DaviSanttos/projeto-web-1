export class Loan {
    id: number;
    usuario_id: number;
    estoque_id: number;
    data_emprestimo: Date = new Date();
    data_devolucao?: Date;
    data_entrega?: Date;
    dias_atraso?: number;
    suspensao_ate?: Date

    constructor(
        usuario_id: number, 
        estoque_id: number, 
        data_emprestimo: Date = new Date(),
        data_entrega: Date = new Date(),
    ) {
        this.usuario_id = usuario_id;
        this.estoque_id = estoque_id;
        this.data_emprestimo = data_emprestimo;
        this.data_entrega = data_entrega;
        this.dias_atraso = 1;
        this.suspensao_ate = new Date();
        this.id = this.generateId();
    }

    private generateId(): number {
        return Date.now();
    }
}