import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const POSTS_COLLECTION = 'posts';

export async function createPost(post) {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...post,
      published: post.published || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    const newPost = await getDoc(docRef);
    if (!newPost.exists()) {
      throw new Error('Failed to create post');
    }
    
    const data = newPost.data();
    return {
      id: docRef.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating post:', error);
    toast.error('Failed to create post');
    throw error;
  }
}

export async function updatePost(id, updates) {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating post:', error);
    toast.error('Failed to update post');
    throw error;
  }
}

export async function deletePost(id) {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting post:', error);
    toast.error('Failed to delete post');
    throw error;
  }
}

export async function getPost(id) {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting post:', error);
    return null;
  }
}

export async function getAllPosts() {
  try {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('Error getting all posts:', error);
    toast.error('Failed to load posts');
    return [];
  }
}

export async function getPublishedPosts() {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('Error getting published posts:', error);
    toast.error('Failed to load posts');
    return [];
  }
}