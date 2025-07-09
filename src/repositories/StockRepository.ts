import { executarComandoSQL } from "../database/mysql";
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

  create(stock: Stock) {
    this.stocklist.push(stock);
  }

  list() {
    return this.stocklist;
  }

  existsById(id: number): boolean {
    return this.stocklist.some(stock => stock.id === id);
  }

  findById(id: number): Stock | undefined {
    return this.stocklist.find(stock => stock.id === id);
  }

  updateAvalabilityById(id: number, availaBility: boolean): Stock {
    const index = this.stocklist.findIndex((u: Stock) => u.id === id);

    this.stocklist[index].disponivel = availaBility;

    return this.stocklist[index];
  }

  deleteById(id: number): Stock {
    const index = this.stocklist.findIndex((u: Stock) => u.id === id);
    const deletedCopy = this.stocklist[index];

    this.stocklist.splice(index, 1);
    return deletedCopy;
  }

  setAvalabilityFalseAndIncrementById(id: number): Stock {
    const index = this.stocklist.findIndex((u: Stock) => u.id === id);

    this.stocklist[index].disponivel = false;
    this.stocklist[index].quantidade_emprestada = 1;

    return this.stocklist[index];
  }


  imprimeResult(err: any, result: any) {
    if (err) {
      console.error('Erro no callback:', err);
    } else if (result !== undefined) {
      console.log('Dentro do callback:', result);
    }
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