import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import FavoriteButton from './FavoriteButton';

interface CountryCardProps {
    name: string;
    code: string;
    population?: number;
    growthRate?: number;
    comingSoon?: boolean;
}

// Generate mock historical trend data
const generateTrendData = (currentPop: number, growthRate: number) => {
    const data = [];
    let pop = currentPop * 0.92;
    for (let i = 0; i < 10; i++) {
        data.push({ year: 2015 + i, value: Math.floor(pop) });
        pop *= (1 + (growthRate / 100));
    }
    return data;
};

const CountryCard: React.FC<CountryCardProps> = ({
    name,
    code,
    population = 0,
    growthRate = 0.8,
    comingSoon = false,
}) => {
    const trendData = useMemo(
        () => generateTrendData(population || 100000000, growthRate),
        [population, growthRate]
    );
    const isPositive = growthRate >= 0;
    const chartColor = isPositive ? '#10b981' : '#ef4444';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, scale: 1.03 }}
            style={{ transition: 'box-shadow 0.3s ease' }}
            className="glass-card p-6 relative overflow-hidden group cursor-pointer border-white/5 shadow-xl hover:border-accent/30 rounded-3xl"
        >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

            {/* Shimmer overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl overflow-hidden pointer-events-none">
                <div className="shimmer absolute inset-0" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4 z-10 relative">
                <div className="flex items-center gap-4">
                    <div className="relative group/flag">
                        <div className="absolute -inset-1 bg-white/20 blur opacity-0 group-hover/flag:opacity-100 transition-opacity rounded-lg" />
                        <img
                            src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
                            alt={`${name} flag`}
                            className="w-10 h-7 object-cover rounded shadow-md grayscale-[0.1] group-hover:grayscale-0 transition-all relative z-10"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                    <h3 className="text-base font-black tracking-tight text-white group-hover:text-accent transition-colors truncate max-w-[120px]">
                        {name.toUpperCase()}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <FavoriteButton code={code} name={name} size={16} />
                    <span className="text-[10px] font-black tracking-[0.2em] text-white/20 group-hover:text-accent/40 transition-colors font-mono uppercase">
                        {code}
                    </span>
                </div>
            </div>

            {/* Sparkline Chart with draw animation */}
            {population > 0 && (
                <div className="h-12 w-full my-2 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id={`gradient-${code}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.45} />
                                    <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={chartColor}
                                strokeWidth={2}
                                fill={`url(#gradient-${code})`}
                                isAnimationActive={true}
                                animationDuration={1200}
                                animationEasing="ease-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 z-10 relative">
                {comingSoon ? (
                    <span className="text-[10px] font-black tracking-widest bg-red-500/10 px-3 py-1 rounded-full text-red-500 border border-red-500/20 uppercase">
                        Offline
                    </span>
                ) : (
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-1">Growth</span>
                        <span
                            className={`text-sm font-black flex items-center gap-1.5 transition-colors ${
                                isPositive
                                    ? 'text-green-400 group-hover:text-green-300'
                                    : 'text-red-400 group-hover:text-red-300'
                            }`}
                        >
                            {/* Pulsing glow dot – green or red based on growth */}
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                    isPositive
                                        ? 'bg-green-500 growth-positive'
                                        : 'bg-red-500 growth-negative'
                                }`}
                            />
                            {isPositive ? `+${growthRate.toFixed(2)}%` : `${growthRate.toFixed(2)}%`}
                        </span>
                    </div>
                )}

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-1">Status</span>
                    <span className="text-[10px] font-black tracking-widest text-accent uppercase flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(0,198,255,0.8)]" />
                        Active
                    </span>
                </div>
            </div>

            {!comingSoon ? (
                <Link to={`/country/${code}`} className="absolute inset-0 z-20" aria-label={`View stats for ${name}`} />
            ) : (
                <div className="absolute inset-0 z-20 cursor-not-allowed" />
            )}
        </motion.div>
    );
};

export default CountryCard;
