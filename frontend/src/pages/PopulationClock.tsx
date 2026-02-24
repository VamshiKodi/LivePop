import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopulationService } from '../services/api';

const FACTS = [
    "🌍 There are approximately 4.3 births every second worldwide",
    "💀 About 1.8 deaths occur every second globally",
    "👶 Over 385,000 babies are born every day",
    "🇮🇳 India adds about 41,000 people to its population daily",
    "🇯🇵 Japan's population decreases by about 1,400 people daily",
    "🌏 Asia is home to 60% of the world's population",
    "🇳🇬 Nigeria will overtake the USA by 2050 in population",
    "🏙️ Over 55% of people live in urban areas",
    "👴 By 2050, 1 in 6 people will be over 65 years old",
    "🌍 World population doubled in just 47 years (1974-2021)",
    "🇨🇳 China's population started declining in 2022 for the first time",
    "🌎 The median age worldwide is 30.9 years",
];

interface ClockEvent {
    id: number;
    type: 'birth' | 'death';
    x: number;
    y: number;
}

const PopulationClockPage: React.FC = () => {
    const [births, setBirths] = useState(0);
    const [deaths, setDeaths] = useState(0);
    const [events, setEvents] = useState<ClockEvent[]>([]);
    const [currentFact, setCurrentFact] = useState(0);
    const [startTime] = useState(Date.now());
    const [worldRates, setWorldRates] = useState({ birthsPerSec: 4.3, deathsPerSec: 1.8 });

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const data = await PopulationService.getRegion('WORLD');
                if (data) {
                    setWorldRates({
                        birthsPerSec: data.birthsPerSec,
                        deathsPerSec: data.deathsPerSec,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch world rates:", err);
            }
        };
        fetchRates();
    }, []);

    // Simulate real-time births and deaths
    useEffect(() => {
        const { birthsPerSec, deathsPerSec } = worldRates;

        const interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            setBirths(Math.floor(elapsed * birthsPerSec));
            setDeaths(Math.floor(elapsed * deathsPerSec));

            // Random birth/death event animation
            if (Math.random() < 0.3) {
                const newEvent: ClockEvent = {
                    id: Date.now(),
                    type: Math.random() < (birthsPerSec / (birthsPerSec + deathsPerSec)) ? 'birth' : 'death',
                    x: Math.random() * 80 + 10,
                    y: Math.random() * 80 + 10,
                };
                setEvents(prev => [...prev.slice(-20), newEvent]);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [startTime, worldRates]);

    // Rotate facts
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFact(prev => (prev + 1) % FACTS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const net = births - deaths;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-20 relative z-10"
            >
                <div className="inline-block">
                    <h1 className="text-5xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter uppercase">
                        CHRONO METRICS
                    </h1>
                    <div className="h-0.5 w-24 bg-accent mx-auto opacity-50"></div>
                </div>
                <p className="text-gray-500 text-xs font-black mt-8 tracking-[0.5em] uppercase">
                    WATCH THE WORLD CHANGE IN REAL-TIME
                </p>
            </motion.div>

            {/* Main Clock Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative z-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card rounded-[2.5rem] p-10 text-center border-white/5 group hover:border-green-500/30 transition-all duration-500"
                >
                    <div className="text-4xl p-4 bg-green-500/10 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-500">👶</div>
                    <div className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-2">LIVE BIRTHS</div>
                    <div className="text-5xl font-black text-green-400 tracking-tighter">
                        +{births.toLocaleString()}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-[2.5rem] p-10 text-center border-white/5 group hover:border-cyan-500/30 transition-all duration-500"
                >
                    <div className="text-4xl p-4 bg-cyan-500/10 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-500">🌍</div>
                    <div className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-2">NET SHIFT</div>
                    <div className="text-5xl font-black text-cyan-400 tracking-tighter">
                        +{net.toLocaleString()}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-[2.5rem] p-10 text-center border-white/5 group hover:border-red-500/30 transition-all duration-500"
                >
                    <div className="text-4xl p-4 bg-red-500/10 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-500">🕯️</div>
                    <div className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-2">LIVE DEATHS</div>
                    <div className="text-5xl font-black text-red-400 tracking-tighter">
                        -{deaths.toLocaleString()}
                    </div>
                </motion.div>
            </div>

            {/* Live Animation Area */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative glass-card rounded-[3rem] border-white/5 h-64 mb-16 overflow-hidden group shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-black tracking-[0.5em] text-white/10 uppercase group-hover:text-white/20 transition-colors">HUMAN PULSE SYNC ACTIVE</span>
                </div>
                <AnimatePresence>
                    {events.map(event => (
                        <motion.div
                            key={event.id}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2 }}
                            className={`absolute w-4 h-4 rounded-full ${event.type === 'birth' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            style={{ left: `${event.x}%`, top: `${event.y}%` }}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Fun Fact */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-[2.5rem] border-white/5 p-12 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
                <h3 className="text-[10px] font-black text-white/30 mb-8 tracking-[0.4em] uppercase">SYSTEM INSIGHTS</h3>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentFact}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xl md:text-3xl text-white font-black tracking-tight"
                    >
                        {FACTS[currentFact]}
                    </motion.p>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default PopulationClockPage;
