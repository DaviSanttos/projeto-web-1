import { Request, Response } from "express";
import { LoanService } from "../services/LoanService";


const loanService = new LoanService();

export function createLoan(req: Request, res: Response) {
    try {
        const newLoan = loanService.createLoan(req.body);
        res.status(201).json(
            {
                mensagem: "Empréstimo cadastrado com sucesso!",
                loan: newLoan
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function listLoans(req: Request, res: Response) {
    try {
        const loans = loanService.listLoans();
        res.status(201).json(
            {
                mensagem: "Lista de empréstimos encontrada!",
                loans
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function updateReturnDateById(req: Request, res: Response) {
    try {
        const id = req.params.id;

        const updatedLoan = loanService.updateReturnDateById(id);

        res.status(201).json(
            {
                mensagem: "Empréstimo atualizado!",
                updatedLoan
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};