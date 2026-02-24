import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
    const [moreOpen, setMoreOpen] = useState(false);

    return (
        <nav className={clsx(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            "glass-nav shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-dark font-black text-xl shadow-[0_0_20px_rgba(0,198,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,198,255,0.5)] transition-all"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                            L
                        </motion.div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent2 group-hover:drop-shadow-[0_0_8px_rgba(0,198,255,0.5)] transition-all">
                            LivePop
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium tracking-tight relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent hover:after:w-full after:transition-all">Home</Link>
                        <Link to="/leaderboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium tracking-tight relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent hover:after:w-full after:transition-all">🏆 Leaderboard</Link>
                        <Link to="/clock" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium tracking-tight relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent hover:after:w-full after:transition-all">⏱️ Clock</Link>
                        <Link to="/compare" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium tracking-tight relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent hover:after:w-full after:transition-all">⚔️ Compare</Link>

                        {/* More Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setMoreOpen(!moreOpen)}
                                className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors text-sm px-2 flex items-center gap-1"
                            >
                                More ▼
                            </button>
                            <AnimatePresence>
                                {moreOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-4 w-52 bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden py-1 border border-gray-200 dark:border-white/10"
                                        onMouseLeave={() => setMoreOpen(false)}
                                    >
                                        <Link to="/timeline" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">🕰️ Timeline</Link>
                                        <Link to="/milestones" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">🔮 Milestones</Link>
                                        <Link to="/demographics" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">📊 Demographics</Link>
                                        <Link to="/density" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">🏙️ Density</Link>
                                        <Link to="/birthday" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">🎂 Birthday</Link>
                                        <div className="border-t border-gray-200 dark:border-white/10 my-1" />
                                        <Link to="/about" className="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">ℹ️ About</Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
