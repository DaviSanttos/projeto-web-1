import { Book } from "../models/BookModel";
import { Loan } from "../models/LoanModel";
import { User, userActive } from "../models/UserModel";
import { LoanRepository } from "../repositories/LoanRepository";
import { Time } from "../utils/Time";
import { BookService } from "./BookService";
import { StockService } from "./StockService";
import { UserService } from "./UserService";

export class LoanService {
    loanRepository = LoanRepository.getInstance();
    userService = new UserService();
    stockService = new StockService();
    bookService = new BookService();

    createLoan(loanData: any): Loan {
        const cpf = loanData?.cpf;
        const codigo_exemplar = loanData?.codigo_exemplar;

        if (!cpf || !codigo_exemplar) {
            throw new Error("Informacoes incompletas");
        }

        const user = this.userService.findUserByCpf(cpf);
        if (!user) throw new Error("Usuário não encontrado");

        if (user.ativo != userActive.ATIVO) throw new Error("Somente usuários ativos podem realizar empréstimos");

        this.checkLimitByCategory(user);

        const copy = this.stockService.findCopyById(codigo_exemplar);
        if (!copy) throw new Error("Exemplar não encontrado");

        if (copy.disponivel === false) throw new Error("Exemplar não disponível para empréstimo");

        this.stockService.setAvailabilityFalseAndIncrementQuantity(codigo_exemplar);

        const data_entrega = this.getDeliveryDate(user, copy.livro_id);

        const newLoan = new Loan(
            user.id,
            copy.id,
            data_entrega
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

    findLoansByUserId(userId: number): Loan[] {
        const loans = this.loanRepository.list();
        const userLoans = loans.filter(loan => loan.usuario_id === userId && !loan.data_devolucao);

        return userLoans;
    }

    private checkLimitByCategory(user: User): void {
        const loans = this.findLoansByUserId(user.id);

        if (user.categoria_id === 1 && loans.length >= 3) {
            throw new Error("Usuários da categoria Aluno podem ter no máximo 3 empréstimos ativos");
        } else if (user.categoria_id === 2 && loans.length >= 5) {
            throw new Error("Usuários da categoria Professor podem ter no máximo 5 empréstimos ativos");
        }
    }


    private getDeliveryDate(user: User, bookId: number): Date | undefined {
        if (user.categoria_id === 2) return Time.addDays(Time.nowInBrazil(), 30);

        if (user.categoria_id === 1) {
            const hasRelacion = this.bookService.getRelacionCourseToBookCategory(user.curso_id, bookId);

            if (hasRelacion) {
                return Time.addDays(Time.nowInBrazil(), 30);
            } else {
                return Time.addDays(Time.nowInBrazil(), 15);
            }
        }
    }

    findLoansByCopyIds(copiesIds: number[]): Loan[] {
        const loans = this.loanRepository.list();
        const filteredLoans = loans.filter(loan => copiesIds.includes(loan.estoque_id) && !loan.data_devolucao);

        return filteredLoans;
    }

    updateLoan(loan: Loan): void {
        const existingLoan = this.loanRepository.findById(loan.id);
        if (!existingLoan) throw new Error("Empréstimo não encontrado");
        
        this.loanRepository.updateOne(existingLoan);
    }
}