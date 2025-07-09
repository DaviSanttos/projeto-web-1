import { executarComandoSQL, executarComandoSQLAsync } from "../database/mysql";
import { Loan } from "../models/entity/LoanEntity";


export class LoanRepository {
  private static instance: LoanRepository;

  private constructor() { }

  public static getInstance(): LoanRepository {
    if (!this.instance) {
      this.instance = new LoanRepository();
    }
    return this.instance;
  }

  async create(loan: Loan): Promise<void> {
    const query = `
      INSERT INTO Emprestimo (
        id, usuario_id, estoque_id,
        data_emprestimo, data_devolucao,
        data_entrega, dias_atraso, suspensao_ate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      loan.id,
      loan.usuario_id,
      loan.estoque_id,
      loan.data_emprestimo,
      loan.data_devolucao ?? null,
      loan.data_entrega ?? null,
      loan.dias_atraso,
      loan.suspensao_ate ?? null
    ];

    await executarComandoSQLAsync(query, params);
  }

  async list(): Promise<Loan[]> {
    const query = `SELECT * FROM Emprestimo`;
    const result = await executarComandoSQLAsync(query, []);
    return result as Loan[];
  }

  async findById(id: number): Promise<Loan | undefined> {
    const query = `SELECT * FROM Emprestimo WHERE id = ?`;
    const result = await executarComandoSQLAsync(query, [id]);
    return result[0] as Loan | undefined;
  }

  async updateReturnDateById(id: number): Promise<Loan> {
    const now = new Date();
    const query = `UPDATE Emprestimo SET data_devolucao = ? WHERE id = ?`;
    await executarComandoSQLAsync(query, [now, id]);

    const updatedLoan = await this.findById(id);
    if (!updatedLoan) throw new Error("Empréstimo não encontrado");
    return updatedLoan;
  }

  async updateOne(loan: Loan): Promise<Loan> {
    const query = `
      UPDATE Emprestimo SET 
        usuario_id = ?, estoque_id = ?, data_emprestimo = ?, 
        data_devolucao = ?, data_entrega = ?, dias_atraso = ?, 
        suspensao_ate = ?
      WHERE id = ?
    `;

    const params = [
      loan.usuario_id,
      loan.estoque_id,
      loan.data_emprestimo,
      loan.data_devolucao ?? null,
      loan.data_entrega ?? null,
      loan.dias_atraso,
      loan.suspensao_ate ?? null,
      loan.id
    ];

    await executarComandoSQLAsync(query, params);
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
        id INT AUTO_INCREMENT PRIMARY KEY,
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