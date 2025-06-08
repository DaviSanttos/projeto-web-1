import { Book } from "../models/BookModel";
import { Loan } from "../models/LoanModel";
import { User } from "../models/UserModel";
import { LoanRepository } from "../repositories/LoanRepository";
import { StockService } from "./StockService";
import { UserService } from "./UserService";

export class LoanService {
    loanRepository = LoanRepository.getInstance();
    userService = new UserService();
    stockService = new StockService();

    createLoan(loanData: any): Loan {
        const cpf = loanData?.cpf;
        const codigo_exemplar = loanData?.codigo_exemplar;

        if (!cpf || !codigo_exemplar) {
            throw new Error("Informacoes incompletas");
        }

        const user = this.userService.findUserByCpf(cpf);
        if (!user) throw new Error("Usuário não encontrado");

        const copy = this.stockService.findCopyById(codigo_exemplar);
        if (!copy) throw new Error("Exemplar não encontrado");

        const newLoan = new Loan(
            user.id, 
            copy.id
        );

        this.loanRepository.create(newLoan);
        return newLoan;
    }

    listLoans(): any[] {
        return this.loanRepository.list();
    }

    updateReturnDateById(id: string): Loan {
        const loanId = parseInt(id);

        const loan = this.loanRepository.findById(loanId);
        if (!loan) throw new Error("Empréstimo não encontrado");

        const updatedLoan = this.loanRepository.updateReturnDateById(loanId);
        return updatedLoan;
    }
}