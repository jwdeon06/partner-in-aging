import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/products';
import { getAllPosts } from '../services/posts';
import { getAllUsers } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { Product, Post, UserProfile } from '../types';
import ProductEditor from '../components/ProductEditor';
import toast from 'react-hot-toast';

type TabType = 'products' | 'posts' | 'users';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductEditor, setShowProductEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile?.role !== 'admin') return;
    loadData();
  }, [activeTab, userProfile]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'products':
          const fetchedProducts = await getAllProducts();
          setProducts(fetchedProducts);
          break;
        case 'posts':
          const fetchedPosts = await getAllPosts();
          setPosts(fetchedPosts);
          break;
        case 'users':
          const fetchedUsers = await getAllUsers();
          setUsers(fetchedUsers);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600 text-lg">You don't have permission to access the admin dashboard.</p>
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`${
              activeTab === 'products'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`${
              activeTab === 'posts'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            Users
          </button>
        </nav>
      </div>

      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Products</h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductEditor(true);
              }}
              className="brand-button"
            >
              Add New Product
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductEditor(true);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No products available. Add your first product!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'posts' && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Library Content</h2>
            <button
              onClick={() => navigate('/create-post')}
              className="brand-button"
            >
              Add New Post
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No posts available. Create your first post!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold mb-8">Users</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.uid}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No users registered yet.</p>
            </div>
          )}
        </div>
      )}

      {showProductEditor && (
        <ProductEditor
          product={editingProduct}
          onSave={() => {
            setShowProductEditor(false);
            setEditingProduct(null);
            loadData();
          }}
          onCancel={() => {
            setShowProductEditor(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}