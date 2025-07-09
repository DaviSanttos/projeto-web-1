import { executarComandoSQL } from "../database/mysql";
import { Loan } from "../models/entity/LoanEntity";


export class LoanRepository {
  private static instance: LoanRepository;
  private loanlist: Loan[] = [];

  private constructor() { }

  public static getInstance(): LoanRepository {
    if (!this.instance) {
      this.instance = new LoanRepository();
    }
    return this.instance;
  }

  create(loan: Loan) {
    this.loanlist.push(loan);
  }

  list() {
    return this.loanlist;
  }

  findById(id: number): Loan | undefined {
    return this.loanlist.find(loan => loan.id === id);
  }

  updateReturnDateById(id: number): Loan {
    const index = this.loanlist.findIndex((l: Loan) => l.id === id);

    const updatedLoan = this.loanlist[index];
    updatedLoan.data_devolucao = new Date();

    return updatedLoan;
  }

  updateOne(loan: Loan): Loan {
    const index = this.loanlist.findIndex((l: Loan) => l.id === loan.id);
    if (index === -1) throw new Error("Empréstimo não encontrado");

    this.loanlist[index] = loan;
    return loan;
  }

  imprimeResult(err: any, result: any) {
    if (err) {
      console.error('Erro no callback:', err);
    } else if (result !== undefined) {
      console.log('Dentro do callback:', result);
    }
  }


  async createLoanTable() {
    try {
      const query = `
      CREATE TABLE IF NOT EXISTS Emprestimo (
        id BIGINT PRIMARY KEY,
        usuario_id INT NOT NULL,
        estoque_id INT NOT NULL,
        data_emprestimo DATETIME NOT NULL,
        data_devolucao DATETIME,
        data_entrega DATETIME,
        dias_atraso INT NOT NULL,
        suspensao_ate DATETIME,
        CONSTRAINT fk_usuario_emprestimo FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
        CONSTRAINT fk_estoque_emprestimo FOREIGN KEY (estoque_id) REFERENCES Estoque(id)
      )
    `;

      executarComandoSQL(query, [], this.imprimeResult);
      console.log('Tabela "Loan" criada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar a tabela "Loan":', err);
    }
  }
}