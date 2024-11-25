import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserCarePlans, getPublishedCarePlans, assignCarePlan } from '../../services/carePlans';
import { CarePlan, UserCarePlan } from '../../types';
import toast from 'react-hot-toast';

export default function CarePlanSection() {
  const [userPlans, setUserPlans] = useState<UserCarePlan[]>([]);
  const [availablePlans, setAvailablePlans] = useState<CarePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBrowser, setShowBrowser] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [userPlanData, availablePlanData] = await Promise.all([
        getUserCarePlans(user.uid),
        getPublishedCarePlans()
      ]);
      setUserPlans(userPlanData);
      setAvailablePlans(availablePlanData);
    } catch (error) {
      console.error('Error loading care plans:', error);
      toast.error('Failed to load care plans');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPlan = async (planId: string) => {
    if (!user) return;

    try {
      await assignCarePlan(user.uid, planId);
      await loadData();
      setShowBrowser(false);
      toast.success('Care plan assigned successfully');
    } catch (error) {
      console.error('Error assigning care plan:', error);
      toast.error('Failed to assign care plan');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Care Plans</h2>
        <button
          onClick={() => setShowBrowser(!showBrowser)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          {showBrowser ? 'View My Plans' : 'Browse Plans'}
        </button>
      </div>

      {showBrowser ? (
        <div className="space-y-6">
          {availablePlans.map((plan) => (
            <div key={plan.id} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  plan.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  plan.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
                </span>
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
          ))}

          {availablePlans.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No care plans available at the moment.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {userPlans.map((userPlan) => (
            <div key={userPlan.id} className="bg-white border rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{userPlan.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span>Started: {new Date(userPlan.startDate).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>Progress: {userPlan.progress}%</span>
                </div>
              </div>

              <div className="space-y-3">
                {userPlan.tasks.map((task, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {/* TODO: Implement task completion */}}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">{task.title}</span>
                  </div>
                ))}
              </div>

              <textarea
                value={userPlan.notes}
                onChange={() => {/* TODO: Implement notes update */}}
                placeholder="Add notes about your progress..."
                className="mt-4 w-full p-2 border border-gray-300 rounded"
                rows={2}
              />
            </div>
          ))}

          {userPlans.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't selected any care plans yet.</p>
              <button
                onClick={() => setShowBrowser(true)}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Browse Available Plans
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}