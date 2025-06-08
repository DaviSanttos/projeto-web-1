import { Router } from 'express';
import { createBook, deleteBookByIsbn, findBookByIsbn, listBooks, updateBookByIsbn } from '../controllers/BookController';
import { createUser } from '../controllers/UserController';

const bookRoutes = Router();

bookRoutes.post('/', createBook);
bookRoutes.get('/', listBooks);
bookRoutes.get('/:isbn', findBookByIsbn);
bookRoutes.put('/:isbn', updateBookByIsbn);
bookRoutes.delete('/:isbn', deleteBookByIsbn);

export default bookRoutes;
