import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchWithAutocompleteProps {
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchWithAutocomplete: React.FC<SearchWithAutocompleteProps> = ({
  suggestions,
  value,
  onChange,
  placeholder = 'Search...',
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const filtered = suggestions
        .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <FaSearch
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
            isFocused ? 'text-accent' : 'text-gray-400'
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (value.trim() && filteredSuggestions.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-10 py-3 bg-white dark:bg-gray-800/80 border rounded-full text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 backdrop-blur-sm ${
            isFocused
              ? 'border-accent ring-2 ring-accent/25 shadow-[0_0_16px_rgba(0,198,255,0.2)]'
              : 'border-gray-300 dark:border-gray-600 shadow-none'
          }`}
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent transition-colors duration-200"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {filteredSuggestions.map((suggestion, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
                onClick={() => handleSelect(suggestion)}
                className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-accent transition-all duration-200 flex items-center gap-2"
              >
                <FaSearch size={11} className="text-gray-400 flex-shrink-0" />
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchWithAutocomplete;
