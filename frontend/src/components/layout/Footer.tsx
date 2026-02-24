import React from 'react';
import { FaGithub, FaGlobe } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-gray-800 bg-dark/50 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col gap-1 items-center md:items-start opacity-70 hover:opacity-100 transition-opacity duration-300">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} LivePop. Real-time Population Counter.
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                            Data Sources: UN DESA • World Bank • National Official Statistics
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                            <FaGithub size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                            <FaGlobe size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
