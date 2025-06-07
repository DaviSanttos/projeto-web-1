import { Router } from 'express';
import { createUser, listUsers } from '../controllers/UserController';

const loanRoutes = Router();

loanRoutes.post('/', createUser);
loanRoutes.get('/', createUser);
loanRoutes.put('/:id/devolucao', createUser);

export default loanRoutes;
