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
    // ... outros mé todos
}