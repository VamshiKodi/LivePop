import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface DensityData {
    code: string;
    name: string;
    population: number;
    area: number;
    density: number;
}

// Complete density data for ALL countries (sorted by density)
const ALL_DENSITY_DATA: DensityData[] = [
    { code: 'MO', name: 'Macau', population: 700000, area: 33, density: 21212 },
    { code: 'MC', name: 'Monaco', population: 36000, area: 2, density: 18000 },
    { code: 'SG', name: 'Singapore', population: 6000000, area: 733, density: 8186 },
    { code: 'HK', name: 'Hong Kong', population: 7500000, area: 1114, density: 6732 },
    { code: 'GI', name: 'Gibraltar', population: 33000, area: 7, density: 4714 },
    { code: 'BH', name: 'Bahrain', population: 1500000, area: 778, density: 1928 },
    { code: 'MV', name: 'Maldives', population: 520000, area: 298, density: 1745 },
    { code: 'MT', name: 'Malta', population: 530000, area: 316, density: 1677 },
    { code: 'BD', name: 'Bangladesh', population: 175686899, area: 147570, density: 1191 },
    { code: 'PS', name: 'Palestine', population: 5400000, area: 6020, density: 897 },
    { code: 'TW', name: 'Taiwan', population: 23113000, area: 36193, density: 639 },
    { code: 'RW', name: 'Rwanda', population: 14000000, area: 26338, density: 531 },
    { code: 'KR', name: 'South Korea', population: 52000000, area: 100210, density: 519 },
    { code: 'LB', name: 'Lebanon', population: 5400000, area: 10452, density: 517 },
    { code: 'BI', name: 'Burundi', population: 13000000, area: 27834, density: 467 },
    { code: 'IN', name: 'India', population: 1463865525, area: 3287263, density: 445 },
    { code: 'IL', name: 'Israel', population: 9800000, area: 22072, density: 444 },
    { code: 'HT', name: 'Haiti', population: 12000000, area: 27750, density: 432 },
    { code: 'NL', name: 'Netherlands', population: 17900000, area: 41850, density: 428 },
    { code: 'PH', name: 'Philippines', population: 118000000, area: 300000, density: 393 },
    { code: 'BE', name: 'Belgium', population: 11700000, area: 30528, density: 383 },
    { code: 'LK', name: 'Sri Lanka', population: 23229000, area: 65610, density: 354 },
    { code: 'JP', name: 'Japan', population: 124000000, area: 377975, density: 328 },
    { code: 'VN', name: 'Vietnam', population: 100000000, area: 331212, density: 302 },
    { code: 'PK', name: 'Pakistan', population: 255219554, area: 881913, density: 289 },
    { code: 'GB', name: 'United Kingdom', population: 68000000, area: 242495, density: 280 },
    { code: 'NG', name: 'Nigeria', population: 237527782, area: 923768, density: 257 },
    { code: 'DE', name: 'Germany', population: 84000000, area: 357114, density: 235 },
    { code: 'DO', name: 'Dominican Republic', population: 11000000, area: 48671, density: 226 },
    { code: 'UG', name: 'Uganda', population: 50000000, area: 241038, density: 207 },
    { code: 'NP', name: 'Nepal', population: 31000000, area: 147516, density: 210 },
    { code: 'IT', name: 'Italy', population: 59000000, area: 301340, density: 196 },
    { code: 'MW', name: 'Malawi', population: 21000000, area: 118484, density: 177 },
    { code: 'GT', name: 'Guatemala', population: 18000000, area: 108889, density: 165 },
    { code: 'ID', name: 'Indonesia', population: 285721236, area: 1904569, density: 150 },
    { code: 'CN', name: 'China', population: 1416096094, area: 9596961, density: 148 },
    { code: 'GH', name: 'Ghana', population: 34000000, area: 238533, density: 143 },
    { code: 'TH', name: 'Thailand', population: 72000000, area: 513120, density: 140 },
    { code: 'PL', name: 'Poland', population: 38000000, area: 312679, density: 122 },
    { code: 'FR', name: 'France', population: 66000000, area: 551695, density: 120 },
    { code: 'ET', name: 'Ethiopia', population: 135000000, area: 1104300, density: 122 },
    { code: 'SY', name: 'Syria', population: 23000000, area: 185180, density: 124 },
    { code: 'EG', name: 'Egypt', population: 115000000, area: 1002450, density: 115 },
    { code: 'TR', name: 'Turkey', population: 87000000, area: 783562, density: 111 },
    { code: 'AT', name: 'Austria', population: 9100000, area: 83879, density: 108 },
    { code: 'IQ', name: 'Iraq', population: 46000000, area: 438317, density: 105 },
    { code: 'HU', name: 'Hungary', population: 9600000, area: 93028, density: 103 },
    { code: 'KE', name: 'Kenya', population: 56000000, area: 580367, density: 97 },
    { code: 'ES', name: 'Spain', population: 48000000, area: 505990, density: 95 },
    { code: 'MA', name: 'Morocco', population: 38000000, area: 446550, density: 85 },
    { code: 'MM', name: 'Myanmar', population: 55000000, area: 676578, density: 81 },
    { code: 'RO', name: 'Romania', population: 18909000, area: 238397, density: 79 },
    { code: 'TZ', name: 'Tanzania', population: 68000000, area: 945087, density: 72 },
    { code: 'MX', name: 'Mexico', population: 132000000, area: 1964375, density: 67 },
    { code: 'YE', name: 'Yemen', population: 35000000, area: 527968, density: 66 },
    { code: 'AF', name: 'Afghanistan', population: 43000000, area: 652230, density: 66 },
    { code: 'UA', name: 'Ukraine', population: 37000000, area: 603500, density: 61 },
    { code: 'MG', name: 'Madagascar', population: 33000000, area: 587041, density: 56 },
    { code: 'IR', name: 'Iran', population: 92000000, area: 1648195, density: 56 },
    { code: 'ZA', name: 'South Africa', population: 62000000, area: 1221037, density: 51 },
    { code: 'CO', name: 'Colombia', population: 52000000, area: 1141748, density: 46 },
    { code: 'BY', name: 'Belarus', population: 9200000, area: 207600, density: 44 },
    { code: 'MZ', name: 'Mozambique', population: 34000000, area: 801590, density: 42 },
    { code: 'ZW', name: 'Zimbabwe', population: 16000000, area: 390757, density: 41 },
    { code: 'VE', name: 'Venezuela', population: 33000000, area: 916445, density: 36 },
    { code: 'US', name: 'United States', population: 347275807, area: 9833520, density: 35 },
    { code: 'AO', name: 'Angola', population: 37000000, area: 1246700, density: 30 },
    { code: 'ZM', name: 'Zambia', population: 20000000, area: 752612, density: 27 },
    { code: 'CL', name: 'Chile', population: 19600000, area: 756102, density: 26 },
    { code: 'SD', name: 'Sudan', population: 48000000, area: 1861484, density: 26 },
    { code: 'PE', name: 'Peru', population: 34000000, area: 1285216, density: 26 },
    { code: 'BR', name: 'Brazil', population: 212812405, area: 8515767, density: 25 },
    { code: 'SE', name: 'Sweden', population: 10500000, area: 450295, density: 23 },
    { code: 'NE', name: 'Niger', population: 27918000, area: 1267000, density: 22 },
    { code: 'DZ', name: 'Algeria', population: 47000000, area: 2381741, density: 20 },
    { code: 'ML', name: 'Mali', population: 25199000, area: 1240192, density: 20 },
    { code: 'NZ', name: 'New Zealand', population: 5200000, area: 268021, density: 19 },
    { code: 'SA', name: 'Saudi Arabia', population: 37000000, area: 2149690, density: 17 },
    { code: 'AR', name: 'Argentina', population: 46000000, area: 2780400, density: 17 },
    { code: 'FI', name: 'Finland', population: 5600000, area: 338424, density: 17 },
    { code: 'NO', name: 'Norway', population: 5500000, area: 385207, density: 14 },
    { code: 'TD', name: 'Chad', population: 18000000, area: 1284000, density: 14 },
    { code: 'BO', name: 'Bolivia', population: 12000000, area: 1098581, density: 11 },
    { code: 'GA', name: 'Gabon', population: 2400000, area: 267668, density: 9 },
    { code: 'CF', name: 'Central African Rep.', population: 5700000, area: 622984, density: 9 },
    { code: 'RU', name: 'Russia', population: 144000000, area: 17098242, density: 8 },
    { code: 'KZ', name: 'Kazakhstan', population: 20000000, area: 2724900, density: 7 },
    { code: 'MR', name: 'Mauritania', population: 4900000, area: 1030700, density: 5 },
    { code: 'LY', name: 'Libya', population: 7000000, area: 1759540, density: 4 },
    { code: 'BW', name: 'Botswana', population: 2600000, area: 581730, density: 4 },
    { code: 'GY', name: 'Guyana', population: 800000, area: 214969, density: 4 },
    { code: 'SR', name: 'Suriname', population: 620000, area: 163820, density: 4 },
    { code: 'CA', name: 'Canada', population: 40000000, area: 9984670, density: 4 },
    { code: 'IS', name: 'Iceland', population: 398000, area: 103000, density: 4 },
    { code: 'NA', name: 'Namibia', population: 2600000, area: 825615, density: 3 },
    { code: 'AU', name: 'Australia', population: 27000000, area: 7692024, density: 3 },
    { code: 'MN', name: 'Mongolia', population: 3400000, area: 1564116, density: 2 },
    { code: 'GL', name: 'Greenland', population: 57000, area: 2166086, density: 0.03 },
];

