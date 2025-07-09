import { Book } from "../models/entity/BookEntity";
import { Stock } from "../models/entity/StockEntity";
import { StockRepository } from "../repositories/StockRepository";
import { BookService } from "./BookService";

export class StockService {
  stockRepository = StockRepository.getInstance();
  bookService = new BookService();

  async createCopy(copyData: any): Promise<any> {
    const {isbn, codigo_exemplar: id } = copyData;

    const livro = await this.bookService.findBookByIsbn(isbn);
    if (!livro) throw new Error("Livro não encontrado com esse ISBN");

    const exists = await this.stockRepository.existsById(Number(id));
    if (exists) throw new Error("Exemplar já cadastrado Com esse código");

    const livro_id = livro.id;

    if (!livro_id || !id) {
      throw new Error(`Informacoes incompletas ${livro_id} ${id}`);
    }

    const newCopy = new Stock(
      livro_id,
      parseInt(id),
    );
    this.stockRepository.create(newCopy);
    return newCopy;
  }

  async listCopies(): Promise<Stock[]> {
    const copies = await this.stockRepository.list();
    return copies.filter(copy => copy.disponivel);
  }

  async findCopyById(codigo: string): Promise<Stock> {
    const copyId = parseInt(codigo);

    const copy = await this.stockRepository.findById(copyId);
    if (!copy) throw new Error("Exemplar não encontrado");

    return copy;
  }

  async updateAvailability(codigo: number, availaBility: boolean): Promise<Stock> {
    const copyId = codigo;

    const copy = await this.stockRepository.findById(copyId);
    if (!copy) throw new Error("Exemplar não encontrado");

    const updatedCopy = await this.stockRepository.updateAvalabilityById(copyId, availaBility);
    return updatedCopy;
  }

  async deleteCopyById(codigo: string): Promise<Stock> {
    const copyId = parseInt(codigo);

    const copy = await this.stockRepository.findById(copyId);
    if (!copy) throw new Error("Exemplar não encontrado");

    if (!copy.disponivel) throw new Error("Exemplar não pode ser deletado, pois está emprestado");
    return await this.stockRepository.deleteById(copyId);
  }

  async setAvailabilityFalseAndIncrementQuantity(codigo: string): Promise<Stock> {
    return await this.stockRepository.setAvalabilityFalseAndIncrementById(Number(codigo));
  }

  async findCopiesByBookId(livro_id: number): Promise<Stock[]> {
    return await this.stockRepository.findCopiesByBookId(livro_id);
  }
}