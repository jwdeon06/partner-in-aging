import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPublishedCarePlans, assignCarePlan } from '../services/carePlans';
import { CarePlan } from '../types';
import toast from 'react-hot-toast';

export default function CarePlanBrowser() {
  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCarePlans();
  }, []);

  const loadCarePlans = async () => {
    try {
      const plans = await getPublishedCarePlans();
      setCarePlans(plans);
    } catch (error) {
      console.error('Error loading care plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPlan = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await assignCarePlan(user.uid, planId);
      navigate('/profile');
    } catch (error) {
      console.error('Error assigning care plan:', error);
      toast.error('Failed to assign care plan');
    }
  };

  const filteredPlans = selectedDifficulty === 'all'
    ? carePlans
    : carePlans.filter(plan => plan.difficulty === selectedDifficulty);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Care Plans</h1>
        <p className="text-xl text-gray-600">
          Browse and select from our curated collection of care plans designed to support your caregiving journey.
        </p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Difficulty</label>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {plan.featuredImage && (
              <img
                src={plan.featuredImage}
                alt={plan.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{plan.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  plan.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  plan.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recommended for:</h3>
                <div className="flex flex-wrap gap-2">
                  {plan.recommendedFor.map((item, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Duration: {plan.duration}</span>
                <button
                  onClick={() => handleAssignPlan(plan.id)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Select Plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No care plans found for the selected difficulty level.</p>
        </div>
      )}
    </div>
  );
}