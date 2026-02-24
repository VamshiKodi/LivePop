import React from 'react';
import { motion } from 'framer-motion';

export const CountryCardSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-2xl p-4 h-48"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </div>
      <div className="h-20 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-4" />
      <div className="flex justify-between">
        <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </div>
    </motion.div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <div className="w-48 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto mb-4" />
      <div className="w-96 h-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto mb-8" />
      <div className="w-64 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto" />
    </motion.div>
  );
};

export const SearchSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="w-full h-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
    </div>
  );
};

export default CountryCardSkeleton;
