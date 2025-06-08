import { Book } from "../models/BookModel";
import { Stock } from "../models/StockModel";
import { StockRepository } from "../repositories/StockRepository";

export class StockService {
    stockRepository = StockRepository.getInstance();

    createCopy(copyData: any): any {
        const livro_id = copyData?.ISBN;
        const id = copyData?.codigo_exemplar;

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

    updateAvailability(codigo: string, availaBility: boolean): Stock {
        const copyId = parseInt(codigo);

        const copy = this.stockRepository.findById(copyId);
        if (!copy) throw new Error("Exemplar não encontrado");

        if (!availaBility) throw new Error("Envie o status de disponibilidade");

        const updatedCopy = this.stockRepository.updateAvalabilityById(copyId, availaBility);
        return updatedCopy;
    }

    deleteCopyById(codigo: string): Stock {
        // TODO deletar somente se nao estiver emprestado
        
        const copyId = parseInt(codigo);

        const exists = this.stockRepository.existsById(copyId);
        if (!exists) throw new Error("Exemplar não encontrado");

        return this.stockRepository.deleteById(copyId);
    }
}