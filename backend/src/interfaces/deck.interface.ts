import mongoose, { Document } from 'mongoose';

export interface IDeck extends Document {
  name: string;
  description?: string;
  flashcards: mongoose.Types.ObjectId[];
  userId?: mongoose.Types.ObjectId | null; 
  type: 'default' | 'user'; 
}

