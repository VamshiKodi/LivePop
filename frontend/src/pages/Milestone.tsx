import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Milestone {
    label: string;
    target: number;
    estimatedDate: Date;
    color: string;
    icon: string;
}

// Comprehensive milestones based on UN projections
const DEMO_MILESTONES: Milestone[] = [
    {
        label: "World Population: 9 Billion",
        target: 9000000000,
        estimatedDate: new Date("2037-07-15"),
        color: "text-blue-400",
        icon: "🌍"
    },
    {
        label: "World Population: 10 Billion",
        target: 10000000000,
        estimatedDate: new Date("2058-11-20"),
        color: "text-purple-400",
        icon: "🌎"
    },
    {
        label: "India: 1.5 Billion",
        target: 1500000000,
        estimatedDate: new Date("2030-03-20"),
        color: "text-orange-400",
        icon: "🇮🇳"
    },
    {
        label: "China Falls Below 1.4 Billion",
        target: 1400000000,
        estimatedDate: new Date("2027-06-01"),
        color: "text-red-400",
        icon: "🇨🇳"
    },
    {
        label: "USA: 350 Million",
        target: 350000000,
        estimatedDate: new Date("2026-08-01"),
        color: "text-cyan-400",
        icon: "🇺🇸"
    },
    {
        label: "Nigeria: 300 Million",
        target: 300000000,
        estimatedDate: new Date("2031-02-15"),
        color: "text-green-400",
        icon: "🇳🇬"
    },
    {
        label: "Africa: 2 Billion",
        target: 2000000000,
        estimatedDate: new Date("2038-09-10"),
        color: "text-yellow-400",
        icon: "🌍"
    },
    {
        label: "Indonesia: 300 Million",
        target: 300000000,
        estimatedDate: new Date("2032-04-25"),
        color: "text-pink-400",
        icon: "🇮🇩"
    }
];

const MilestonePage: React.FC = () => {
    const [milestones] = useState<Milestone[]>(DEMO_MILESTONES);

    useEffect(() => {
        const timer = setInterval(() => {}, 1000); // Ticker effect kept for re-renders
        return () => clearInterval(timer);
    }, []);

    const getTimeLeft = (targetDate: Date) => {
        const now = new Date();
        const diff = targetDate.getTime() - now.getTime();

        if (diff <= 0) return "🎉 Reached!";

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (years > 0) return `${years}y ${days}d ${hours}h`;
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-24 relative z-10"
            >
                <div className="inline-block">
                    <h1 className="text-5xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter uppercase">
                        FUTURE HORIZONS
                    </h1>
                    <div className="h-0.5 w-24 bg-purple-500 mx-auto opacity-50"></div>
                </div>
                <p className="text-gray-500 text-xs font-black mt-8 tracking-[0.5em] uppercase">
                    PREDICTING THE PULSE OF TOMORROW
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {milestones.map((m, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card rounded-[2.5rem] p-8 border-white/5 group hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2"
                    >
                        <div className="text-4xl p-4 bg-white/5 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-500">{m.icon}</div>
                        <h2 className="text-xs font-black tracking-widest text-white/40 mb-4 uppercase group-hover:text-white transition-colors">{m.label}</h2>
                        <div className={`text-2xl font-black tracking-tighter mb-6 ${m.color} drop-shadow-sm`}>
                            {getTimeLeft(m.estimatedDate)}
                        </div>
                        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">ETA</span>
                            <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">{m.estimatedDate.toLocaleDateString()}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MilestonePage;
