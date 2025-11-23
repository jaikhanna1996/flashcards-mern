import mongoose, { Document } from 'mongoose';

// Interface for Flashcard data structure
export interface IFlashcard extends Document {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  userId: mongoose.Types.ObjectId; // Reference to User who owns this card
}

