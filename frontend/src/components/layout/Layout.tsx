import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
// import ParticleBackground from '../ui/ParticleBackground';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-dark/90 text-white transition-colors duration-300 relative font-sans selection:bg-accent selection:text-black overflow-hidden">
            {/* <ParticleBackground /> */}
            <Navbar />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none z-0" />
            <main className="flex-grow pt-16 relative z-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
