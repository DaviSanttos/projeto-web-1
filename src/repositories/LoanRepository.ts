import { Loan } from "../models/LoanModel";


export class LoanRepository {
    private static instance: LoanRepository;
    private loanlist: Loan[] = [];

    private constructor() { }

    public static getInstance(): LoanRepository {
        if (!this.instance) {
            this.instance = new LoanRepository();
        }
        return this.instance;
    }

    create(loan: Loan) {
        this.loanlist.push(loan);
    }

    list(){
        return this.loanlist;
    }

    findById(id: number): Loan | undefined {
        return this.loanlist.find(loan => loan.id === id);
    }

    updateReturnDateById(id: number): Loan {
        const index = this.loanlist.findIndex((l: Loan) => l.id === id);

        const updatedLoan = this.loanlist[index];
        updatedLoan.data_devolucao = new Date();

        return updatedLoan;
    }

    updateOne(loan: Loan): Loan {
        const index = this.loanlist.findIndex((l: Loan) => l.id === loan.id);
        if (index === -1) throw new Error("Empréstimo não encontrado");

        this.loanlist[index] = loan;
        return loan;
    }
}