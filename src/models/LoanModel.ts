import { Time } from "../utils/Time";

export class Loan {
    id: number;
    usuario_id: number;
    estoque_id: number;
    data_emprestimo: Date;
    data_devolucao?: Date;
    data_entrega?: Date;
    dias_atraso: number;
    suspensao_ate?: Date

    constructor(
        usuario_id: number, 
        estoque_id: number, 
        data_entrega?: Date
    ) {
        this.usuario_id = usuario_id;
        this.estoque_id = estoque_id;
        this.data_emprestimo = Time.nowInBrazil();
        this.data_entrega = data_entrega ?? Time.addDays(Time.nowInBrazil(), 80);
        this.dias_atraso = 0;
        this.id = this.generateId();
    }

    private generateId(): number {
        return Date.now();
    }
}