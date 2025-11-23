import mongoose, { Document } from 'mongoose';

// Interface for Deck data structure
export interface IDeck extends Document {
  name: string;
  description?: string; // ? means optional
  flashcards: mongoose.Types.ObjectId[]; // Array of flashcard IDs
  userId: mongoose.Types.ObjectId; // Reference to User who owns this deck
}

