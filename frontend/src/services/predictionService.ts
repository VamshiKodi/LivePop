export interface Milestone {
    label: string;
    target: number;
    current: number;
    rate: number;
    estimatedDate: Date;
    color: string;
}

export const calculateMilestone = (currentPop: number, growthRatePerSec: number, targetPop: number): Date => {
    if (growthRatePerSec <= 0) return new Date(new Date().setFullYear(new Date().getFullYear() + 100));

    const remaining = targetPop - currentPop;
    const secondsToReach = remaining / growthRatePerSec;

    return new Date(Date.now() + secondsToReach * 1000);
};

export const getMajorMilestones = (countries: any[]): Milestone[] => {
    // Fallback data if API returns empty
    const world = countries.find(c => c.code === 'WORLD') || { baselinePopulation: 8200000000, birthsPerSec: 4.3, deathsPerSec: 1.8 };
    // Exact match from user screenshot: 1,463,865,525
    const india = countries.find(c => c.code === 'IN') || { baselinePopulation: 1463865525, baselineAt: new Date().toISOString(), birthsPerSec: 0.8 };
    const us = countries.find(c => c.code === 'US') || { baselinePopulation: 347000000, birthsPerSec: 0.4 }; // Generic fallback

    const milestones: Milestone[] = [];

    // World -> 9 Billion
    const worldRate = (world.birthsPerSec || 4.3) - (world.deathsPerSec || 1.8);
    milestones.push({
        label: "World Population: 9 Billion",
        target: 9000000000,
        current: world.baselinePopulation,
        rate: worldRate,
        estimatedDate: calculateMilestone(world.baselinePopulation, worldRate, 9000000000),
        color: "text-blue-400"
    });

    // India -> 1.5 Billion
    // Calculate current live pop for fallback if needed
    let indiaPop = india.baselinePopulation;
    if (india.baselineAt) {
        const elapsed = (Date.now() - new Date(india.baselineAt).getTime()) / 1000;
        indiaPop += elapsed * (india.birthsPerSec || 0.8);
    }

    milestones.push({
        label: "India: 1.5 Billion",
        target: 1500000000,
        current: indiaPop,
        rate: 2.5, // Net growth approx
        estimatedDate: calculateMilestone(indiaPop, 2.5, 1500000000),
        color: "text-orange-400"
    });

    // USA -> 350 Million
    const usPop = us.baselinePopulation;
    milestones.push({
        label: "USA: 350 Million",
        target: 3500000000,
        current: usPop,
        rate: 0.08,
        estimatedDate: calculateMilestone(usPop, 0.08, 350000000),
        color: "text-red-400"
    });

    return milestones;
};
