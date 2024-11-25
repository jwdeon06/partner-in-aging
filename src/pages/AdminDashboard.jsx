import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllProducts, deleteProduct } from '../services/products';
import { getAllPosts, deletePost } from '../services/posts';
import { getAllUsers, updateUserRole } from '../services/userService';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../services/categories';
import { getSchema, updateSchema } from '../services/schemaService';
import ProductEditor from '../components/ProductEditor';
import SchemaEditor from '../components/SchemaEditor';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('schema');
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProductEditor, setShowProductEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'schema':
          const currentSchema = await getSchema();
          setSchema(currentSchema);
          break;
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
        case 'categories':
          const fetchedCategories = await getAllCategories();
          setCategories(fetchedCategories);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSchemaUpdate = async (updatedSchema) => {
    try {
      await updateSchema(updatedSchema);
      setSchema(updatedSchema);
      toast.success('Schema updated successfully');
    } catch (error) {
      console.error('Error updating schema:', error);
      toast.error('Failed to update schema');
    }
  };

  // ... rest of the existing functions ...

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
            onClick={() => setActiveTab('schema')}
            className={`${
              activeTab === 'schema'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            Schema
          </button>
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
            onClick={() => setActiveTab('categories')}
            className={`${
              activeTab === 'categories'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
          >
            Categories
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

      {activeTab === 'schema' && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">User Profile Schema</h2>
          </div>
          <SchemaEditor schema={schema} onSave={handleSchemaUpdate} />
        </div>
      )}

      {/* ... rest of the existing tab content ... */}
    </div>
  );
}

export default AdminDashboard;