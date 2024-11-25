import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPost } from '../services/posts';
import PostEditor from '../components/PostEditor';
import toast from 'react-hot-toast';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    if (!id) return;
    try {
      const fetchedPost = await getPost(id);
      if (!fetchedPost) {
        toast.error('Post not found');
        navigate('/library');
        return;
      }
      setPost(fetchedPost);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load post');
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600 text-lg">You don't have permission to edit posts.</p>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PostEditor
        post={post}
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