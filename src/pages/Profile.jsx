import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Calendar from '../components/profile/Calendar';
import TodoList from '../components/profile/TodoList';
import CareRecipientInfo from '../components/profile/CareRecipientInfo';
import CarePlanSection from '../components/profile/CarePlanSection';

function Profile() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Care Plan</h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Create Your Account
            </h2>
            <p className="text-blue-800 mb-6">
              Join us to access exclusive features:
            </p>
            <ul className="list-disc list-inside text-blue-800 mb-6 space-y-2">
              <li>Save your AI Guide conversations</li>
              <li>Get personalized caregiving assistance</li>
              <li>Track your interactions</li>
              <li>Access premium content</li>
            </ul>
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-500 border border-blue-500 px-6 py-3 rounded-lg hover:bg-blue-50 inline-block"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Preview Features
            </h2>
            <p className="text-gray-600 mb-4">
              You can try our AI Guide without an account, but your conversations won't be saved.
            </p>
            <Link
              to="/ai-guide"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Try the AI Guide →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Care Plan</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link 
          to="/profile/account"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Account Information</h2>
          <p className="text-gray-600">
            Manage your account settings, email, and security preferences
          </p>
        </Link>

        <Link
          to="/profile/personal"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h2>
          <p className="text-gray-600">
            Update your personal details, preferences, and caregiver information
          </p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <CareRecipientInfo />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <CarePlanSection />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar</h2>
          <Calendar />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Todo List</h2>
          <TodoList />
        </div>
      </div>
    </div>
  );
}

export default Profile;