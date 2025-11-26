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

router.get('/', getFlashcards);
router.get('/:id', getFlashcard);
router.post('/', createFlashcard);
router.put('/:id', updateFlashcard);
router.delete('/:id', deleteFlashcard);

export default router;

