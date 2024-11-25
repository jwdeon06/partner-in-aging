import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to Partner in Aging
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your trusted companion in the caregiving journey. Access our library of resources, shop for essential products, and get expert assistance.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/store" 
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Browse Products & Services
          </Link>
          <Link 
            to="/library" 
            className="px-6 py-3 bg-white text-primary-500 border-2 border-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Explore Library
          </Link>
          <Link 
            to="/ai-guide" 
            className="px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
          >
            Chat with AI Guide
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Products</h2>
          <p className="text-gray-600 mb-4">
            Find essential caregiving supplies, medical equipment, and comfort items carefully selected for your needs.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
          <p className="text-gray-600 mb-4">
            Access professional consultations, care planning sessions, and support groups to help you on your caregiving journey.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resources</h2>
          <p className="text-gray-600 mb-4">
            Explore our comprehensive library of articles, guides, and expert advice on caregiving topics.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;