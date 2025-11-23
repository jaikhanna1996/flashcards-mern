import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongooseConnect from './config/db';
import healthRouter from './routes/health';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/health', healthRouter);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

async function start() {
  await mongooseConnect();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
