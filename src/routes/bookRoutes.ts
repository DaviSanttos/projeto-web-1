import { Router } from 'express';
import { createUser, listUsers } from '../controllers/UserController';

const bookRoutes = Router();

bookRoutes.post('/', createUser);
bookRoutes.get('/', createUser);
bookRoutes.get('/:isbn', createUser);
bookRoutes.put('/:isbn', createUser);
bookRoutes.delete('/:isbn', createUser);

export default bookRoutes;
