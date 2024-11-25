import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface CareRecipientData {
  description: string;
  relationship: string;
  primaryNeeds: string;
  lastUpdated: string;
}

export default function CareRecipientInfo() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CareRecipientData>({
    description: '',
    relationship: '',
    primaryNeeds: '',
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'careRecipients', 'primary');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setData(docSnap.data() as CareRecipientData);
      }
    } catch (error) {
      console.error('Error loading care recipient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'careRecipients', 'primary');
      await setDoc(docRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      });
      setIsEditing(false);
      toast.success('Care recipient information saved');
    } catch (error) {
      console.error('Error saving care recipient data:', error);
      toast.error('Failed to save information');
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
        <h2 className="text-xl font-semibold text-gray-900">Care Recipient Information</h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          {isEditing ? 'Save Changes' : 'Edit Information'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship to Care Recipient
            </label>
            <input
              type="text"
              value={data.relationship}
              onChange={(e) => setData({ ...data, relationship: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Son, Daughter, Spouse"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description of Care Recipient
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              rows={4}
              placeholder="Describe the person you are caring for..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Care Needs
            </label>
            <textarea
              value={data.primaryNeeds}
              onChange={(e) => setData({ ...data, primaryNeeds: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="List the main care needs and requirements..."
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {data.relationship || data.description || data.primaryNeeds ? (
            <>
              {data.relationship && (
                <div>
                  <h3 className="font-medium text-gray-900">Relationship</h3>
                  <p className="text-gray-600">{data.relationship}</p>
                </div>
              )}
              
              {data.description && (
                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{data.description}</p>
                </div>
              )}

              {data.primaryNeeds && (
                <div>
                  <h3 className="font-medium text-gray-900">Primary Care Needs</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{data.primaryNeeds}</p>
                </div>
              )}

              <div className="text-sm text-gray-500">
                Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No care recipient information added yet. Click 'Edit Information' to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
}