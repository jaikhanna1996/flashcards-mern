import { Router } from 'express';
import { getDecks, getDeck, createDeck, updateDeck, deleteDeck } from '../controllers/deckController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getDecks);
router.get('/:id', protect, getDeck);
router.post('/', protect, createDeck);
router.patch('/:id', protect, updateDeck);
router.delete('/:id', protect, deleteDeck);

export default router;

