import mongoose, { Document } from 'mongoose';

export interface IFlashcard extends Document {
  question: string;
  answer: string;
  details?: string;
  images?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  userId?: mongoose.Types.ObjectId | null;
  deckId: mongoose.Types.ObjectId;
}

