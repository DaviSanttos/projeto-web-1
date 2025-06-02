import { Router } from 'express';
import { createUser, listUsers } from '../controllers/userController';

const router = Router();

router.get('/list', listUsers);
router.post('/', createUser);

export default router;
