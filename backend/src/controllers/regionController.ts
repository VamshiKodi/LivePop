import { Response } from 'express';
import Joi from 'joi';
import Region from '../models/Region';
import HistoryItem from '../models/HistoryItem';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendSuccess, sendError } from '../utils/responseHelpers';
import { getRegionSnapshot, getAllRegionSnapshots } from '../services/populationService';

// Validation schemas
const createRegionSchema = Joi.object({
    code: Joi.string().uppercase().required(),
    name: Joi.string().required(),
    baselinePopulation: Joi.number().min(0).required(),
    baselineAt: Joi.date().required(),
    birthsPerSec: Joi.number().required(),
    deathsPerSec: Joi.number().required(),
    migrationPerSec: Joi.number().default(0),
    meta: Joi.object({
        source: Joi.string().default('Manual'),
    }).optional(),
});

const updateRegionSchema = Joi.object({
    name: Joi.string().optional(),
    baselinePopulation: Joi.number().min(0).optional(),
    baselineAt: Joi.date().optional(),
    birthsPerSec: Joi.number().optional(),
    deathsPerSec: Joi.number().optional(),
    migrationPerSec: Joi.number().optional(),
    note: Joi.string().optional(),
});

// Get all regions
export const getAllRegions = async (req: AuthRequest, res: Response) => {
    try {
        const snapshots = await getAllRegionSnapshots();
        return sendSuccess(res, snapshots);
    } catch (error: any) {
        return sendError(res, error.message || 'Failed to fetch regions', 500);
    }
};

// Get single region by code
export const getRegionByCode = async (req: AuthRequest, res: Response) => {
    try {
        const { code } = req.params;
        // Use a simple log since logger might not be fully initialized or causing issues in some contexts
        console.log(`Fetching region details for code: ${code}`);
        const snapshot = await getRegionSnapshot(code.toUpperCase());

        if (!snapshot) {
            console.warn(`Region not found in DB: ${code}`);
            return sendError(res, 'Region not found', 404);
        }

        // Calculate rank (best-effort)
        // If Mongo is temporarily unavailable, we still want to return the snapshot.
        let rank: number | undefined;
        try {
            // Count how many regions have a higher baseline population
            // (Using baseline is faster and stable enough for ranking)
            rank = (await Region.countDocuments({
                baselinePopulation: { $gt: snapshot.baselinePopulation },
                code: { $ne: 'WORLD' } // Exclude WORLD from ranking
            })) + 1;
        } catch (rankError) {
            console.warn('Failed to compute rank (returning snapshot without rank):', rankError);
        }

        return sendSuccess(res, rank !== undefined ? { ...snapshot, rank } : snapshot);
    } catch (error: any) {
        return sendError(res, error.message || 'Failed to fetch region', 500);
    }
};

// Create new region (Admin only)
export const createRegion = async (req: AuthRequest, res: Response) => {
    try {
        const { error } = createRegionSchema.validate(req.body);

        if (error) {
            return sendError(res, error.details[0].message, 400);
        }

        const region = new Region({
            ...req.body,
            meta: {
                ...req.body.meta,
                lastUpdatedBy: req.user.userId,
                lastUpdatedAt: new Date(),
            },
        });

        await region.save();

        return sendSuccess(res, region, 201);
    } catch (error: any) {
        if (error.code === 11000) {
            return sendError(res, 'Region with this code already exists', 400);
        }
        return sendError(res, error.message || 'Failed to create region', 500);
    }
};

// Update region (Admin only)
export const updateRegion = async (req: AuthRequest, res: Response) => {
    try {
        const { code } = req.params;
        const { error } = updateRegionSchema.validate(req.body);

        if (error) {
            return sendError(res, error.details[0].message, 400);
        }

        const region = await Region.findOne({ code: code.toUpperCase() });

        if (!region) {
            return sendError(res, 'Region not found', 404);
        }

        // Log change to history
        const { note, ...changes } = req.body;

        if (Object.keys(changes).length > 0) {
            await HistoryItem.create({
                regionCode: region.code,
                change: changes,
                changedBy: req.user.userId,
                note: note || 'Region updated',
            });
        }

        // Update region
        Object.assign(region, changes);
        region.meta.lastUpdatedBy = req.user.userId;
        region.meta.lastUpdatedAt = new Date();

        await region.save();

        return sendSuccess(res, region);
    } catch (error: any) {
        return sendError(res, error.message || 'Failed to update region', 500);
    }
};

// Delete region (Admin only)
export const deleteRegion = async (req: AuthRequest, res: Response) => {
    try {
        const { code } = req.params;

        const region = await Region.findOneAndDelete({ code: code.toUpperCase() });

        if (!region) {
            return sendError(res, 'Region not found', 404);
        }

        return sendSuccess(res, { message: 'Region deleted successfully' });
    } catch (error: any) {
        return sendError(res, error.message || 'Failed to delete region', 500);
    }
};
