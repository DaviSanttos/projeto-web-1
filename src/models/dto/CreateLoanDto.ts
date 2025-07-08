export class CreateLoanDto {
    codigo_exemplar: number;
    cpf: string;

    constructor(
        codigo_exemplar: number,
        cpf: string,
    ) {
        this.codigo_exemplar = codigo_exemplar;
        this.cpf = cpf;
    }
}