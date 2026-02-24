import axios from 'axios';

// Get backend URL from environment or default to localhost
const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // Important for CORS if using cookies/sessions in future
});

// Region interfaces matching backend
export interface RegionData {
    code: string;
    name: string;
    populationNow: number;
    growthRate: number;
    birthsPerSec: number;
    deathsPerSec: number;
    migrationPerSec: number;
    // Add other fields as needed
    meta: {
        source: string;
        lastUpdatedBy?: string;
        lastUpdatedAt: string;
    };
    demographics?: {
        youth: number;
        working: number;
        elderly: number;
    };
    density?: number;
}

export const PopulationService = {
    // Get all regions
    getAllRegions: async () => {
        const response = await api.get<{ success: boolean; data: RegionData[] }>('/regions');
        return response.data.data;
    },

    // Get specific region
    getRegion: async (code: string) => {
        const response = await api.get<{ success: boolean; data: RegionData }>(`/regions/${code}`);
        return response.data.data;
    },

    // Get global stats
    getStats: async () => {
        const response = await api.get<{ success: boolean; data: any }>('/stats');
        return response.data.data;
    },

    // Get leaderboard
    getLeaderboard: async () => {
        const response = await api.get<{
            success: boolean;
            data: {
                topGrowing: RegionData[];
                topDeclining: RegionData[];
                topPopulous: RegionData[];
            }
        }>('/stats/leaderboard');
        return response.data.data;
    },

    // Get multi-scenario projection
    getProjection: async (code: string, years: number = 50) => {
        const response = await api.get<{
            success: boolean;
            data: {
                year: number;
                high: number;
                medium: number;
                low: number;
            }[]
        }>(`/stats/projection/${code}?years=${years}`);
        return response.data.data;
    },
};
