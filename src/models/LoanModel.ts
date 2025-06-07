export class Loan {
    id: number;
    usuario_id: string;
    estoque_id: string;
    data_emprestimo: string;
    data_devolucao: string;
    data_entrega: string;
    dias_atraso: number;
    suspensao_ate: Date

    constructor(
        usuario_id: string, 
        estoque_id: string, 
        data_emprestimo: string,
        data_devolucao: string,
        data_entrega: string,
        dias_atraso: number,
        suspensao_ate: Date
    ) {
        this.usuario_id = usuario_id;
        this.estoque_id = estoque_id;
        this.data_emprestimo = data_emprestimo;
        this.data_devolucao = data_devolucao;
        this.data_entrega = data_entrega;
        this.dias_atraso = dias_atraso;
        this.suspensao_ate = suspensao_ate;
        this.id = this.generateId();
    }

    private generateId(): number {
        return Date.now();
    }
}