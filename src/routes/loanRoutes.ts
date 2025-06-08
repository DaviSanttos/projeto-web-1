import { Router } from 'express';
import { createLoan, listLoans, updateReturnDateById } from '../controllers/LoanController';

const loanRoutes = Router();

loanRoutes.post('/', createLoan);
loanRoutes.get('/', listLoans);
loanRoutes.put('/:id/devolucao', updateReturnDateById);

export default loanRoutes;
