import express from 'express';
import router  from './routes';
import { routineLoan } from './routines/routineLoan';
import { seedData } from './seed';

const app = express();
const PORT = 3090;

const loanRoutine = new routineLoan();
loanRoutine.start();

seedData();

app.use(express.json());
app.use('/library', router);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
