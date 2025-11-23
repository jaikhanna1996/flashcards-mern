import mongoose, { Schema } from 'mongoose';
import { IFlashcard } from '../interfaces/flashcard.interface';

// Create the Flashcard schema
const flashcardSchema = new Schema<IFlashcard>(
  {
    question: {
      type: String,
      required: [true, 'Please provide a question'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Please provide an answer'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    tags: {
      type: [String],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Flashcard must belong to a user'],
    }}
);


const Flashcard = mongoose.model<IFlashcard>('Flashcard', flashcardSchema);
export default Flashcard;

