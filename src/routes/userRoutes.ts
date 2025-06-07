import { Router } from 'express';
import { createUser, listUsers } from '../controllers/UserController';

const userRoutes = Router();

userRoutes.post('/', createUser);
userRoutes.get('/', listUsers);
userRoutes.get('/:cpf', createUser);
userRoutes.put('/:cpf', createUser);
userRoutes.delete('/:cpf', createUser);

export default userRoutes;
