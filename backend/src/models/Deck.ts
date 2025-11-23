import mongoose, { Schema } from 'mongoose';
import { IDeck } from '../interfaces/deck.interface';

const deckSchema = new Schema<IDeck>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a deck name'],
      trim: true,
      maxlength: [100, 'Deck name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    flashcards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Flashcard',
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for default decks, ObjectId for user decks
    },
    type: {
      type: String,
      enum: ['default', 'user'],
      default: 'user', // Default to 'user', set to 'default' for system decks
    },
  }
);



const Deck = mongoose.model<IDeck>('Deck', deckSchema);
export default Deck;

