import mongoose, { Schema } from 'mongoose';
import { IFlashcard } from '../interfaces/flashcard.interface';

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
    details: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
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
      default: null, // null for default deck cards, ObjectId for user cards
    },
    deckId: {
      type: Schema.Types.ObjectId,
      ref: 'Deck',
      required: [true, 'Flashcard must belong to a deck'],
    },
  }
);


const Flashcard = mongoose.model<IFlashcard>('Flashcard', flashcardSchema);
export default Flashcard;

