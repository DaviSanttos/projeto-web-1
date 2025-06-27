import express from 'express';
import router  from './routes';
import { routineLoanSuspension } from './routines/routineLoanSuspension';
import { seedData } from './seed';
import { routineUserReactivationRoutine } from './routines/routineUserReactivation';

const app = express();
const PORT = 3090;

const loanSuspensionRoutine = new routineLoanSuspension();
const loanReactivationRoutine = new routineUserReactivationRoutine()

loanSuspensionRoutine.start();
loanReactivationRoutine.start();

// seedData();

app.use(express.json());
app.use('/library', router);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
