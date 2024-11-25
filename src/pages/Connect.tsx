import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroups } from '../hooks/useGroups';

export default function Connect() {
  const { user, userProfile } = useAuth();
  const { groups, loading } = useGroups();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-primary-700 mb-6">Connect with Others</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-600 mb-6">
            Please sign in to access the community features and chat with caregiving experts.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-white text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-primary-700 mb-8">Connect with Others</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat with Experts</h2>
          <p className="text-gray-600 mb-6">
            Get personalized support and advice from our caregiving experts through one-on-one chat.
          </p>
          <Link
            to="/connect/admin-chat"
            className="block w-full text-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Start Chat
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Community Groups</h2>
            {userProfile?.role === 'admin' && (
              <Link
                to="/connect/create-group"
                className="px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 text-sm"
              >
                Create Group
              </Link>
            )}
          </div>
          <p className="text-gray-600 mb-6">
            Join community groups to connect with other caregivers, share experiences, and get support.
          </p>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map(group => (
                <Link
                  key={group.id}
                  to={`/connect/group/${group.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-600">{group.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {group.memberCount} members • {group.postCount} posts
                  </div>
                </Link>
              ))}
              {groups.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No community groups available yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}