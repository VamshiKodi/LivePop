import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PopulationService, type RegionData, api } from '../services/api';
import { FaEdit, FaSave, FaTimes, FaSignOutAlt, FaSearch, FaHistory } from 'react-icons/fa';

interface EditFormState {
    baselinePopulation?: number;
    birthsPerSec?: number;
    deathsPerSec?: number;
    migrationPerSec?: number;
}

const AdminDashboard: React.FC = () => {
    const [regions, setRegions] = useState<RegionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingRegion, setEditingRegion] = useState<RegionData | null>(null);
    const [editForm, setEditForm] = useState<EditFormState>({});
    const [saveLoading, setSaveLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const data = await PopulationService.getAllRegions();
            setRegions(data);
        } catch (err) {
            setMessage({ text: 'Failed to fetch regions', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const startEdit = (region: any) => {
        setEditingRegion(region);
        setEditForm({
            baselinePopulation: region.baselinePopulation,
            birthsPerSec: region.birthsPerSec,
            deathsPerSec: region.deathsPerSec,
            migrationPerSec: region.migrationPerSec,
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRegion) return;

        setSaveLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await api.put(`/regions/${editingRegion.code}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setMessage({ text: `Successfully updated ${editingRegion.name}`, type: 'success' });
                setEditingRegion(null);
                fetchData();
            }
        } catch (err: any) {
            setMessage({ text: err.response?.data?.error?.message || 'Update failed', type: 'error' });
        } finally {
            setSaveLoading(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        }
    };

    const filteredRegions = regions.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-dark text-white p-4 md:p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400">Manage real-time population data</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>

                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`p-4 rounded-xl mb-6 border ${
                                message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="text"
                                placeholder="Search countries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                            />
                        </div>

                        <div className="glass-card overflow-hidden border border-white/10">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Country</th>
                                            <th className="px-6 py-4">Population</th>
                                            <th className="px-6 py-4">Net Rate/s</th>
                                            <th className="px-6 py-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loading ? (
                                            <tr><td colSpan={4} className="px-6 py-8 text-center text-accent">Loading data...</td></tr>
                                        ) : filteredRegions.map(region => (
                                            <tr key={region.code} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl">{region.code.length === 2 ? String.fromCodePoint(...region.code.toUpperCase().split('').map(c => c.charCodeAt(0) + 127397)) : '🌍'}</span>
                                                        <div>
                                                            <div className="font-bold">{region.name}</div>
                                                            <div className="text-xs text-gray-500">{region.code}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-accent">
                                                    {Math.floor(region.populationNow).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={region.growthRate >= 0 ? 'text-green-400' : 'text-red-400'}>
                                                        {(region.birthsPerSec - region.deathsPerSec + region.migrationPerSec).toFixed(4)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button 
                                                        onClick={() => startEdit(region)}
                                                        className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-dark transition-all"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Edit Section */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {editingRegion ? (
                                <motion.div
                                    key="edit-form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="glass-card p-6 border border-accent/30 shadow-[0_0_30px_rgba(0,198,255,0.1)] sticky top-24"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-accent flex items-center gap-2">
                                            <FaEdit /> Edit {editingRegion.name}
                                        </h2>
                                        <button onClick={() => setEditingRegion(null)} className="text-gray-500 hover:text-white">
                                            <FaTimes />
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpdate} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Baseline Population</label>
                                            <input 
                                                type="number" 
                                                value={editForm.baselinePopulation}
                                                onChange={(e) => setEditForm({...editForm, baselinePopulation: Number(e.target.value)})}
                                                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/50 outline-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Births/s</label>
                                                <input 
                                                    type="number" step="0.0001"
                                                    value={editForm.birthsPerSec}
                                                    onChange={(e) => setEditForm({...editForm, birthsPerSec: Number(e.target.value)})}
                                                    className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/50 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Deaths/s</label>
                                                <input 
                                                    type="number" step="0.0001"
                                                    value={editForm.deathsPerSec}
                                                    onChange={(e) => setEditForm({...editForm, deathsPerSec: Number(e.target.value)})}
                                                    className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/50 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Migr./s</label>
                                                <input 
                                                    type="number" step="0.0001"
                                                    value={editForm.migrationPerSec}
                                                    onChange={(e) => setEditForm({...editForm, migrationPerSec: Number(e.target.value)})}
                                                    className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-accent/50 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={saveLoading}
                                            className="w-full py-3 bg-gradient-to-r from-accent to-accent2 text-dark font-bold rounded-xl shadow-lg hover:shadow-accent/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            {saveLoading ? <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" /> : <><FaSave /> Save Changes</>}
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="info-card"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass-card p-6 border border-white/10 text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
                                        <FaHistory size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold">Select a Country</h3>
                                    <p className="text-sm text-gray-400">Click the edit icon on any country in the list to update its population baseline or growth rates.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