const DensityPage: React.FC = () => {
    const [view, setView] = useState<'highest' | 'lowest'>('highest');
    const [searchQuery, setSearchQuery] = useState('');

    const displayedCountries = useMemo(() => {
        let filtered = ALL_DENSITY_DATA.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.code.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (view === 'lowest') {
            filtered = [...filtered].sort((a, b) => a.density - b.density);
        }

        return filtered.slice(0, 50);
    }, [view, searchQuery]);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="inline-block mb-6">
                    <h1 className="text-5xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tighter uppercase">
                        LAND MASS DENSITY
                    </h1>
                    <div className="h-0.5 w-24 bg-teal-500 mx-auto opacity-50"></div>
                </div>
                <p className="text-gray-500 text-xs font-black tracking-[0.5em] uppercase">Occupancy Per Square Kilometer</p>
            </motion.div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
                <div className="flex p-1.5 glass-card rounded-2xl border-white/5">
                    <button
                        onClick={() => setView('highest')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${view === 'highest' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white/60'
                            }`}
                    >
                        MAX DENSITY
                    </button>
                    <button
                        onClick={() => setView('lowest')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${view === 'lowest' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white/60'
                            }`}
                    >
                        MIN DENSITY
                    </button>
                </div>
                <div className="relative group w-full md:w-80">
                    <div className="absolute -inset-1 bg-teal-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <input
                        type="text"
                        placeholder="FILTER REGIONS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-black tracking-widest focus:border-teal-500/50 outline-none transition-all placeholder:text-white/20 uppercase relative z-10"
                    />
                </div>
            </div>

            {/* Density List */}
            <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                    {displayedCountries.map((c, idx) => (
                        <Link
                            key={c.code}
                            to={`/country/${c.code}`}
                            className="flex items-center justify-between p-6 hover:bg-white/5 transition-all group"
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black font-mono text-white/20 w-8">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-white/10 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
                                    <img
                                        src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                                        alt={c.name}
                                        className="w-8 h-5 object-cover rounded-sm grayscale-[0.2] group-hover:grayscale-0 transition-all relative z-10"
                                    />
                                </div>
                                <span className="text-white text-xs font-black tracking-tight uppercase group-hover:text-accent transition-colors">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Est. Population</span>
                                    <span className="text-[10px] font-black text-white/40">{(c.population / 1000000).toFixed(1)}M</span>
                                </div>
                                <div className="flex flex-col items-end min-w-[100px]">
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Density</span>
                                    <span className={`text-sm font-black tracking-tighter ${view === 'highest' ? 'text-teal-400' : 'text-cyan-400'}`}>
                                        {c.density >= 1 ? Math.round(c.density).toLocaleString() : c.density.toFixed(2)}
                                        <span className="text-[10px] ml-1 opacity-40 font-normal">/ KM²</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DensityPage;
