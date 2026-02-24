import { Router } from 'express';
import {
    getAllRegions,
    getRegionByCode,
    createRegion,
    updateRegion,
    deleteRegion,
} from '../controllers/regionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllRegions);
router.get('/:code', getRegionByCode);

// Protected routes (Admin only)
router.post('/', authMiddleware, createRegion);
router.put('/:code', authMiddleware, updateRegion);
router.delete('/:code', authMiddleware, deleteRegion);

export default router;
