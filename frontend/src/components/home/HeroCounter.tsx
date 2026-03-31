import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedNumber from '../ui/AnimatedNumber';
import CountrySelector from '../ui/CountrySelector';

interface HeroCounterProps {
    population?: number;
    label?: string;
    isConnected?: boolean;
    flagCode?: string;
    debugInfo?: string;
}

interface IncrementBadge {
    id: number;
    value: number;
}

const HeroCounter: React.FC<HeroCounterProps> = ({
    population,
    label = "Current World Population",
    isConnected = true,
    flagCode,
    debugInfo,
}) => {
    const prevPopRef = useRef<number | undefined>(undefined);
    const [badges, setBadges] = useState<IncrementBadge[]>([]);
    const badgeIdRef = useRef(0);

    // Detect increment and spawn a floating "+N" badge
    useEffect(() => {
        if (
            population !== undefined &&
            prevPopRef.current !== undefined &&
            population > prevPopRef.current
        ) {
            const diff = population - prevPopRef.current;
            const id = ++badgeIdRef.current;
            setBadges((prev) => [...prev, { id, value: diff }]);
            // Remove badge after animation completes
            setTimeout(() => {
                setBadges((prev) => prev.filter((b) => b.id !== id));
            }, 1300);
        }
        prevPopRef.current = population;
    }, [population]);

    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center relative z-20">
            {/* Radial gradient ambient glow – multi-layer for depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/15 blur-[140px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent2/10 blur-[100px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-accent/20 blur-[60px] rounded-full pointer-events-none -z-10" />



            {/* LIVE badge */}
            <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="flex items-center gap-2 px-4 py-1.5 glass-card rounded-full border-white/5 shadow-inner">
                    <span className="relative flex h-2.5 w-2.5">
                        {isConnected && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        )}
                        <span
                            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                isConnected ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-gray-500'
                            }`}
                            style={isConnected ? { animation: 'live-blink 1.5s ease-in-out infinite' } : undefined}
                        />
                    </span>
                    <span className={`${isConnected ? 'text-red-400' : 'text-gray-500'} font-black tracking-[0.2em] text-[10px]`}>
                        {isConnected ? 'LIVE CENSUS' : 'OFFLINE'}
                    </span>
                </div>
            </motion.div>

            {/* Label */}
            <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
                className="text-gray-400 text-sm md:text-base font-medium mb-6 tracking-[0.3em] uppercase flex flex-col items-center gap-6"
            >
                {flagCode && (
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                        <img
                            src={`https://flagcdn.com/w160/${flagCode.toLowerCase()}.png`}
                            alt="Flag"
                            className="h-10 w-auto rounded-sm shadow-2xl relative z-10 grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                )}
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    {label}
                </span>
            </motion.h2>

            {/* Main counter + increment badges */}
            <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.3 }}
                className="relative mb-12"
            >
                <div className="text-6xl md:text-8xl lg:text-[10rem] font-black font-display text-white tracking-tighter leading-none">
                    <span className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] inline-block">
                        {population !== undefined ? (
                            <AnimatedNumber value={population} className="text-glow" />
                        ) : (
                            <span className="text-white/10 animate-pulse tracking-widest text-4xl md:text-6xl">
                                SYNCING...
                            </span>
                        )}
                    </span>
                </div>

                {/* Floating increment badges */}
                <AnimatePresence>
                    {badges.map((badge) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 1, y: 0, x: 0 }}
                            animate={{ opacity: 0, y: -52, x: 8 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute top-0 right-0 pointer-events-none"
                        >
                            <span className="text-accent font-black text-xl drop-shadow-[0_0_6px_rgba(0,198,255,0.8)]">
                                +{badge.value.toLocaleString()}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Subtext */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-gray-400 mb-10 max-w-lg relative"
            >
                Real-time estimated population based on statistical growth rates.
            </motion.p>

            {/* Country selector card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col gap-4 items-center glass-card p-8 rounded-[2rem] border-white/5 shadow-2xl scale-95 md:scale-100 border-glow-pulse"
            >
                <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] ml-[0.4em]">
                    Global Directory
                </p>
                <CountrySelector />
            </motion.div>
        </div>
    );
};

export default HeroCounter;
