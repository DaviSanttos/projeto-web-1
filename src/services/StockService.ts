import { Book } from "../models/BookModel";
import { Stock } from "../models/StockModel";
import { StockRepository } from "../repositories/StockRepository";
import { BookService } from "./BookService";

export class StockService {
    stockRepository = StockRepository.getInstance();
    bookService = new BookService();

    createCopy(copyData: any): any {
        // const isbn = copyData?.ISBN;
        // const id = copyData?.codigo_exemplar;
        const { ISBN: isbn, codigo_exemplar: id } = copyData;

        const livro_id = this.bookService.findBookByIsbn(isbn)?.id;
        if (!livro_id) throw new Error("Livro não encontrado com esse ISBN");

        const exists = this.stockRepository.existsById(parseInt(id));
        if (exists) throw new Error("Exemplar já cadastrado Com esse código");

        if (!livro_id || !id) {
            throw new Error("Informacoes incompletas");
        }

        const newCopy = new Stock(
            livro_id,
            parseInt(id),
        );
        this.stockRepository.create(newCopy);
        return newCopy;
    }

    listCopies(): Stock[] {
        return this.stockRepository.list().filter((copy) => copy.disponivel === true);
    }

    findCopyById(codigo: string): Stock {
        const copyId = parseInt(codigo);

        const copy = this.stockRepository.findById(copyId);
        if (!copy) throw new Error("Exemplar não encontrado");
    
        return copy;
    }

    updateAvailability(codigo: number, availaBility: boolean): Stock {
        const copyId = codigo;

        const copy = this.stockRepository.findById(copyId);
        if (!copy) throw new Error("Exemplar não encontrado");

        const updatedCopy = this.stockRepository.updateAvalabilityById(copyId, availaBility);
        return updatedCopy;
    }

    deleteCopyById(codigo: string): Stock {
        const copyId = parseInt(codigo);

        const copy = this.stockRepository.findById(copyId);
        if (!copy) throw new Error("Exemplar não encontrado");

        if (!copy.disponivel) throw new Error("Exemplar não pode ser deletado, pois está emprestado");
        return this.stockRepository.deleteById(copyId);
    }

    setAvailabilityFalseAndIncrementQuantity(codigo: string): Stock {
        const copyId = parseInt(codigo);

        const updatedCopy = this.stockRepository.setAvalabilityFalseAndIncrementById(copyId);
        return updatedCopy;
    }

    findCopiesByBookId(livro_id: number): Stock[] {
        return this.stockRepository.list().filter((copy) => copy.livro_id === livro_id);
    }
}