import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

function AccountInfo() {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Information</h1>
        <button
          onClick={() => navigate('/profile')}
          className="text-gray-600 hover:text-gray-900"
        >
          Back to Care Plan
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 text-gray-900">{user.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Account Type:</span>
              <span className="ml-2 text-gray-900 capitalize">{userProfile?.role || 'Member'}</span>
            </div>
            <div>
              <span className="text-gray-600">Member Since:</span>
              <span className="ml-2 text-gray-900">
                {new Date(userProfile?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {userProfile?.role === 'admin' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Access</h2>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-900 mb-4">
                You have administrative privileges. Access the admin dashboard to manage content and users.
              </p>
              <button
                onClick={() => navigate('/admin')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Go to Admin Dashboard
              </button>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;