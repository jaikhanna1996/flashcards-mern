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

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/decks', deckRouter);
app.use('/api/flashcards', flashcardRouter);

app.use(errorHandler);

// Connect to MongoDB outside handler to reuse connection
let isConnected = false;
async function connectDB() {
  if (!isConnected) {
    await mongooseConnect();
    isConnected = true;
  }
}

// Serverless handler for Vercel
const serverlessHandler = async (req: any, res: any) => {
  try {
    await connectDB();    // ensure DB is connected
    return app(req, res);
  } catch (error) {
    console.error('Serverless handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export for Vercel
export const handler = serverless(serverlessHandler);

// Local development server
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  startServer();
}

export default app;
