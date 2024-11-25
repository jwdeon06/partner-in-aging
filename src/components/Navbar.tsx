import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

function Navbar() {
  const { user, userProfile, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            Partner in Aging
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/library" className="text-gray-600 hover:text-gray-900">
              Library
            </Link>
            <Link to="/store" className="text-gray-600 hover:text-gray-900">
              Store
            </Link>
            {user ? (
              <>
                <Link to="/chat" className="text-gray-600 hover:text-gray-900">
                  Chat
                </Link>
                <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
                  Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                {userProfile?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="brand-button">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;