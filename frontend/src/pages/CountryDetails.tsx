import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PopulationService, type RegionData } from '../services/api';
import HeroCounter from '../components/home/HeroCounter';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import {
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import ExportButton from '../components/ui/ExportButton';
import ShareButton from '../components/ui/ShareButton';
import FavoriteButton from '../components/ui/FavoriteButton';
import PrintButton from '../components/ui/PrintButton';
import FuturePredictions from '../components/ui/FuturePredictions';

// Modern Cyberpunk colors
const COLORS = {
    cyan: '#06b6d4',      // cyan-500
    green: '#22c55e',     // green-500
    red: '#ef4444',       // red-500
    orange: '#f97316',    // orange-500
    purple: '#a855f7',    // purple-500
    bgCard: 'rgba(17, 24, 39, 0.6)', // gray-900/60
    border: 'rgba(75, 85, 99, 0.4)', // gray-600/40
};

const CountryDetails: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const countryCode = code?.toUpperCase() || 'WORLD';
    const [regionData, setRegionData] = useState<RegionData | null>(null);
    const [loading, setLoading] = useState(true);

    const [isConnected, setIsConnected] = useState(false);
    const [projectionData, setProjectionData] = useState<{ year: number; high: number; medium: number; low: number }[]>([]);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [data, proj] = await Promise.all([
                    PopulationService.getRegion(countryCode),
                    PopulationService.getProjection(countryCode, 50)
                ]);
                setRegionData(data);
                setProjectionData(proj);
                setIsConnected(true);
            } catch (error) {
                console.error("Failed to fetch region stats:", error);
                setIsConnected(false);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Poll every 3s to keep it alive
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [countryCode]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [countryCode]);

    // Derived stats
    const population = regionData?.populationNow || 0;

    // Reverse calc net rate per second from annual growth for visualization?
    // Growth % = (NetPerSec * 31.5M / Pop) * 100
    // NetPerSec = (Growth % * Pop) / (31.5M * 100)
    const growthRate = regionData?.growthRate ?? 0;
    const netPerSec = regionData ? (growthRate * regionData.populationNow) / (31536000 * 100) : 0;

    // Seconds per person addition/removal
    const secondsPerPerson = netPerSec !== 0 ? Math.abs(1 / netPerSec) : 0;

    const growthLabel = netPerSec > 0
        ? `+1 person / ${secondsPerPerson.toFixed(1)}s`
        : netPerSec < 0
            ? `-person / ${secondsPerPerson.toFixed(1)}s`
            : "Stable";

    const formatPopulation = (value: number) => {
        if (value >= 1000000000) return `${(value / 1000000000).toFixed(3)}B`;
        if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value.toString();
    };

    if (loading && !regionData) {
        return <div className="min-h-screen pt-32 text-center text-cyan-400">CONNECTING TO GLOBAL NET...</div>;
    }

    if (!regionData) {
        return (
            <div className="min-h-screen pt-32 text-center text-red-500">
                <h2 className="text-3xl font-bold">REGION NOT FOUND</h2>
                <Link to="/leaderboard" className="mt-4 inline-block text-cyan-400 hover:text-white underline">Return to Leaderboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center pb-12 relative overflow-hidden bg-black">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/80 to-black z-0"></div>
            <div className={`absolute top-0 left-0 right-0 h-96 bg-gradient-to-b ${growthRate >= 0 ? 'from-green-900/20' : 'from-red-900/20'} to-transparent blur-3xl -z-10`}></div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-24 left-4 md:left-8 z-20"
            >
                <Link to="/leaderboard" className="flex items-center gap-2 text-cyan-400 hover:text-white transition-all font-mono tracking-wide group">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> BACK TO DATA
                </Link>
            </motion.div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <HeroCounter
                    population={population}
                    label={`REAL-TIME CENSUS: ${regionData.name.toUpperCase()}`}
                    isConnected={isConnected}
                    flagCode={regionData.code}
                />

                {/* Cyberpunk Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4 mt-8"
                >
                    <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-colors group shadow-lg">
                        <h4 className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-1 group-hover:text-cyan-400">Growth Velocity</h4>
                        <p className={`text-2xl font-black font-mono ${growthRate >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                            {growthLabel}
                        </p>
                    </div>
                    <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-colors group shadow-lg">
                        <h4 className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-1 group-hover:text-purple-400">Annual Shift</h4>
                        <p className={`text-2xl font-black font-mono ${growthRate >= 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
                            {growthRate > 0 ? '+' : ''}{growthRate.toFixed(2)}%
                        </p>
                    </div>
                    <div className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50 hover:border-yellow-500/50 transition-colors group shadow-lg">
                        <h4 className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-1 group-hover:text-yellow-400">Database Code</h4>
                        <p className="text-2xl font-black font-mono text-white tracking-widest">{regionData.code}</p>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-4 max-w-5xl w-full px-4 mt-6"
                >
                    <FavoriteButton code={regionData.code} name={regionData.name} size={18} />
                    <ExportButton 
                        data={[{
                            code: regionData.code,
                            name: regionData.name,
                            population: regionData.populationNow,
                            growthRate: growthRate,
                            birthsPerSec: regionData.birthsPerSec || 0,
                            deathsPerSec: regionData.deathsPerSec || 0,
                            density: regionData.density
                        }]} 
                        filename={`${regionData.code}_population`}
                        variant="both"
                    />
                    <ShareButton 
                        countryName={regionData.name}
                        population={regionData.populationNow}
                        url={window.location.href}
                    />
                    <PrintButton />
                </motion.div>

                {/* Future Predictions */}
                <FuturePredictions
                    countryName={regionData.name}
                    currentPop={regionData.populationNow}
                    growthRate={growthRate}
                />

                {/* Projection Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full max-w-6xl px-4 mt-12 mb-8"
                >
                    <div className="bg-gray-900/40 backdrop-blur-md p-8 rounded-3xl border border-gray-700/30 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-50"></div>
                        <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                            <span className="text-cyan-400">📈</span> FUTURE TRAJECTORY (2025-2075)
                        </h3>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={projectionData}>
                                    <defs>
                                        <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.4} />
                                            <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.2} />
                                            <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.red} stopOpacity={0.2} />
                                            <stop offset="95%" stopColor={COLORS.red} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.5} />
                                    <XAxis
                                        dataKey="year"
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        tickFormatter={formatPopulation}
                                        domain={['auto', 'auto']}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid #06b6d4', borderRadius: '8px', boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)' }}
                                        labelStyle={{ color: '#9ca3af', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                                        itemStyle={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}
                                        formatter={(value: number) => [formatPopulation(value), '']}
                                        separator=""
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="medium"
                                        name="Forecast"
                                        stroke={COLORS.cyan}
                                        strokeWidth={3}
                                        fill="url(#colorMedium)"
                                        fillOpacity={1}
                                        activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: COLORS.cyan }}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CountryDetails;
