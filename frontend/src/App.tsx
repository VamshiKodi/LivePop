import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import CountryDetails from './pages/CountryDetails';
import About from './pages/About';
import MilestonePage from './pages/Milestone';
import ComparePage from './pages/Compare';
import LeaderboardPage from './pages/Leaderboard';
import PopulationClockPage from './pages/PopulationClock';
import TimelinePage from './pages/Timeline';
import BirthdayCalculatorPage from './pages/BirthdayCalculator';
import DemographicsPage from './pages/Demographics';
import DensityPage from './pages/Density';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="country/:code" element={<CountryDetails />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="clock" element={<PopulationClockPage />} />
            <Route path="milestones" element={<MilestonePage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="birthday" element={<BirthdayCalculatorPage />} />
            <Route path="demographics" element={<DemographicsPage />} />
            <Route path="density" element={<DensityPage />} />
            <Route path="about" element={<About />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
};

export default App;
