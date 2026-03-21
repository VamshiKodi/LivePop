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

const LeaderboardCard: React.FC<{
    title: string;
    icon: string;
    countries: RegionData[];
    colorClass: string;
    delay: number;
}> = ({ title, icon, countries, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="glass-card rounded-[2rem] p-8 group transition-all duration-500 hover:border-accent/30"
    >
        <h3 className={`text-xl font-black mb-8 flex items-center gap-4 ${colorClass} tracking-widest uppercase`}>
            <span className="text-2xl p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">{icon}</span> {title}
        </h3>
        <div className="space-y-4">
            {countries.map((c, idx) => (
                <Link
                    key={c.code}
                    to={`/country/${c.code}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 group/item"
                >
                    <div className="flex items-center gap-4">
                        <span className={`font-mono text-[10px] font-black w-6 ${idx < 3 ? 'text-yellow-500' : 'text-white/20'}`}>
                            {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="relative">
                            <div className="absolute -inset-1 bg-white/20 blur opacity-0 group-hover/item:opacity-100 transition-opacity rounded-md"></div>
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
                    <div className="flex flex-col items-end">
                        <span className="text-white font-black text-sm tracking-tighter">
                            {formatPopulation(c.populationNow || 0)}
                        </span>
                        <span className={`text-[10px] font-black tracking-widest ${(c.growthRate ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(c.growthRate ?? 0) > 0 ? '+' : ''}{(c.growthRate ?? 0).toFixed(2)}%
                        </span>
                    </div>
                </Link>
            ))}
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
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Refresh every 5 seconds for live feel
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto relative overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black -z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-24 relative z-10"
            >
                <div className="inline-block">
                    <h1 className="text-5xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter">
                        WORLD LEADERS
                    </h1>
                    <div className="h-0.5 w-24 bg-accent mx-auto opacity-50"></div>
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
