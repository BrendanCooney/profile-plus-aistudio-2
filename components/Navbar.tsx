import React from 'react';
import { BriefcaseIcon } from './icons';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout, onLoginClick }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="#" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
            <BriefcaseIcon className="w-8 h-8" />
            <span className="text-2xl font-bold">ProfilePlus</span>
          </a>
          <nav className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <a href="#/dashboard" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                <button
                  onClick={onLogout}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
