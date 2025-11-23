import { Response } from 'express';
import Deck from '../models/Deck';
import Flashcard from '../models/Flashcard';
import { AuthRequest } from '../interfaces/auth.interface';


export const getDecks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const defaultDecks = await Deck.find({ type: 'default' });

    const userDecks = await Deck.find({ type: 'user', userId });

    const allDecks = [...defaultDecks, ...userDecks];

    res.status(200).json({
      success: true,
      count: allDecks.length,
      data: {
        decks: allDecks,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};


export const getDeck = async (req: AuthRequest, res: Response) => {
  try {
    const deckId = req.params.id;

    const deck = await Deck.findById(deckId);

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found',
      });
    }


    const userId = req.user?._id;
    if (deck.type === 'user' && deck.userId?.toString() !== userId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this deck',
      });
    }

    const flashcards = await Flashcard.find({ deckId });

    const deckWithFlashcards = {
      ...deck.toObject(),
      flashcards,
    };

    res.status(200).json({
      success: true,
      data: {
        deck: deckWithFlashcards,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};


export const createDeck = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?._id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a deck name',
      });
    }

    // Create deck
    const deck = await Deck.create({
      name,
      description,
      userId,
      type: 'user',
      flashcards: [],
    });

    res.status(201).json({
      success: true,
      message: 'Deck created successfully',
      data: {
        deck,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};


export const deleteDeck = async (req: AuthRequest, res: Response) => {
  try {
    const deckId = req.params.id;
    const userId = req.user?._id;

    const deck = await Deck.findById(deckId);

    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found',
      });
    }

    if (deck.type === 'default') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete default decks',
      });
    }

    if (deck.userId?.toString() !== userId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this deck',
      });
    }

    await Flashcard.deleteMany({ deckId });

    await Deck.findByIdAndDelete(deckId);

    res.status(200).json({
      success: true,
      message: 'Deck deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

