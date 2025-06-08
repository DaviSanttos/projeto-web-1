import { Router } from 'express';
import { createUser, deleteUserByCpf, findUserByCpf, listUsers, updateUserByCpf } from '../controllers/UserController';

const userRoutes = Router();

userRoutes.post('/', createUser);
userRoutes.get('/', listUsers);
userRoutes.get('/:cpf', findUserByCpf);
userRoutes.put('/:cpf', updateUserByCpf);
userRoutes.delete('/:cpf', deleteUserByCpf);

export default userRoutes;
