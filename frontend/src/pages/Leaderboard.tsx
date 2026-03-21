import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PopulationService, type RegionData } from '../services/api';

interface LeaderboardData {
    topGrowing: RegionData[];
    topDeclining: RegionData[];
    topPopulous: RegionData[];
}

const formatPopulation = (pop: number) => {
    if (pop >= 1000000000) return `${(pop / 1000000000).toFixed(3)}B`;
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(2)}M`;
    return `${(pop / 1000).toFixed(0)}K`;
};

const RANK_STYLES: Record<number, { text: string; glow?: string; label?: string }> = {
    0: {
        text: 'text-yellow-400',
        glow: 'border border-yellow-400/40 shadow-[0_0_14px_rgba(250,204,21,0.25)] bg-yellow-400/5',
        label: '🥇',
    },
    1: {
        text: 'text-gray-300',
        glow: 'border border-gray-400/20 shadow-[0_0_8px_rgba(156,163,175,0.15)]',
        label: '🥈',
    },
    2: {
        text: 'text-orange-400',
        glow: 'border border-orange-400/20 shadow-[0_0_8px_rgba(251,146,60,0.15)]',
        label: '🥉',
    },
};

const getRankStyle = (idx: number) =>
    RANK_STYLES[idx] ?? { text: 'text-white/20', glow: '', label: '' };

const LeaderboardCard: React.FC<{
    title: string;
    icon: string;
    countries: RegionData[];
    colorClass: string;
    delay: number;
}> = ({ title, icon, countries, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card rounded-[2rem] p-8 group transition-all duration-500 hover:border-accent/30"
    >
        <h3
            className={`text-xl font-black mb-8 flex items-center gap-4 ${colorClass} tracking-widest uppercase`}
        >
            <motion.span
                className="text-2xl p-3 bg-white/5 rounded-2xl inline-block"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
                {icon}
            </motion.span>
            {title}
        </h3>

        <div className="space-y-3">
            {countries.map((c, idx) => {
                const rank = getRankStyle(idx);
                return (
                    <motion.div
                        key={c.code}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: delay + idx * 0.055,
                            duration: 0.4,
                            ease: 'easeOut',
                        }}
                    >
                        <Link
                            to={`/country/${c.code}`}
                            className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 group/item ${rank.glow}`}
                        >
                            <div className="flex items-center gap-4">
                                <span
                                    className={`font-mono text-[11px] font-black w-7 ${rank.text}`}
                                >
                                    {idx < 3 ? rank.label : String(idx + 1).padStart(2, '0')}
                                </span>
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-white/20 blur opacity-0 group-hover/item:opacity-100 transition-opacity rounded-md" />
                                    <img
                                        src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                                        alt={c.name}
                                        className="w-8 h-5 object-cover rounded-sm shadow-sm relative z-10 grayscale-[0.2] group-hover/item:grayscale-0 transition-all"
                                    />
                                </div>
                                <span className="text-white font-black text-xs tracking-tight group-hover/item:text-accent transition-colors uppercase">
                                    {c.name}
                                </span>
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                                <span className="text-white font-black text-sm tracking-tighter">
                                    {formatPopulation(c.populationNow || 0)}
                                </span>
                                <span
                                    className={`text-[10px] font-black tracking-widest ${
                                        (c.growthRate ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}
                                >
                                    {(c.growthRate ?? 0) > 0 ? '+' : ''}
                                    {(c.growthRate ?? 0).toFixed(2)}%
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    </motion.div>
);

const LeaderboardPage: React.FC = () => {
    const [data, setData] = useState<LeaderboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await PopulationService.getLeaderboard();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500" />
                    <div className="absolute inset-0 rounded-full blur-xl bg-accent/20 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black -z-10" />
            {/* Ambient glows */}
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent/8 blur-[100px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-2/3 right-1/4 w-56 h-56 bg-accent2/8 blur-[90px] rounded-full pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, y: -32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-24 relative z-10"
            >
                <div className="inline-block">
                    <h1 className="text-5xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter">
                        WORLD LEADERS
                    </h1>
                    <div className="h-0.5 w-24 bg-gradient-to-r from-accent to-accent2 mx-auto opacity-70 rounded-full" />
                </div>
                <p className="text-gray-500 text-xs font-black mt-8 tracking-[0.5em] uppercase">
                    GLOBAL DEMOGRAPHIC RANKINGS
                </p>
            </motion.div>

            {data && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                    <LeaderboardCard
                        title="Rocketing Up"
                        icon="🚀"
                        countries={data.topGrowing}
                        colorClass="text-green-400"
                        delay={0.1}
                    />
                    <LeaderboardCard
                        title="Giant Titans"
                        icon="👑"
                        countries={data.topPopulous}
                        colorClass="text-cyan-400"
                        delay={0.2}
                    />
                    <LeaderboardCard
                        title="Fading Away"
                        icon="📉"
                        countries={data.topDeclining}
                        colorClass="text-red-400"
                        delay={0.3}
                    />
                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;
