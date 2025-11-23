import { Router } from 'express';
import {
  getFlashcards,
  getFlashcard,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from '../controllers/flashcardController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

// Define routes
router.get('/', getFlashcards); // GET /api/flashcards?deckId=xxx
router.get('/:id', getFlashcard); // GET /api/flashcards/:id
router.post('/', createFlashcard); // POST /api/flashcards
router.put('/:id', updateFlashcard); // PUT /api/flashcards/:id
router.delete('/:id', deleteFlashcard); // DELETE /api/flashcards/:id

export default router;

