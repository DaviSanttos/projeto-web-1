import express from 'express';
import router  from './routes'

const app = express();
const PORT = 3090;

app.use(express.json());
app.use('/library', router);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
