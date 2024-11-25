import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

function PersonalInfo() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: userProfile?.fullName || '',
    phoneNumber: userProfile?.phoneNumber || '',
    caregiverRole: userProfile?.caregiverRole || '',
    relationship: userProfile?.relationship || '',
    yearsExperience: userProfile?.yearsExperience || '',
    preferredContact: userProfile?.preferredContact || 'email',
    timezone: userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const handleSave = async () => {
    try {
      // TODO: Implement save functionality
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Personal Information</h1>
        <button
          onClick={() => navigate('/profile')}
          className="text-gray-600 hover:text-gray-900"
        >
          Back to Profile
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {isEditing ? (
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Caregiver Role</label>
              <select
                value={profileData.caregiverRole}
                onChange={(e) => setProfileData({ ...profileData, caregiverRole: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select Role</option>
                <option value="family">Family Caregiver</option>
                <option value="professional">Professional Caregiver</option>
                <option value="both">Both</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Relationship to Care Recipient</label>
              <input
                type="text"
                value={profileData.relationship}
                onChange={(e) => setProfileData({ ...profileData, relationship: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                value={profileData.yearsExperience}
                onChange={(e) => setProfileData({ ...profileData, yearsExperience: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
              <select
                value={profileData.preferredContact}
                onChange={(e) => setProfileData({ ...profileData, preferredContact: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                Edit Profile
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-gray-600">Full Name:</span>
                <span className="ml-2 text-gray-900">{profileData.fullName || 'Not set'}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone Number:</span>
                <span className="ml-2 text-gray-900">{profileData.phoneNumber || 'Not set'}</span>
              </div>
              <div>
                <span className="text-gray-600">Caregiver Role:</span>
                <span className="ml-2 text-gray-900">{profileData.caregiverRole || 'Not set'}</span>
              </div>
              <div>
                <span className="text-gray-600">Relationship:</span>
                <span className="ml-2 text-gray-900">{profileData.relationship || 'Not set'}</span>
              </div>
              <div>
                <span className="text-gray-600">Years of Experience:</span>
                <span className="ml-2 text-gray-900">{profileData.yearsExperience || 'Not set'}</span>
              </div>
              <div>
                <span className="text-gray-600">Preferred Contact:</span>
                <span className="ml-2 text-gray-900">{profileData.preferredContact || 'Not set'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalInfo;