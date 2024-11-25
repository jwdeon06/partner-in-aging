import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const PRODUCTS_COLLECTION = 'products';

export async function createProduct(product) {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error('Error creating product:', error);
    toast.error('Failed to create product');
    throw error;
  }
}

export async function updateProduct(id, updates) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Failed to update product');
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    toast.error('Failed to delete product');
    throw error;
  }
}

export async function getAllProducts() {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all products:', error);
    toast.error('Failed to load products');
    return [];
  }
}