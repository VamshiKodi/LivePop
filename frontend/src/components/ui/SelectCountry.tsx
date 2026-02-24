import React from 'react';

interface SelectCountryProps {
    value: string;
    onChange: (value: string) => void;
    countries: { code: string; name: string }[];
    label?: string;
    disabled?: boolean;
}

const SelectCountry: React.FC<SelectCountryProps> = ({ value, onChange, countries, label, disabled }) => {
    return (
        <div className="relative inline-block w-full max-w-xs">
            {label && <label className="block text-gray-400 text-sm mb-1 ml-1">{label}</label>}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="block w-full px-4 py-3 pr-8 leading-tight text-white bg-gray-900/60 border border-white/10 rounded-xl appearance-none focus:outline-none focus:bg-gray-800 focus:border-cyan-500 cursor-pointer backdrop-blur-md transition-colors"
            >
                {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.name}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 text-cyan-500 pointer-events-none mt-6">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
            </div>
        </div>
    );
};

export default SelectCountry;
