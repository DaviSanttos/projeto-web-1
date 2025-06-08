import { Router } from 'express';
import { listBookCategories, listCourses, listUserCategories } from '../controllers/CatalogController';

const catalogRoutes = Router();

catalogRoutes.get('/categorias-usuario', listUserCategories);
catalogRoutes.get('/categorias-livro', listBookCategories);
catalogRoutes.get('/cursos', listCourses);

export default catalogRoutes;
