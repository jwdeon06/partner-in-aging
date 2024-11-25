import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="brand-input"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="brand-input"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="brand-button w-full">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}