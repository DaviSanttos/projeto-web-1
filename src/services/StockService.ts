import { Book } from "../models/BookModel";
import { Stock } from "../models/StockModel";
import { StockRepository } from "../repositories/StockRepository";

export class StockService {
    stockRepository = StockRepository.getInstance();

    createUser(userData: any): any {
        const { titulo, autor, editora, edicao, isbn, categoria_id } = userData;

        if (!titulo || !autor || !editora) {
            throw new Error("Informacoes incompletas");
        }

        // Assuming you meant to create a Book, not a User, since the return type is Book
        // const newBook = new Book(
        //     titulo, 
        //     autor, 
        //     editora,
        //     edicao,
        //     isbn,
        //     categoria_id
        // );
        // this.stockRepository.create(newBook);
        // return newBook;
    }

    listUsers(): Stock[] {
        return this.stockRepository.list();
    }
    // ... outros mé todos
}