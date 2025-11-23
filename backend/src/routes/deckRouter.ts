import { Router } from 'express';
import { getDecks, getDeck, createDeck, deleteDeck } from '../controllers/deckController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

// Define routes
router.get('/', getDecks);
router.get('/:id', getDeck);
router.post('/', createDeck);
router.delete('/:id', deleteDeck);

export default router;

