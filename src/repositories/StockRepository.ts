import { executarComandoSQL, executarComandoSQLAsync } from "../database/mysql";
import { Book } from "../models/entity/BookEntity";
import { Stock } from "../models/entity/StockEntity";


export class StockRepository {
  private static instance: StockRepository;
  private stocklist: Stock[] = [];

  private constructor() { }

  public static getInstance(): StockRepository {
    if (!this.instance) {
      this.instance = new StockRepository();
    }
    return this.instance;
  }

  async create(stock: Stock): Promise<void> {
    const query = `
      INSERT INTO Estoque (id, livro_id, quantidade, quantidade_emprestada, disponivel)
      VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
      stock.id,
      stock.livro_id,
      stock.quantidade,
      stock.quantidade_emprestada,
      stock.disponivel
    ];

    await executarComandoSQLAsync(query, params);
  }

  async list(): Promise<Stock[]> {
    const query = `SELECT * FROM Estoque`;
    const result = await executarComandoSQLAsync(query, []);
    return result as Stock[];
  }

  async existsById(id: number): Promise<boolean> {
    const query = `SELECT COUNT(*) as total FROM Estoque WHERE id = ?`;
    const result = await executarComandoSQLAsync(query, [id]);
    return result[0].total > 0;
  }

  async findById(id: number): Promise<Stock | undefined> {
    const query = `SELECT * FROM Estoque WHERE id = ?`;
    const result = await executarComandoSQLAsync(query, [id]);
    return result[0] as Stock | undefined;
  }

  async updateAvalabilityById(id: number, available: boolean): Promise<Stock> {
    const query = `UPDATE Estoque SET disponivel = ? WHERE id = ?`;
    await executarComandoSQLAsync(query, [available, id]);

    const updated = await this.findById(id);
    if (!updated) throw new Error("Exemplar não encontrado após atualização");
    return updated;
  }

  async deleteById(id: number): Promise<Stock> {
    const stock = await this.findById(id);
    if (!stock) throw new Error("Exemplar não encontrado");

    const query = `DELETE FROM Estoque WHERE id = ?`;
    await executarComandoSQLAsync(query, [id]);
    return stock;
  }

  async setAvalabilityFalseAndIncrementById(id: number): Promise<Stock> {
    const query = `
      UPDATE Estoque
      SET disponivel = false, quantidade_emprestada = quantidade_emprestada + 1
      WHERE id = ?
    `;
    await executarComandoSQLAsync(query, [id]);

    const updated = await this.findById(id);
    if (!updated) throw new Error("Exemplar não encontrado após atualização");
    return updated;
  }

  imprimeResult(err: any, result: any) {
    if (err) {
      console.error('Erro no callback:', err);
    } else if (result !== undefined) {
      console.log('Dentro do callback:', result);
    }
  }

  async findCopiesByBookId(livro_id: number): Promise<Stock[]> {
    const query = `SELECT * FROM Estoque WHERE livro_id = ?`;
    const result = await executarComandoSQLAsync(query, [livro_id]);
    return result as Stock[];
  }

  async createStockTable() {
    try {
      const query = `
      CREATE TABLE IF NOT EXISTS Estoque (
        id INT PRIMARY KEY,
        livro_id INT NOT NULL,
        quantidade INT NOT NULL,
        quantidade_emprestada INT NOT NULL,
        disponivel BOOLEAN NOT NULL,
        CONSTRAINT fk_livro_estoque FOREIGN KEY (livro_id) REFERENCES Livro(id)
      )
    `;

      executarComandoSQL(query, [], this.imprimeResult);
      console.log('Tabela "Estoque" criada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar a tabela "Estoque":', err);
    }
  }
}