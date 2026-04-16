import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import AdminView from './pages/AdminView';
import OptionsView from './pages/OptionsView';
import Documentation from './pages/Documentation';

import LandingPage from './pages/LandingPage';

const AppLayout = ({ children }) => (
  <div className="fixed inset-0 flex h-[100dvh] w-screen bg-slate-50 overflow-hidden font-sans antialiased text-lab-text">
    <Sidebar className="h-full shrink-0" />
    <main className="flex-1 flex flex-col relative h-full min-w-0 bg-white overflow-hidden">
      {children}
    </main>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Marketing Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected/Dashboard Routes */}
        <Route path="/chat" element={<AppLayout><ChatInterface /></AppLayout>} />
        <Route path="/admin" element={<AppLayout><AdminView /></AppLayout>} />
        <Route path="/options" element={<AppLayout><OptionsView /></AppLayout>} />
        <Route path="/docs" element={<AppLayout><Documentation /></AppLayout>} />
      </Routes>
    </Router>
  );
}
