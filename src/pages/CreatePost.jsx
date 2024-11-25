import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostEditor from '../components/PostEditor';

function CreatePost() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600 text-lg">You don't have permission to create posts.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PostEditor
        post={null}
        onSave={() => {
          navigate('/library');
        }}
        onCancel={() => {
          navigate('/library');
        }}
      />
    </div>
  );
}

export default CreatePost;