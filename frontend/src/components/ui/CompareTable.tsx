import React from 'react';
import { motion } from 'framer-motion';

interface CompareTableProps {
  country1: {
    name: string;
    code: string;
    population: number;
    growthRate: number;
    birthsPerSec: number;
    deathsPerSec: number;
    density?: number;
  };
  country2: {
    name: string;
    code: string;
    population: number;
    growthRate: number;
    birthsPerSec: number;
    deathsPerSec: number;
    density?: number;
  };
}

export const CompareTable: React.FC<CompareTableProps> = ({ country1, country2 }) => {
  const formatPop = (pop: number) => {
    if (pop >= 1e9) return `${(pop / 1e9).toFixed(2)}B`;
    if (pop >= 1e6) return `${(pop / 1e6).toFixed(1)}M`;
    return pop.toLocaleString();
  };

  const stats = [
    { label: 'Population', key: 'population', format: formatPop },
    { label: 'Growth Rate', key: 'growthRate', format: (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%` },
    { label: 'Births/sec', key: 'birthsPerSec', format: (v: number) => v.toFixed(2) },
    { label: 'Deaths/sec', key: 'deathsPerSec', format: (v: number) => v.toFixed(2) },
    { label: 'Density (/km²)', key: 'density', format: (v: number) => v?.toLocaleString() || 'N/A' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden mt-8"
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-white/10">
            <th className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 font-medium">Stat</th>
            <th className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={`https://flagcdn.com/w40/${country1.code.toLowerCase()}.png`}
                  alt={country1.name}
                  className="w-6 h-4 rounded"
                />
                <span className="text-gray-900 dark:text-white font-bold">{country1.name}</span>
              </div>
            </th>
            <th className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={`https://flagcdn.com/w40/${country2.code.toLowerCase()}.png`}
                  alt={country2.name}
                  className="w-6 h-4 rounded"
                />
                <span className="text-gray-900 dark:text-white font-bold">{country2.name}</span>
              </div>
            </th>
            <th className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 font-medium">Difference</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => {
            const val1 = country1[stat.key as keyof typeof country1] as number || 0;
            const val2 = country2[stat.key as keyof typeof country2] as number || 0;
            const diff = val1 - val2;
            const isBetter = stat.key === 'deathsPerSec' ? diff < 0 : diff > 0;

            return (
              <tr key={stat.key} className="border-b border-gray-100 dark:border-white/5 last:border-0">
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{stat.label}</td>
                <td className="px-6 py-4 text-center text-gray-900 dark:text-white font-semibold">
                  {stat.format(val1)}
                </td>
                <td className="px-6 py-4 text-center text-gray-900 dark:text-white font-semibold">
                  {stat.format(val2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`font-medium ${isBetter ? 'text-green-500' : 'text-red-500'}`}>
                    {diff > 0 ? '+' : ''}{stat.format(Math.abs(diff))}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};

export default CompareTable;
