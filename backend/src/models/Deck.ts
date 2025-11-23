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
      required: [true, 'Deck must belong to a user'],
    },
  }
);



const Deck = mongoose.model<IDeck>('Deck', deckSchema);
export default Deck;

