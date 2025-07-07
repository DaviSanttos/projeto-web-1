import express from 'express';
import { setupSwagger } from './config/swagger';
import { RegisterRoutes } from './route/routes';

const app = express();
const PORT = 3090;

app.use(express.json());

const apiRouter = express.Router();
RegisterRoutes(apiRouter);
app.use('/', apiRouter);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
