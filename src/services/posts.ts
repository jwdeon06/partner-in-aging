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
import { Post } from '../types';
import toast from 'react-hot-toast';

const POSTS_COLLECTION = 'posts';

export async function getAllPosts(): Promise<Post[]> {
  try {
    console.log('Fetching posts...'); // Debug log
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    
    console.log('Fetched posts:', posts); // Debug log
    return posts;
  } catch (error) {
    console.error('Error getting all posts:', error);
    toast.error('Failed to load posts');
    return [];
  }
}