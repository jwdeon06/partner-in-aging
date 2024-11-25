import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGroup } from '../../hooks/useGroup';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function CommunityGroup() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user, userProfile } = useAuth();
  const { group, posts, loading, addPost, deletePost } = useGroup(groupId!);
  const [newPost, setNewPost] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await addPost({
        content: newPost,
        authorId: user!.uid,
        authorName: userProfile?.displayName || user!.email!,
        createdAt: new Date().toISOString()
      });
      setNewPost('');
      toast.success('Post added successfully');
    } catch (error) {
      console.error('Error adding post:', error);
      toast.error('Failed to add post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Group not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{group.name}</h1>
        <p className="text-gray-600">{group.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">New Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            placeholder="Share your thoughts or ask a question..."
          ></textarea>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              disabled={!newPost.trim()}
            >
              Post
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              {(userProfile?.role === 'admin' || post.authorId === user?.uid) && (
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
}