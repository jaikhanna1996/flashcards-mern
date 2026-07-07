import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongooseConnect from './config/db';
import healthRouter from './routes/health';
import authRouter from './routes/authRouter';
import deckRouter from './routes/deckRouter';
import flashcardRouter from './routes/flashcardRouter';
import errorHandler from './middleware/errorHandler';
import serverless from 'serverless-http';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/decks', deckRouter);
app.use('/api/flashcards', flashcardRouter);

app.use(errorHandler);

// MongoDB connection
let isConnected = false;
async function connectDB() {
  if (!isConnected) {
    await mongooseConnect();
    isConnected = true;
  }
}

// Middleware to ensure DB connection for every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Export wrapped app for Vercel serverless
export const handler = serverless(app);

// Local development server
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  });
}

export default app;