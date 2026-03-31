import { Request, Response } from 'express';
import Region from '../models/Region';
import { sendSuccess, sendError } from '../utils/responseHelpers';
import { computePopulation, calculateProjection } from '../services/populationService';

export const getStats = async (req: Request, res: Response) => {
    try {
        const worldRegion = await Region.findOne({ code: 'WORLD' });

        if (!worldRegion) {
            return sendError(res, 'World region not found', 404);
        }

        const now = new Date();
        const currentPopulation = computePopulation(worldRegion, now);
        const netGrowthRate = worldRegion.birthsPerSec - worldRegion.deathsPerSec + worldRegion.migrationPerSec;

        const countriesCount = await Region.countDocuments({ code: { $ne: 'WORLD' } });

        return sendSuccess(res, {
            currentPopulation,
            growthRatePerSec: netGrowthRate,
            countriesCount,
            lastUpdatedAt: worldRegion.meta.lastUpdatedAt,
            serverTime: now,
        });
    } catch (error: any) {
        return sendError(res, error.message || 'Failed to fetch stats', 500);
    }
};

export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const regions = await Region.find({ code: { $ne: 'WORLD' } }).lean();
        const now = new Date();

        const stats = regions.map(region => {
            const currentPop = computePopulation(region as any, now);
            const netRate = region.birthsPerSec - region.deathsPerSec + region.migrationPerSec;
            // Annualized growth rate percentage
            // (Net per sec * 31536000 sec/year) / currentPop * 100
            const annualGrowth = (netRate * 31536000 / (currentPop || 1)) * 100;

            return {
                code: region.code,
                name: region.name,
                populationNow: currentPop,   // ← renamed from `population` to match frontend RegionData
                growthRate: annualGrowth,
                birthsPerSec: region.birthsPerSec,
                deathsPerSec: region.deathsPerSec,
                migrationPerSec: region.migrationPerSec,
                demographics: region.demographics,
                density: region.density,
                serverTime: now,
            };
        });

        // Top Growing (Highest positive growth rate)
        const topGrowing = [...stats]
            .sort((a, b) => b.growthRate - a.growthRate)
            .slice(0, 10);

        // Top Declining (Lowest negative growth rate)
        const topDeclining = [...stats]
            .filter(s => s.growthRate < 0)
            .sort((a, b) => a.growthRate - b.growthRate) // Largest negative first
            .slice(0, 10);

        // Most Populous
        const topPopulous = [...stats]
            .sort((a, b) => b.populationNow - a.populationNow)
            .slice(0, 10);

        return sendSuccess(res, {
            topGrowing,
            topDeclining,
            topPopulous
        });

    } catch (error: any) {
        return sendError(res, error.message || 'Failed to fetch leaderboard', 500);
    }
};

export const getHealth = (req: Request, res: Response) => {
    return sendSuccess(res, {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
};

export const getProjection = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const region = await Region.findOne({
            $or: [
                { code: code.toUpperCase() },
                { name: { $regex: new RegExp(`^${code}$`, 'i') } }
            ]
        });

        if (!region) {
            return sendError(res, 'Region not found', 404);
        }

        const years = parseInt(req.query.years as string) || 50;
        const projection = calculateProjection(region, years);

        return sendSuccess(res, projection);
    } catch (error: any) {
        return sendError(res, error.message || 'Failed to fetch projection', 500);
    }
};
