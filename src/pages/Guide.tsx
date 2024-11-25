import React from 'react';
import Chat from '../components/Chat';

function Guide() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-6 tracking-tight">
          Partner in Aging Guide
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your trusted companion in the caregiving journey. Get immediate assistance with caregiving questions, resources, and support.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary-700 mb-4">
            AI Caregiving Assistant
          </h2>
          <p className="text-lg text-gray-600">
            Get immediate assistance with your caregiving questions. Our AI guide is here to help you navigate your journey.
          </p>
        </div>
        <Chat />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Products & Services</h2>
          <p className="text-gray-600 mb-4">
            Find essential caregiving supplies, medical equipment, and professional services carefully selected for your needs.
          </p>
          <button 
            onClick={() => window.location.href = '/store'}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors w-full"
          >
            Browse Products & Services
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resource Library</h2>
          <p className="text-gray-600 mb-4">
            Access our comprehensive collection of articles, guides, and expert advice on caregiving topics.
          </p>
          <button 
            onClick={() => window.location.href = '/library'}
            className="px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors w-full"
          >
            Explore Library
          </button>
        </div>
      </div>
    </div>
  );
}

export default Guide;