import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const CATEGORIES_COLLECTION = 'library-categories';

export async function createCategory(category) {
  try {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), category);
    return { id: docRef.id, ...category };
  } catch (error) {
    console.error('Error creating category:', error);
    toast.error('Failed to create category');
    throw error;
  }
}

export async function updateCategory(id, updates) {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating category:', error);
    toast.error('Failed to update category');
    throw error;
  }
}

export async function deleteCategory(id) {
  try {
    // Check if there are any posts using this category
    const postsQuery = query(collection(db, 'posts'), where('categoryId', '==', id));
    const posts = await getDocs(postsQuery);
    
    if (!posts.empty) {
      throw new Error('Cannot delete category that has posts. Please reassign or delete the posts first.');
    }
    
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.error(error.message || 'Failed to delete category');
    throw error;
  }
}

export async function getAllCategories() {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    toast.error('Failed to load categories');
    throw error;
  }
}