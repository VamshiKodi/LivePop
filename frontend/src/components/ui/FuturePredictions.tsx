import React from 'react';
import { motion } from 'framer-motion';

interface PredictionData {
  year: number;
  population: number;
  scenario: 'low' | 'medium' | 'high';
}

interface FuturePredictionsProps {
  countryName: string;
  currentPop: number;
  growthRate: number;
}

export const FuturePredictions: React.FC<FuturePredictionsProps> = ({
  countryName,
  currentPop,
  growthRate
}) => {
  const years = [2030, 2040, 2050];
  
  const predictions = years.map(year => {
    const yearsDiff = year - new Date().getFullYear();
    const rate = growthRate / 100;
    const low = Math.floor(currentPop * Math.pow(1 + rate * 0.8, yearsDiff));
    const medium = Math.floor(currentPop * Math.pow(1 + rate, yearsDiff));
    const high = Math.floor(currentPop * Math.pow(1 + rate * 1.2, yearsDiff));
    
    return { year, low, medium, high };
  });

  const formatPop = (pop: number) => {
    if (pop >= 1e9) return `${(pop / 1e9).toFixed(2)}B`;
    if (pop >= 1e6) return `${(pop / 1e6).toFixed(1)}M`;
    return pop.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 mt-8"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        📊 {countryName} Population Forecasts
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {predictions.map((pred) => (
          <div key={pred.year} className="text-center">
            <div className="text-2xl font-black text-accent mb-2">{pred.year}</div>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">Low: {formatPop(pred.low)}</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{formatPop(pred.medium)}</div>
              <div className="text-xs text-gray-500">High: {formatPop(pred.high)}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-400"></span> Low Growth
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-accent"></span> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-400"></span> High Growth
        </span>
      </div>
    </motion.div>
  );
};

export default FuturePredictions;
