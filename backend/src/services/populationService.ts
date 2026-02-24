import Region, { IRegion } from '../models/Region';

export interface RegionSnapshot {
    code: string;
    name: string;
    baselinePopulation: number;
    baselineAt: Date;
    birthsPerSec: number;
    deathsPerSec: number;
    migrationPerSec: number;
    populationNow: number;
    growthRate: number;
    serverTime: Date;
    demographics?: {
        youth: number;
        working: number;
        elderly: number;
    };
    density?: number;
}

/**
 * Compute current population for a region based on baseline and rates
 */
export const computePopulation = (region: IRegion, now: Date = new Date()): number => {
    const netPerSec = region.birthsPerSec - region.deathsPerSec + region.migrationPerSec;
    const seconds = (now.getTime() - region.baselineAt.getTime()) / 1000;
    const population = region.baselinePopulation + netPerSec * seconds;
    return Math.floor(population);
};

/**
 * Get a snapshot of a region with computed population
 */
export const getRegionSnapshot = async (regionCode: string): Promise<RegionSnapshot | null> => {
    const region = await Region.findOne({ code: regionCode.toUpperCase() });

    if (!region) {
        return null;
    }

    const now = new Date();
    const populationNow = computePopulation(region, now);
    const netRate = region.birthsPerSec - region.deathsPerSec + region.migrationPerSec;
    const growthRate = (netRate * 31536000 / (region.baselinePopulation || 1)) * 100;

    return {
        code: region.code,
        name: region.name,
        baselinePopulation: region.baselinePopulation,
        baselineAt: region.baselineAt,
        birthsPerSec: region.birthsPerSec,
        deathsPerSec: region.deathsPerSec,
        migrationPerSec: region.migrationPerSec,
        growthRate,
        populationNow,
        demographics: region.demographics,
        density: region.density,
        serverTime: now,
    };
};

/**
 * Get snapshots for all regions
 */
export const getAllRegionSnapshots = async (): Promise<RegionSnapshot[]> => {
    const regions = await Region.find().sort({ baselinePopulation: -1 });
    const now = new Date();

    return regions.map((region) => {
        const netRate = region.birthsPerSec - region.deathsPerSec + region.migrationPerSec;
        const growthRate = (netRate * 31536000 / (region.baselinePopulation || 1)) * 100;

        return {
            code: region.code,
            name: region.name,
            baselinePopulation: region.baselinePopulation,
            baselineAt: region.baselineAt,
            birthsPerSec: region.birthsPerSec,
            deathsPerSec: region.deathsPerSec,
            migrationPerSec: region.migrationPerSec,
            populationNow: computePopulation(region, now),
            growthRate,
            demographics: region.demographics,
            density: region.density,
            serverTime: now,
        };
    });
};

/**
 * Calculate multi-scenario projections for a region
 */
export const calculateProjection = (region: IRegion, years: number = 50) => {
    const projections = [];
    const currentPop = computePopulation(region);
    const netPerYear = (region.birthsPerSec - region.deathsPerSec + region.migrationPerSec) * 31536000;
    const baseGrowthRate = region.baselinePopulation > 0 ? netPerYear / region.baselinePopulation : 0;

    // Scenarios (Growth rate adjustment factors)
    const SCENARIOS = {
        MEDIUM: 1,
        HIGH: 1.15, // 15% higher growth/lower decline
        LOW: 0.85,   // 15% lower growth/higher decline
    };

    const currentYear = new Date().getFullYear();

    for (let i = 0; i <= years; i++) {
        const year = currentYear + i;

        // P_t = P_0 * (1 + r)^t
        // Note: For negative growth, we still use the same exponential formula which is correct
        const medium = Math.floor(currentPop * Math.pow(1 + baseGrowthRate * SCENARIOS.MEDIUM, i));
        const high = Math.floor(currentPop * Math.pow(1 + baseGrowthRate * SCENARIOS.HIGH, i));
        const low = Math.floor(currentPop * Math.pow(1 + baseGrowthRate * SCENARIOS.LOW, i));

        projections.push({
            year,
            medium,
            high,
            low,
        });
    }

    return projections;
};
