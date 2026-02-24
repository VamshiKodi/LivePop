import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BirthdayCalculatorPage: React.FC = () => {
    const [birthdate, setBirthdate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<{
        sameDayBirths: number;
        worldPopThen: number;
        worldPopNow: number;
        percentileRank: number;
        dayOfYear: number;
        isLeapDay: boolean;
    } | null>(null);

    const calculate = () => {
        setResults(null);
        setError(null);

        if (!birthdate) {
            setError('Please enter your birthdate.');
            return;
        }

        // Try to parse YYYY-MM-DD or DD-MM-YYYY
        let y: number, m: number, d: number;
        const parts = birthdate.split(/[-/.]/);

        if (parts.length === 3) {
            if (parts[0].length === 4) {
                // YYYY-MM-DD
                [y, m, d] = parts.map(Number);
            } else {
                // DD-MM-YYYY
                [d, m, y] = parts.map(Number);
            }
        } else {
            setError('Please use YYYY-MM-DD or DD-MM-YYYY format.');
            return;
        }

        const date = new Date(y, m - 1, d);

        // Check if the date is actually valid (JavaScript Date constructor rolls over invalid dates)
        if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d) {
            if (m === 2 && d === 29) {
                setError(`This year (${y}) was not a leap year, so February 29th doesn't exist!`);
            } else {
                setError('This date does not exist.');
            }
            return;
        }

        if (isNaN(date.getTime())) {
            setError('Invalid date format.');
            return;
        }

        // Check for future dates
        if (date >= new Date()) {
            setError('Birthdate cannot be in the future.');
            return;
        }

        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

        // Estimate world population and birth rates at birth year
        const birthYear = date.getFullYear();
        const popByYear: Record<number, number> = {
            1950: 2.5e9, 1960: 3.03e9, 1970: 3.70e9, 1980: 4.45e9,
            1990: 5.32e9, 2000: 6.14e9, 2010: 6.95e9, 2020: 7.84e9, 2025: 8.2e9
        };
        const birthRatesByYear: Record<number, number> = {
            1950: 37, 1960: 35, 1970: 31, 1980: 28,
            1990: 25, 2000: 22, 2010: 20, 2020: 18, 2025: 17
        };

        // Interpolate
        const years = Object.keys(popByYear).map(Number).sort((a, b) => a - b);
        let worldPopThen = 8.2e9;
        let birthRateThen = 17;

        if (birthYear <= years[0]) {
            worldPopThen = popByYear[years[0]];
            birthRateThen = birthRatesByYear[years[0]];
        } else if (birthYear >= years[years.length - 1]) {
            worldPopThen = popByYear[years[years.length - 1]];
            birthRateThen = birthRatesByYear[years[years.length - 1]];
        } else {
            for (let i = 0; i < years.length - 1; i++) {
                if (birthYear >= years[i] && birthYear < years[i + 1]) {
                    const ratio = (birthYear - years[i]) / (years[i + 1] - years[i]);
                    worldPopThen = popByYear[years[i]] + ratio * (popByYear[years[i + 1]] - popByYear[years[i]]);
                    birthRateThen = birthRatesByYear[years[i]] + ratio * (birthRatesByYear[years[i + 1]] - birthRatesByYear[years[i]]);
                    break;
                }
            }
        }

        // Calculate births per day for that year
        const birthsPerDayThen = (worldPopThen * (birthRateThen / 1000)) / 365.25;

        const worldPopNow = 8.2e9;
        const currentBirthsPerDay = 385000;

        // People born after you (these people are younger than you)
        const yearsOld = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        const avgBirthsPerDay = (birthsPerDayThen + currentBirthsPerDay) / 2;
        const bornAfterYou = yearsOld * 365.25 * avgBirthsPerDay;
        const percentileRank = (bornAfterYou / worldPopNow) * 100;

        setResults({
            sameDayBirths: Math.floor(birthsPerDayThen),
            worldPopThen: Math.floor(worldPopThen),
            worldPopNow: Math.floor(worldPopNow),
            percentileRank: Math.max(0.1, Math.min(99.9, percentileRank)),
            dayOfYear,
            isLeapDay: m === 2 && d === 29
        });
    };

    const formatNumber = (n: number) => {
        if (n >= 1e9) return `${(n / 1e9).toFixed(2)} Billion`;
        if (n >= 1e6) return `${(n / 1e6).toFixed(1)} Million`;
        return n.toLocaleString();
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-500">
                    🎂 Birthday Calculator
                </h1>
                <p className="text-gray-400 text-lg">Discover population facts about your birthday!</p>
            </motion.div>

            {/* Input */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 mb-8"
            >
                <label className="block text-gray-400 mb-2">Enter your birthdate (DD-MM-YYYY):</label>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="e.g. 01-04-2006"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="flex-1 bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
                    />
                    <button
                        onClick={calculate}
                        className="bg-gradient-to-r from-pink-500 to-red-500 px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                    >
                        Calculate
                    </button>
                </div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-red-400 mt-4 font-medium"
                    >
                        ⚠️ {error}
                    </motion.p>
                )}
            </motion.div>

            {/* Results */}
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {results.isLeapDay && (
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-4 text-center font-bold shadow-lg mb-6 border border-white/20">
                            ✨ Special Leap Year Birthday!
                            <div className="text-xs font-normal opacity-90 mt-1">
                                You're a "Leapling"! Only 1 in 1,461 people share this rare connection.
                            </div>
                        </div>
                    )}
                    <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/30 rounded-xl p-6">
                        <div className="text-gray-400 text-sm mb-1">On the day you were born, approximately this many people were also born:</div>
                        <div className="text-4xl font-black text-pink-400">~{results.sameDayBirths.toLocaleString()}</div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
                        <div className="text-gray-400 text-sm mb-1">World population when you were born:</div>
                        <div className="text-4xl font-black text-blue-400">{formatNumber(results.worldPopThen)}</div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6">
                        <div className="text-gray-400 text-sm mb-1">World population now:</div>
                        <div className="text-4xl font-black text-green-400">{formatNumber(results.worldPopNow)}</div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
                        <div className="text-gray-400 text-sm mb-1">You're older than approximately:</div>
                        <div className="text-4xl font-black text-yellow-400">{results.percentileRank.toFixed(1)}% of humans alive</div>
                    </div>

                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
                        <p className="text-gray-400">
                            Your birthday is day <span className="text-white font-bold">{results.dayOfYear}</span> of the year! 🎉
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default BirthdayCalculatorPage;
