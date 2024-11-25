import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPublishedPosts } from '../services/posts';
import { getAllCategories, LibraryCategory } from '../services/categories';
import { Post } from '../types';
import toast from 'react-hot-toast';

export default function Library() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Record<string, LibraryCategory>>({});
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fetchedPosts, fetchedCategories] = await Promise.all([
        getPublishedPosts(),
        getAllCategories()
      ]);

      setPosts(fetchedPosts);
      
      // Convert categories array to record for easier lookup
      const categoriesRecord = fetchedCategories.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as Record<string, LibraryCategory>);
      
      setCategories(categoriesRecord);
    } catch (error) {
      console.error('Error loading library data:', error);
      toast.error('Failed to load library content');
    } finally {
      setLoading(false);
    }
  };

  // Group posts by category
  const postsByCategory = posts.reduce((acc, post) => {
    const category = categories[post.categoryId || ''];
    const categoryName = category?.name || 'Uncategorized';
    
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Library</h1>
        {userProfile?.role === 'admin' && (
          <div className="space-x-4">
            <button
              onClick={() => navigate('/library-categories')}
              className="brand-button-outline"
            >
              Manage Categories
            </button>
            <button
              onClick={() => navigate('/create-post')}
              className="brand-button"
            >
              Add New Post
            </button>
          </div>
        )}
      </div>

      {Object.entries(postsByCategory).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts available.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(postsByCategory).map(([categoryName, categoryPosts]) => (
            <div key={categoryName} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">{categoryName}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                      <div 
                        className="text-gray-600 mb-4 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }}
                      />
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {userProfile?.role === 'admin' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => navigate(`/edit-post/${post.id}`)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}