import { Request, Response } from "express";
import { LoanService } from "../services/LoanService";
import LoanRules from "../rules/LoanRules";

const loanService = new LoanService();
const loanRules = new LoanRules()

export function createLoan(req: Request, res: Response) {
    try {
        const loanData = req.body;
        const cpf = loanData?.cpf;
        const codigo_exemplar = loanData?.codigo_exemplar;

        loanRules.validate(
            { cpf, isRequiredField: true },
            { codigo_exemplar, isRequiredField: true }
        );

        const newLoan = loanService.createLoan(loanData);
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

        loanRules.validate(
            { id, isRequiredField: true }
        );

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