import { Router } from 'express';
import { getStats, getHealth, getLeaderboard, getProjection } from '../controllers/statsController';

const router = Router();

router.get('/', getStats);
router.get('/leaderboard', getLeaderboard);
router.get('/projection/:code', getProjection);
router.get('/health', getHealth);

export default router;
