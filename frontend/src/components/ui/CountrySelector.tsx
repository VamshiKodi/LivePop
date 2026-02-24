import React from 'react';
import { useNavigate } from 'react-router-dom';

const CountrySelector: React.FC = () => {
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        if (code) {
            navigate(`/country/${code}`);
        }
    };

    return (
        <div className="relative inline-block w-64">
            <select
                onChange={handleChange}
                className="block w-full px-4 py-3 pr-8 leading-tight text-white bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:bg-gray-700 focus:border-accent cursor-pointer"
                defaultValue=""
            >
                <option value="" disabled>Select a Country...</option>
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="CN">China</option>
                <option value="br">Brazil</option>
                <option value="ng">Nigeria</option>
                <option value="id">Indonesia</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
            </div>
        </div>
    );
};

export default CountrySelector;
