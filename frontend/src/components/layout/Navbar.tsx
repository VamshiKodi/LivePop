import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/leaderboard', label: '🏆 Leaderboard' },
    { to: '/clock', label: '⏱️ Clock' },
    { to: '/compare', label: '⚔️ Compare' },
];

const MORE_LINKS = [
    { to: '/timeline', label: '🕰️ Timeline' },
    { to: '/milestones', label: '🔮 Milestones' },
    { to: '/demographics', label: '📊 Demographics' },
    { to: '/density', label: '🏙️ Density' },
    { to: '/birthday', label: '🎂 Birthday' },
];

const Navbar: React.FC = () => {
    const [moreOpen, setMoreOpen] = useState(false);

    return (
        <nav
            className={clsx(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                'glass-nav shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-dark font-black text-xl shadow-[0_0_20px_rgba(0,198,255,0.3)] group-hover:shadow-[0_0_32px_rgba(0,198,255,0.55)] transition-all"
                            whileHover={{ scale: 1.07, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                        >
                            L
                        </motion.div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent2 group-hover:drop-shadow-[0_0_10px_rgba(0,198,255,0.55)] transition-all">
                            LivePop
                        </span>
                    </Link>

                    {/* Nav links */}
                    <div className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 text-sm font-medium tracking-tight relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent hover:after:w-full after:transition-all after:duration-300 after:ease-in-out"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* More Dropdown */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setMoreOpen(!moreOpen)}
                                className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors text-sm px-2 flex items-center gap-1.5 font-medium"
                                whileHover={{ scale: 1.02 }}
                            >
                                More
                                <motion.span
                                    animate={{ rotate: moreOpen ? 180 : 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="inline-block text-[10px]"
                                >
                                    ▼
                                </motion.span>
                            </motion.button>

                            <AnimatePresence>
                                {moreOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                                        className="absolute right-0 mt-4 w-52 bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden py-2 border border-gray-200 dark:border-white/10"
                                        onMouseLeave={() => setMoreOpen(false)}
                                    >
                                        {MORE_LINKS.map((link, idx) => (
                                            <motion.div
                                                key={link.to}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.04, duration: 0.25 }}
                                            >
                                                <Link
                                                    to={link.to}
                                                    onClick={() => setMoreOpen(false)}
                                                    className="block px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-200 text-sm"
                                                >
                                                    {link.label}
                                                </Link>
                                            </motion.div>
                                        ))}
                                        <div className="border-t border-gray-200 dark:border-white/10 my-1 mx-3" />
                                        <Link
                                            to="/about"
                                            onClick={() => setMoreOpen(false)}
                                            className="block px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-200 text-sm"
                                        >
                                            ℹ️ About
                                        </Link>
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
