import React, { useState, useEffect } from 'react';
import { FaRss, FaBell, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface MilestoneAlert {
  id: string;
  title: string;
  description: string;
  threshold: number;
  notified: boolean;
}

const DEFAULT_MILESTONES: MilestoneAlert[] = [
  { id: '1', title: '8.2 Billion', description: 'World population hits 8.2 billion', threshold: 8200000000, notified: false },
  { id: '2', title: '8.5 Billion', description: 'World population hits 8.5 billion', threshold: 8500000000, notified: false },
  { id: '3', title: '9 Billion', description: 'World population hits 9 billion', threshold: 9000000000, notified: false },
  { id: '4', title: 'India #1', description: 'India becomes most populous country', threshold: 1420000000, notified: true },
];

export const RSSAlertButton: React.FC<{ currentWorldPop?: number }> = ({ currentWorldPop }) => {
  const [showAlerts, setShowAlerts] = useState(false);
  const [milestones, setMilestones] = useState<MilestoneAlert[]>(() => {
    const saved = localStorage.getItem('livepop_milestones');
    return saved ? JSON.parse(saved) : DEFAULT_MILESTONES;
  });
  const [subscribed, setSubscribed] = useState(() => {
    return localStorage.getItem('livepop_alerts_subscribed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('livepop_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    if (currentWorldPop && subscribed) {
      setMilestones(prev => prev.map(m => 
        !m.notified && currentWorldPop >= m.threshold 
          ? { ...m, notified: true } 
          : m
      ));
    }
  }, [currentWorldPop, subscribed]);

  const toggleSubscription = () => {
    const newState = !subscribed;
    setSubscribed(newState);
    localStorage.setItem('livepop_alerts_subscribed', newState.toString());
    if (newState) {
      setMilestones(DEFAULT_MILESTONES);
    }
  };

  const activeAlerts = milestones.filter(m => !m.notified);

  return (
    <div className="relative">
      <button
        onClick={() => setShowAlerts(!showAlerts)}
        className={`p-2 rounded-full transition-colors relative ${
          subscribed 
            ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500/30' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:text-orange-400'
        }`}
      >
        {subscribed ? <FaBell size={18} /> : <FaRss size={18} />}
        {activeAlerts.length > 0 && subscribed && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
            {activeAlerts.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showAlerts && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowAlerts(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaBell className="text-orange-500" />
                  Milestone Alerts
                </h4>
              </div>
              
              <div className="p-4 space-y-3">
                <button
                  onClick={toggleSubscription}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    subscribed
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {subscribed ? '✓ Alerts Enabled' : 'Enable Alerts'}
                </button>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {milestones.map(m => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg ${
                        m.notified 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                          : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {m.notified && <FaCheck size={12} />}
                        <span className="font-medium">{m.title}</span>
                      </div>
                      <p className="text-xs mt-1 opacity-70">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RSSAlertButton;
