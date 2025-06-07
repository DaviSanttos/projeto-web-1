import { Book } from "../models/BookModel";
import { Loan } from "../models/LoanModel";
import { LoanRepository } from "../repositories/LoanRepository";

export class LoanService {
    loanRepository = LoanRepository.getInstance();

    createUser(userData: any): any {
        const { titulo, autor, editora, edicao, isbn, categoria_id } = userData;

        if (!titulo || !autor || !editora) {
            throw new Error("Informacoes incompletas");
        }

        // Assuming you meant to create a Book, not a User, since the return type is Book
        // const newBook = new Loan(
        //     titulo, 
        //     autor, 
        //     editora,
        //     edicao,
        //     isbn,
        //     categoria_id
        // );
        // this.loanRepository.create(newBook);
        // return newBook;
    }

    listUsers(): any[] {
        return this.loanRepository.list();
    }
    // ... outros mé todos
}