import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FaTimes } from 'react-icons/fa';
import { PopulationService } from '../services/api';

const Demographics: React.FC = () => {
    const [allCountries, setAllCountries] = useState<DemographicsData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<DemographicsData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const regions = await PopulationService.getAllRegions();
                // Transform API data to current shape
                const mappedData: DemographicsData[] = regions
                    .filter(r => r.demographics) // Only regions with demo data
                    .map(r => ({
                        code: r.code,
                        name: r.name,
                        youth: r.demographics!.youth,
                        working: r.demographics!.working,
                        elderly: r.demographics!.elderly,
                        density: r.density || 0,
                        pop: r.populationNow
                    }));

                // Sort by population by default
                mappedData.sort((a, b) => b.pop - a.pop);
                setAllCountries(mappedData);
            } catch (error) {
                console.error("Failed to fetch demographics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredCountries = useMemo(() => {
        return allCountries.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allCountries]);

    const formatPop = (pop: number) => {
        if (pop >= 1e9) return `${(pop / 1e9).toFixed(2)}B`;
        if (pop >= 1e6) return `${(pop / 1e6).toFixed(1)}M`;
        if (pop >= 1e3) return `${(pop / 1e3).toFixed(0)}K`;
        return pop.toString();
    };

    // Generate projection data for modal
    const getProjectionData = (country: DemographicsData) => {
        const data = [];
        const growthRate = (country.youth - country.elderly) / 1000;
        let pop = country.pop * 0.85;
        for (let year = 2015; year <= 2035; year++) {
            data.push({ year, population: Math.floor(pop) });
            pop *= (1 + growthRate);
        }
        return data;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 relative z-10"
            >
                <div className="inline-block">
                    <h1 className="text-5xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter uppercase">
                        AGE DEMOGRAPHICS
                    </h1>
                    <div className="h-0.5 w-24 bg-cyan-500 mx-auto opacity-50"></div>
                </div>
                <p className="text-gray-500 text-xs font-black mt-8 tracking-[0.5em] uppercase">
                    Global Distribution Analysis
                </p>
            </motion.div>

            {/* Search */}
            <div className="max-w-md mx-auto mb-16 relative group">
                <div className="absolute -inset-1 bg-cyan-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <input
                    type="text"
                    placeholder="SEARCH DIRECTORY..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-black tracking-widest focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/20 uppercase relative z-10"
                />
            </div>

            {/* Countries Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredCountries.map((country, idx) => {
                    const ages = [
                        { name: '0-14', value: country.youth, color: '#10b981' },
                        { name: '15-64', value: country.working, color: '#06b6d4' },
                        { name: '65+', value: country.elderly, color: '#ef4444' },
                    ];

                    return (
                        <motion.div
                            key={country.code}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: Math.min(idx * 0.01, 0.5) }}
                            onClick={() => setSelectedCountry(country)}
                            className="cursor-pointer glass-card rounded-[2rem] p-4 group hover:border-cyan-500/30 transition-all duration-500"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-white/10 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
                                    {country.code === 'WORLD' ? (
                                        <div className="w-6 h-4 flex items-center justify-center text-lg relative z-10">🌍</div>
                                    ) : (
                                        <img
                                            src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                            alt={country.name}
                                            className="w-6 h-4 object-cover rounded-sm grayscale-[0.2] group-hover:grayscale-0 transition-all relative z-10"
                                        />
                                    )}
                                </div>
                                <span className="font-black text-white text-[10px] tracking-tight truncate uppercase">{country.name}</span>
                            </div>

                            <div className="relative h-20 w-full mb-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={ages}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={22}
                                            outerRadius={35}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {ages.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-[8px] font-black text-white/20">DATA</span>
                                </div>
                            </div>

                            <div className="text-[10px] font-black tracking-widest text-white/20 group-hover:text-cyan-400 transition-colors text-center uppercase">
                                {country.density.toLocaleString()} / KM²
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-8 flex justify-center gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="text-gray-400">Youth (0-14)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span className="text-gray-400">Working (15-64)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="text-gray-400">Elderly (65+)</span>
                </div>
            </div>

            <div className="text-center mt-4 text-gray-500 text-sm">
                Showing {filteredCountries.length} of {allCountries.length} countries
            </div>

            {/* Modal Popup */}
            <AnimatePresence>
                {selectedCountry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedCountry(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    {selectedCountry.code === 'WORLD' ? (
                                        <div className="w-12 h-8 flex items-center justify-center text-3xl rounded shadow-lg bg-blue-500/20">🌍</div>
                                    ) : (
                                        <img
                                            src={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`}
                                            alt={selectedCountry.name}
                                            className="w-12 h-8 object-cover rounded shadow-lg"
                                        />
                                    )}
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedCountry.name}</h2>
                                        <p className="text-gray-400 text-sm">Population: {formatPop(selectedCountry.pop)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCountry(null)}
                                    className="text-gray-400 hover:text-white p-2"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            {/* Age Distribution */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-800/50 rounded-xl p-4">
                                    <h3 className="text-lg font-bold mb-4 text-white">Age Distribution</h3>
                                    <ResponsiveContainer width="100%" height={150}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Youth (0-14)', value: selectedCountry.youth, color: '#10b981' },
                                                    { name: 'Working (15-64)', value: selectedCountry.working, color: '#3b82f6' },
                                                    { name: 'Elderly (65+)', value: selectedCountry.elderly, color: '#ef4444' },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                <Cell fill="#10b981" />
                                                <Cell fill="#3b82f6" />
                                                <Cell fill="#ef4444" />
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-around text-sm mt-2">
                                        <span className="text-green-400">{selectedCountry.youth}% Youth</span>
                                        <span className="text-blue-400">{selectedCountry.working}% Working</span>
                                        <span className="text-red-400">{selectedCountry.elderly}% Elderly</span>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-xl p-4">
                                    <h3 className="text-lg font-bold mb-4 text-white">Key Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Population</span>
                                            <span className="text-white font-bold">{formatPop(selectedCountry.pop)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Density</span>
                                            <span className="text-white font-bold">{selectedCountry.density.toLocaleString()}/km²</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Median Age (est)</span>
                                            <span className="text-white font-bold">{Math.round(20 + (selectedCountry.elderly * 1.5))} years</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Dependency Ratio</span>
                                            <span className="text-white font-bold">{((selectedCountry.youth + selectedCountry.elderly) / selectedCountry.working * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Population Projection */}
                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <h3 className="text-lg font-bold mb-4 text-white">📈 Population Trend</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={getProjectionData(selectedCountry)}>
                                        <defs>
                                            <linearGradient id="colorPopModal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="year" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" tickFormatter={(v) => formatPop(v)} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                            formatter={(value: number) => [formatPop(value), 'Population']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="population"
                                            stroke="#00f2ff"
                                            strokeWidth={2}
                                            fill="url(#colorPopModal)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Demographics;
