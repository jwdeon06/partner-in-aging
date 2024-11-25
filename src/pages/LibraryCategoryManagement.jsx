import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../services/categories';
import toast from 'react-hot-toast';

function LibraryCategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    order: 0
  });
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          ...editingCategory,
          name: editingCategory.name,
          description: editingCategory.description,
          order: editingCategory.order
        });
        toast.success('Category updated successfully');
      } else {
        await createCategory({
          name: newCategory.name,
          description: newCategory.description,
          order: categories.length
        });
        toast.success('Category created successfully');
      }
      loadCategories();
      setEditingCategory(null);
      setNewCategory({ name: '', description: '', order: 0 });
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    try {
      await deleteCategory(category.id);
      toast.success('Category deleted successfully');
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleReorder = async (categoryId, direction) => {
    const currentIndex = categories.findIndex(c => c.id === categoryId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === categories.length - 1)
    ) {
      return;
    }

    const newCategories = [...categories];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap order values
    const temp = newCategories[currentIndex].order;
    newCategories[currentIndex].order = newCategories[swapIndex].order;
    newCategories[swapIndex].order = temp;

    try {
      await Promise.all([
        updateCategory(newCategories[currentIndex].id, { order: newCategories[currentIndex].order }),
        updateCategory(newCategories[swapIndex].id, { order: newCategories[swapIndex].order })
      ]);
      loadCategories();
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast.error('Failed to reorder categories');
    }
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600 text-lg">You don't have permission to manage categories.</p>
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Library Categories</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={editingCategory ? editingCategory.name : newCategory.name}
                onChange={(e) => editingCategory 
                  ? setEditingCategory({ ...editingCategory, name: e.target.value })
                  : setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={editingCategory ? editingCategory.description : newCategory.description}
                onChange={(e) => editingCategory
                  ? setEditingCategory({ ...editingCategory, description: e.target.value })
                  : setNewCategory({ ...newCategory, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleReorder(category.id, 'up')}
                      disabled={index === 0}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleReorder(category.id, 'down')}
                      disabled={index === categories.length - 1}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-gray-500 text-center">No categories yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryCategoryManagement;