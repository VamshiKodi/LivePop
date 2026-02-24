import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface YearData {
    year: number;
    world: number;
    india: number;
    china: number;
    usa: number;
}

// Historical and projected population data
const TIMELINE_DATA: YearData[] = [
    { year: 1950, world: 2.5, india: 0.36, china: 0.55, usa: 0.15 },
    { year: 1960, world: 3.0, india: 0.45, china: 0.67, usa: 0.18 },
    { year: 1970, world: 3.7, india: 0.55, china: 0.82, usa: 0.20 },
    { year: 1980, world: 4.4, india: 0.70, china: 0.98, usa: 0.23 },
    { year: 1990, world: 5.3, india: 0.87, china: 1.14, usa: 0.25 },
    { year: 2000, world: 6.1, india: 1.06, china: 1.26, usa: 0.28 },
    { year: 2010, world: 6.9, india: 1.23, china: 1.34, usa: 0.31 },
    { year: 2020, world: 7.8, india: 1.38, china: 1.41, usa: 0.33 },
    { year: 2025, world: 8.2, india: 1.46, china: 1.42, usa: 0.35 },
    { year: 2030, world: 8.5, india: 1.52, china: 1.40, usa: 0.36 },
    { year: 2040, world: 9.2, india: 1.62, china: 1.35, usa: 0.38 },
    { year: 2050, world: 9.7, india: 1.67, china: 1.28, usa: 0.39 },
    { year: 2075, world: 10.3, india: 1.60, china: 1.00, usa: 0.42 },
    { year: 2100, world: 10.4, india: 1.45, china: 0.77, usa: 0.43 },
];

const TimelinePage: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState(2025);

    const currentData = useMemo(() => {
        // Find the data points surrounding the selected year
        const nextIndex = TIMELINE_DATA.findIndex(d => d.year >= selectedYear);

        if (nextIndex === 0) return TIMELINE_DATA[0];
        if (nextIndex === -1) return TIMELINE_DATA[TIMELINE_DATA.length - 1];

        const prevData = TIMELINE_DATA[nextIndex - 1];
        const nextData = TIMELINE_DATA[nextIndex];

        // If exact match
        if (nextData.year === selectedYear) return nextData;

        // Linear interpolation
        const ratio = (selectedYear - prevData.year) / (nextData.year - prevData.year);

        return {
            year: selectedYear,
            world: prevData.world + (nextData.world - prevData.world) * ratio,
            india: prevData.india + (nextData.india - prevData.india) * ratio,
            china: prevData.china + (nextData.china - prevData.china) * ratio,
            usa: prevData.usa + (nextData.usa - prevData.usa) * ratio,
        };
    }, [selectedYear]);

    const formatBillions = (b: number) => b >= 1 ? `${b.toFixed(2)}B` : `${(b * 1000).toFixed(0)}M`;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto relative overflow-hidden">
            {/* Background Grid Mesh */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-16 relative z-10"
            >
                <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    TIME MACHINE
                </h1>
                <p className="text-blue-200/80 text-xl font-light tracking-wide max-w-2xl mx-auto">
                    Journey through the eras of human expansion.
                </p>
            </motion.div>

            {/* Aesthetics Graph */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="w-full mb-12 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] relative group"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-3xl pointer-events-none" />

                {/* Graph Container with fixed height to prevent overflow/overlap */}
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={TIMELINE_DATA}
                            onMouseMove={(e: any) => {
                                if (e.activePayload && e.activePayload[0]) {
                                    const year = e.activePayload[0].payload.year;
                                    setSelectedYear(year);
                                }
                            }}
                            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorWorld" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorIndia" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorChina" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="year"
                                stroke="#64748b"
                                tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#64748b"
                                tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val: any) => `${val}B`}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                                cursor={{ stroke: '#22d3ee', strokeWidth: 1, strokeDasharray: '4 4' }}
                                labelStyle={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '8px', fontFamily: 'monospace' }}
                                itemStyle={{ padding: '4px 0', fontSize: '13px', fontFamily: 'monospace' }}
                                formatter={(value: number) => [`${formatBillions(value)}`, '']}
                            />
                            <Area type="monotone" dataKey="world" name="World" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWorld)" animationDuration={1000} />
                            <Area type="monotone" dataKey="india" name="India" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorIndia)" animationDuration={1000} />
                            <Area type="monotone" dataKey="china" name="China" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorChina)" animationDuration={1000} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-8 mt-6">
                    {[
                        { label: 'World', color: 'bg-blue-500', text: 'text-blue-400' },
                        { label: 'India', color: 'bg-orange-500', text: 'text-orange-400' },
                        { label: 'China', color: 'bg-red-500', text: 'text-red-400' }
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
                            <span className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`} />
                            <span className={`text-xs font-bold uppercase tracking-wider ${item.text}`}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Floating Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10">
                {[
                    { label: 'World', value: currentData.world, color: 'from-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
                    { label: 'India', value: currentData.india, color: 'from-orange-500', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
                    { label: 'China', value: currentData.china, color: 'from-red-500', text: 'text-red-400', glow: 'shadow-red-500/20' },
                    { label: 'USA', value: currentData.usa, color: 'from-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' }
                ].map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (index * 0.1) }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-lg ${item.glow}`}
                    >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color} to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} />
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${item.color} to-transparent`} />
                                <span className="text-lg font-bold font-mono text-gray-100 tracking-wider uppercase">{item.label}</span>
                            </div>
                        </div>
                        <div className={`text-4xl font-black font-mono tracking-tight ${item.text} drop-shadow-[0_0_10px_currentColor] pl-4`}>
                            {formatBillions(item.value)}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Interactive Slider Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl pointer-events-none" />

                <h2 className="text-8xl font-black text-white mb-2 font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    {selectedYear}
                </h2>
                <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] mb-10 shadow-[0_0_15px_-5px_rgba(34,211,238,0.5)]">
                    Active Timeline
                </div>

                <div className="relative h-16 flex items-center justify-center mb-8">
                    <input
                        type="range"
                        min="1950"
                        max="2100"
                        step="1"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-full relative z-20 opacity-0 cursor-pointer h-full"
                    />
                    {/* Custom Stylized Slider Track */}
                    <div className="absolute inset-x-0 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                            style={{ width: `${((selectedYear - 1950) / 150) * 100}%` }}
                        />
                    </div>
                    {/* Custom Thumb */}
                    <motion.div
                        className="absolute h-8 w-8 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] border-4 border-blue-500 z-10 pointer-events-none"
                        style={{ left: `calc(${((selectedYear - 1950) / 150) * 100}% - 16px)` }}
                    />
                </div>

                <div className="flex justify-between text-gray-500 font-mono text-xs uppercase tracking-widest px-1">
                    <span>1950</span>
                    <span className="text-white font-bold">2025 (Present)</span>
                    <span>2100</span>
                </div>

                <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                        {selectedYear < 2025 ? (
                            <>In <span className="text-white font-bold">{selectedYear}</span>, the world was home to <span className="text-blue-400 font-bold drop-shadow-sm">{formatBillions(currentData.world)}</span> people.</>
                        ) : selectedYear === 2025 ? (
                            <span className="text-cyan-400 font-medium tracking-wide">📍 You are here. The pivotal moment of the 21st century.</span>
                        ) : (
                            <>Future Projection: By <span className="text-purple-400 font-bold">{selectedYear}</span>, humanity reaches <span className="text-pink-400 font-bold drop-shadow-sm">{formatBillions(currentData.world)}</span>.</>
                        )}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default TimelinePage;
