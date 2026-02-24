import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PopulationService, type RegionData } from '../services/api';
import SelectCountry from '../components/ui/SelectCountry';

const ComparePage: React.FC = () => {
    const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
    const [c1Code, setC1Code] = useState('IN');
    const [c2Code, setC2Code] = useState('CN');
    const [c1Data, setC1Data] = useState<RegionData | null>(null);
    const [c2Data, setC2Data] = useState<RegionData | null>(null);
    const [ticker, setTicker] = useState(0);

    // Fetch country list
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const list = await PopulationService.getAllRegions();
                setCountries(list.map(r => ({ code: r.code, name: r.name })).sort((a, b) => a.name.localeCompare(b.name)));
            } catch (err) {
                console.error("Failed to fetch countries", err);
            }
        };
        fetchCountries();
    }, []);

    // Fetch details for selected countries
    useEffect(() => {
        const fetchData = async () => {
            if (!c1Code) return;
            try {
                const data = await PopulationService.getRegion(c1Code);
                setC1Data(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [c1Code]);

    useEffect(() => {
        const fetchData = async () => {
            if (!c2Code) return;
            try {
                const data = await PopulationService.getRegion(c2Code);
                setC2Data(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [c2Code]);

    // Live ticker
    useEffect(() => {
        const timer = setInterval(() => setTicker(t => t + 1), 100);
        return () => clearInterval(timer);
    }, []);

    const getLivePop = (country: RegionData | null) => {
        if (!country) return 0;
        const netRate = (country.birthsPerSec || 0) - (country.deathsPerSec || 0) + (country.migrationPerSec || 0);
        return Math.floor(country.populationNow + (ticker / 10) * netRate);
    };

    const getNetRate = (country: RegionData | null) => {
        if (!country) return 0;
        return (country.birthsPerSec || 0) - (country.deathsPerSec || 0) + (country.migrationPerSec || 0);
    };

    const formatNumber = (num: number) => num.toLocaleString();

    const pop1 = getLivePop(c1Data);
    const pop2 = getLivePop(c2Data);
    const gap = Math.abs(pop1 - pop2);
    const leader = pop1 > pop2 ? c1Data : c2Data;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500">
                    ⚔️ Live Face-Off
                </h1>
                <p className="text-gray-400">Compare any two countries in real-time!</p>
            </motion.div>

            {/* Country Selectors */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-12">
                <SelectCountry
                    value={c1Code}
                    onChange={setC1Code}
                    countries={countries}
                    label="Contender 1"
                />
                <span className="text-3xl font-black text-red-500 mb-4">VS</span>
                <SelectCountry
                    value={c2Code}
                    onChange={setC2Code}
                    countries={countries}
                    label="Contender 2"
                />
            </div>

            {/* Face-Off Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`bg-gradient-to-br ${leader?.code === c1Code ? 'from-green-500/20' : 'from-red-500/20'} to-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-center`}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img
                            src={`https://flagcdn.com/w80/${c1Code?.toLowerCase()}.png`}
                            alt={c1Data?.name}
                            className="w-12 h-8 object-cover rounded shadow-lg"
                        />
                        <h2 className="text-3xl font-bold">{c1Data?.name || 'Loading...'}</h2>
                    </div>
                    <div className={`text-5xl md:text-6xl font-mono font-black ${leader?.code === c1Code ? 'text-green-400' : 'text-white'}`}>
                        {formatNumber(pop1)}
                    </div>
                    <div className="text-sm text-gray-400 mt-4 flex justify-center gap-4">
                        <span>Growth:</span>
                        <span className={getNetRate(c1Data) >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {getNetRate(c1Data) > 0 ? '+' : ''}{getNetRate(c1Data).toFixed(2)}/sec
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`bg-gradient-to-br ${leader?.code === c2Code ? 'from-green-500/20' : 'from-red-500/20'} to-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-center`}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img
                            src={`https://flagcdn.com/w80/${c2Code?.toLowerCase()}.png`}
                            alt={c2Data?.name}
                            className="w-12 h-8 object-cover rounded shadow-lg"
                        />
                        <h2 className="text-3xl font-bold">{c2Data?.name || 'Loading...'}</h2>
                    </div>
                    <div className={`text-5xl md:text-6xl font-mono font-black ${leader?.code === c2Code ? 'text-green-400' : 'text-white'}`}>
                        {formatNumber(pop2)}
                    </div>
                    <div className="text-sm text-gray-400 mt-4 flex justify-center gap-4">
                        <span>Growth:</span>
                        <span className={getNetRate(c2Data) >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {getNetRate(c2Data) > 0 ? '+' : ''}{getNetRate(c2Data).toFixed(2)}/sec
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Gap Analysis */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-center max-w-2xl mx-auto"
            >
                <h3 className="text-xl text-gray-400 mb-2 uppercase tracking-widest">Current Population Gap</h3>
                <div className="text-4xl md:text-6xl font-mono font-black text-cyan-400 mb-2">
                    {formatNumber(gap)}
                </div>
                <p className="text-gray-500 mt-2">
                    {leader?.name} leads by {((gap / (pop1 + pop2)) * 100).toFixed(4)}%
                </p>
            </motion.div>
        </div>
    );
};

export default ComparePage;
