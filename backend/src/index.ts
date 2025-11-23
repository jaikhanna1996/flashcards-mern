import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongooseConnect from './config/db';
import healthRouter from './routes/health';
import authRouter from './routes/authRouter';
import deckRouter from './routes/deckRouter';
import flashcardRouter from './routes/flashcardRouter';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/decks', deckRouter);
app.use('/api/flashcards', flashcardRouter);

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
