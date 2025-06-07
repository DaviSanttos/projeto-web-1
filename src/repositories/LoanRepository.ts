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
    // ... outros mé todos
}