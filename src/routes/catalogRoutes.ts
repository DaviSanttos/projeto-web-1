import { Router } from 'express';
import { createUser, listUsers } from '../controllers/UserController';

const catalogRoutes = Router();

catalogRoutes.get('/categorias-usuario', createUser);
catalogRoutes.get('/categorias-livro', createUser);
catalogRoutes.get('/cursos', createUser);

export default catalogRoutes;
