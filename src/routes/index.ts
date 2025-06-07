import { Router } from 'express';
import userRoutes from './userRoutes';
import bookRoutes from './bookRoutes';
import loanRoutes from './loanRoutes';
import stockRoutes from './stockRoutes';
import catalogRoutes from './catalogRoutes';

const router = Router();

router.use('/usuarios', userRoutes);
router.use('/livros', bookRoutes);
router.use('/emprestimo', loanRoutes);
router.use('/estoque', stockRoutes);
router.use('/catalogos', catalogRoutes);

export default router;
