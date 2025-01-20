import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import TreeDensity from './components/TreeDensity';
import Weather from './components/Weather';
import './index.css'
import ChatInterface from './components/ChatInterface';

function App() {
  return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={
              <div className=" main-container text-center py-20">
                <h1 className="main-text text-4xl font-bold text-green-700 mb-4">Welcome to PlantUp AI</h1>
                <p className="text-xl text-white mb-8">Join our community in making the world greener, one tree at a time.</p>
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Green Environment"
                  className="rounded-lg w-full main-bg-img left-0 shadow-lg mx-auto mb-8 absolute top-0 -z-10"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Track Your Impact</h3>
                    <p className="text-gray-600">Monitor your environmental contributions and compete with others.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">GIS Integration</h3>
                    <p className="text-gray-600">Find optimal planting locations using advanced mapping technology.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Community Driven</h3>
                    <p className="text-gray-600">Join forces with others to create lasting environmental change.</p>
                  </div>
                </div>
              </div>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/data" element={<TreeDensity/>} />
            <Route path="/environmental" element={<ChatInterface/>} />
          </Routes>
        </main>
      </div>
  );
}

export default App;