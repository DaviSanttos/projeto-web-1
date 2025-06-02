import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

router.use('/users', userRoutes);
// router.use('/books', bookRoutes);
// router.use('/loans', loanRoutes);
// router.use('/stock', stockRoutes);

export default router;
