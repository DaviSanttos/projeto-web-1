import express from 'express';
import { setupSwagger } from './config/swagger';
import { RegisterRoutes } from './route/routes';
import { ValidateError } from 'tsoa';
import { BookRepository } from './repositories/BookRepository';

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

const bookRepository = BookRepository.getInstance();

bookRepository.createBookTable();

app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof ValidateError) {
    console.error("Validation Failed: ", err.fields);
    return res.status(422).json({
      message: "Erro de validação",
      details: err.fields,
    });
  }

  next(err);
});
