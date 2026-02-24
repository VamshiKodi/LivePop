import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full glass-card border-white/5 p-10 md:p-16 rounded-[3rem] relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-30"></div>
                
                <h1 className="text-[10px] font-black tracking-[0.5em] text-accent uppercase mb-8">System Manifest</h1>
                
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 uppercase">
                    ABOUT <span className="text-white/40">LIVEPOP</span>
                </h2>
                
                <p className="text-gray-400 leading-relaxed mb-10 text-lg font-medium tracking-tight">
                    LivePop is a high-fidelity real-time population interface. It synthesizes global demographic trends into a seamless, data-driven visualization, demonstrating the intersection of statistical modeling and modern digital architecture.
                </p>

                <div className="glass-card bg-white/5 rounded-2xl p-6 border-white/5 mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(0,198,255,0.8)]"></span>
                        <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">Stream Status</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                        SYNCHRONIZED WITH GLOBAL CENSUS NODE. PROJECTIONS ARE CALCULATED IN REAL-TIME BASED ON 2026 STATISTICAL MODELS AND LIVE WEB-SOCKET BROADCASTS.
                    </p>
                </div>

                <div className="flex justify-center mb-12">
                    <Link to="/">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-dark font-black tracking-[0.2em] text-[10px] uppercase px-10 py-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
                        >
                            INITIATE EXPLORATION
                        </motion.button>
                    </Link>
                </div>

                <div className="pt-10 border-t border-white/5">
                    <h3 className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-6 text-center">Core Architecture</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-white/60">REACT</span>
                            <span className="text-[8px] text-white/20 uppercase tracking-widest">Core Engine</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-white/60">VITE</span>
                            <span className="text-[8px] text-white/20 uppercase tracking-widest">Build Layer</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-white/60">TYPESCRIPT</span>
                            <span className="text-[8px] text-white/20 uppercase tracking-widest">Logic Tier</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-white/60">TAILWIND</span>
                            <span className="text-[8px] text-white/20 uppercase tracking-widest">Visual Layer</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
