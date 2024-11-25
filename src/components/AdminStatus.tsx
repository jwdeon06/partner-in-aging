import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { initializeUserAsAdmin } from '../services/userService';
import toast from 'react-hot-toast';

export default function AdminStatus() {
  const { user, userProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const makeAdmin = async () => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      await initializeUserAsAdmin(user.uid);
      // Force reload to update context
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.message || 'Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  };

  // Don't show the button if user is already admin
  if (!user || userProfile?.role === 'admin') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <button
        onClick={makeAdmin}
        disabled={isUpdating}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isUpdating ? 'Making Admin...' : 'Make Admin'}
      </button>
    </div>
  );
}