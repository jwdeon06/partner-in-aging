import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, userProfile } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary-700 font-bold' : 'text-neutral-900 hover:text-primary-700';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-700">
            Partner in Aging
          </Link>
          <div className="flex items-center space-x-8">
            <Link to="/" className={`${isActive('/')} font-semibold text-lg transition-colors`}>
              Guide
            </Link>
            <Link to="/store" className={`${isActive('/store')} font-semibold text-lg transition-colors`}>
              Store
            </Link>
            <Link to="/library" className={`${isActive('/library')} font-semibold text-lg transition-colors`}>
              Library
            </Link>
            <Link to="/connect" className={`${isActive('/connect')} font-semibold text-lg transition-colors`}>
              Connect
            </Link>
            <Link to="/profile" className={`${isActive('/profile')} font-semibold text-lg transition-colors`}>
              Care Plan
            </Link>
            {userProfile?.role === 'admin' && (
              <Link to="/admin" className={`${isActive('/admin')} font-semibold text-lg transition-colors`}>
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;