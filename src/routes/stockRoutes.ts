import { Router } from 'express';
import { createUser } from '../controllers/UserController';
import { createCopy, deleteCopyById, findCopyById, listCopies, updateAvailabilityById } from '../controllers/StockController';

const stockRoutes = Router();

stockRoutes.post('/', createCopy);
stockRoutes.get('/', listCopies);
stockRoutes.get('/:codigo', findCopyById);
stockRoutes.put('/:codigo', updateAvailabilityById);
stockRoutes.delete('/:codigo', deleteCopyById);

export default stockRoutes;
