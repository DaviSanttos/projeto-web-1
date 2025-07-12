import express from 'express';
import { setupSwagger } from './config/swagger';
import { RegisterRoutes } from './route/routes';
import { ValidateError } from 'tsoa';
import { BookRepository } from './repositories/BookRepository';
import { UserRepository } from './repositories/UserRepository';
import { LoanRepository } from './repositories/LoanRepository';
import { StockRepository } from './repositories/StockRepository';
import { UserCategoryRepository } from './repositories/UserCategoryRepository';
import { BookCategoryRepository } from './repositories/BookCategoryRepository';
import { CourseRepository } from './repositories/CourseRepository';
import { routineLoanSuspension } from './routines/routineLoanSuspension';
import { routineUserReactivationRoutine } from './routines/routineUserReactivation';

const bookRepository = BookRepository.getInstance();
const userRepository = UserRepository.getInstance();
const loanRepository = LoanRepository.getInstance();
const stockRepository = StockRepository.getInstance();
const userCategoryRepository = UserCategoryRepository.getInstance();
const bookCategoryRepository = BookCategoryRepository.getInstance();
const courseRepository = CourseRepository.getInstance();

// new routineLoanSuspension().start();
new routineUserReactivationRoutine().start();

const app = express();
const PORT = 3090;

app.use(express.json());

const apiRouter = express.Router();
RegisterRoutes(apiRouter);
app.use('/library', apiRouter);

setupSwagger(app);

initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

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

async function initializeDatabase() {
  try {
    await userCategoryRepository.createUserCategoryTable();
    await userCategoryRepository.insertDefaultCategories();

    await bookCategoryRepository.createBookCategoryTable();
    await bookCategoryRepository.insertDefaultBookCategories();

    await courseRepository.createCourseTable();
    await courseRepository.insertDefaultCourses();

    await userRepository.createUserTable();
    await bookRepository.createBookTable();
    await stockRepository.createStockTable();
    await loanRepository.createLoanTable();

    console.log('Todas as tabelas criadas e dados iniciais inseridos!');
  } catch (error) {
    console.error('Erro na inicialização do banco de dados:', error);
    process.exit(1);
  }
}


