import React, { useEffect } from 'react';
import { auth } from '../config/firebase';

export default function ForceSignOut() {
  useEffect(() => {
    const forceSignOut = async () => {
      try {
        // Clear all auth states
        await auth.signOut();
        
        // Clear storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Force a complete reload to clear all states
        window.location.href = '/';
      } catch (error) {
        console.error('Force sign out error:', error);
        // Fallback: force reload anyway
        window.location.href = '/';
      }
    };

    forceSignOut();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Signing out...</p>
      </div>
    </div>
  );
}