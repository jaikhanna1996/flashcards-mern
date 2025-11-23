import { Response } from 'express';
import Flashcard from '../models/Flashcard';
import Deck from '../models/Deck';
import { AuthRequest } from '../interfaces/auth.interface';


export const getFlashcards = async (req: AuthRequest, res: Response) => {
  try {
    const { deckId } = req.query;
    const userId = req.user?._id;

    let query: any = {};

    if (deckId) {
      query.deckId = deckId;

      const deck = await Deck.findById(deckId);
      if (!deck) {
        return res.status(404).json({
          success: false,
          message: 'Deck not found',
        });
      }

      if (deck.type === 'user' && deck.userId?.toString() !== userId?.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this deck',
        });
      }
    } else {
      query.userId = userId;
    }

    const flashcards = await Flashcard.find(query);

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: {
        flashcards,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};


export const getFlashcard = async (req: AuthRequest, res: Response) => {
  try {
    const flashcardId = req.params.id;
    const userId = req.user?._id;

    const flashcard = await Flashcard.findById(flashcardId);

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found',
      });
    }


    if (flashcard.userId) {
      if (flashcard.userId.toString() !== userId?.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this flashcard',
        });
      }
    } else {
      const deck = await Deck.findById(flashcard.deckId);
      if (!deck || deck.type !== 'default') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this flashcard',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        flashcard,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};


export const createFlashcard = async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, details, images, difficulty, tags, deckId } = req.body;
    const userId = req.user?._id;

    if (!question || !answer || !deckId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide question, answer, and deckId',
      });
    }

    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found',
      });
    }

    if (deck.type === 'user' && deck.userId?.toString() !== userId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add flashcards to this deck',
      });
    }

    const flashcard = await Flashcard.create({
      question,
      answer,
      details,
      images: images || [],
      difficulty: difficulty || 'medium',
      tags: tags || [],
      userId: deck.type === 'default' ? null : userId,
      deckId,
    });

    deck.flashcards.push(flashcard._id);
    await deck.save();

    res.status(201).json({
      success: true,
      message: 'Flashcard created successfully',
      data: {
        flashcard,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};


export const updateFlashcard = async (req: AuthRequest, res: Response) => {
  try {
    const flashcardId = req.params.id;
    const userId = req.user?._id;
    const { question, answer, details, images, difficulty, tags } = req.body;

    const flashcard = await Flashcard.findById(flashcardId);

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found',
      });
    }

    if (!flashcard.userId) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify default deck flashcards',
      });
    }

    if (flashcard.userId.toString() !== userId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this flashcard',
      });
    }

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      flashcardId,
      {
        question,
        answer,
        details,
        images,
        difficulty,
        tags,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Flashcard updated successfully',
      data: {
        flashcard: updatedFlashcard,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};


export const deleteFlashcard = async (req: AuthRequest, res: Response) => {
  try {
    const flashcardId = req.params.id;
    const userId = req.user?._id;

    const flashcard = await Flashcard.findById(flashcardId);

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found',
      });
    }

    if (!flashcard.userId) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete default deck flashcards',
      });
    }

    if (flashcard.userId.toString() !== userId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this flashcard',
      });
    }

    const deck = await Deck.findById(flashcard.deckId);
    if (deck) {
      deck.flashcards = deck.flashcards.filter(
        (id) => id.toString() !== flashcardId
      );
      await deck.save();
    }

    await Flashcard.findByIdAndDelete(flashcardId);

    res.status(200).json({
      success: true,
      message: 'Flashcard deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

