import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, LayoutDashboard, Map, Trophy, UserCircle, ThermometerSun } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8" />
            <span className="text-xl font-bold">PlantUp AI</span>
          </Link>
          
          <div className="flex space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-1 hover:text-green-200">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/data" className="flex items-center space-x-1 hover:text-green-200">
              <Map className="h-5 w-5" />
              <span>GIS Data</span>
            </Link>
            <Link to="/environmental" className="flex items-center space-x-1 hover:text-green-200">
              <ThermometerSun className="h-5 w-5" />
              <span>Environmental</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center space-x-1 hover:text-green-200">
              <Trophy className="h-5 w-5" />
              <span>Leaderboard</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 hover:text-green-200">
              <UserCircle className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link to="/chat" className="flex items-center space-x-1 hover:text-green-200">
              <UserCircle className="h-5 w-5" />
              <span>Chatbot</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;