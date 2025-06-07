import { Router } from 'express';
import { createUser, listUsers } from '../controllers/UserController';

const stockRoutes = Router();

stockRoutes.post('/', createUser);
stockRoutes.get('/', listUsers);
stockRoutes.get('/:codigo', createUser);
stockRoutes.put('/:codigo', createUser);
stockRoutes.delete('/:codigo', createUser);

export default stockRoutes;
